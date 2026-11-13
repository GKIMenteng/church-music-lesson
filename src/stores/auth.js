import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import {
  createUserWithEmailAndPassword,
  getIdTokenResult,
  GoogleAuthProvider,
  onIdTokenChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth'
import { firebaseApp, firebaseAuth, firebaseConfigError } from '@/firebase/config'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const role = ref(null)
  const ready = ref(false)
  const initializationError = ref('')
  const profileError = ref('')
  const isConfigured = computed(() => Boolean(firebaseAuth))
  const profileSyncs = new Map()
  let initializationPromise

  function saveUserProfile(firebaseUser, userRole) {
    const syncKey = `${firebaseUser.uid}:${userRole}`
    const activeSync = profileSyncs.get(syncKey)
    if (activeSync) return activeSync
    if (!firebaseApp) throw new Error('Firebase is not configured.')

    const sync = (async () => {
      const { doc, getFirestore, runTransaction, serverTimestamp } =
        await import('firebase/firestore')
      const firestoreDb = getFirestore(firebaseApp)
      const profileRef = doc(firestoreDb, 'users', firebaseUser.uid)

      await runTransaction(firestoreDb, async transaction => {
        const snapshot = await transaction.get(profileRef)
        const profile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || '',
          photoURL: firebaseUser.photoURL || '',
          role: userRole,
          createdAt: snapshot.exists() ? snapshot.data().createdAt : serverTimestamp(),
          updatedAt: serverTimestamp(),
        }

        transaction.set(profileRef, profile)
      })
    })()

    profileSyncs.set(syncKey, sync)
    return sync.finally(() => profileSyncs.delete(syncKey))
  }

  async function syncUser(firebaseUser) {
    user.value = firebaseUser
    initializationError.value = ''
    profileError.value = ''

    if (!firebaseUser) {
      role.value = null
      ready.value = true
      return
    }

    try {
      const token = await getIdTokenResult(firebaseUser)
      role.value = token.claims.role === 'teacher' ? 'teacher' : 'student'
    } catch (error) {
      role.value = 'student'
      initializationError.value =
        'We could not verify your account role. You have student access until it can be verified.'
      console.error('Unable to verify Firebase account claims.', error)
      ready.value = true
      return
    }

    try {
      await saveUserProfile(firebaseUser, role.value)
    } catch (error) {
      profileError.value =
        'You are signed in, but your Firestore profile could not be saved. Check that Cloud Firestore is enabled and firestore.rules are deployed, then sign out and back in.'
      console.error('Unable to save the Firebase user profile.', error)
    } finally {
      ready.value = true
    }
  }

  function initialize() {
    if (initializationPromise) return initializationPromise

    if (!firebaseAuth) {
      initializationError.value = firebaseConfigError
      ready.value = true
      initializationPromise = Promise.resolve()
      return initializationPromise
    }

    initializationPromise = new Promise(resolve => {
      let firstAuthState = true
      onIdTokenChanged(firebaseAuth, async firebaseUser => {
        await syncUser(firebaseUser)
        if (firstAuthState) {
          firstAuthState = false
          resolve()
        }
      })
    })

    return initializationPromise
  }

  function requireFirebaseAuth() {
    if (!firebaseAuth) throw new Error(firebaseConfigError)
    return firebaseAuth
  }

  async function signInWithEmail(email, password) {
    const auth = requireFirebaseAuth()
    const credential = await signInWithEmailAndPassword(auth, email, password)
    await syncUser(credential.user)
  }

  async function registerWithEmail(email, password) {
    const auth = requireFirebaseAuth()
    const credential = await createUserWithEmailAndPassword(auth, email, password)
    await syncUser(credential.user)
  }

  async function signInWithGoogle() {
    const auth = requireFirebaseAuth()
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({ prompt: 'select_account' })
    const credential = await signInWithPopup(auth, provider)
    await syncUser(credential.user)
  }

  async function signOut() {
    const auth = requireFirebaseAuth()
    await firebaseSignOut(auth)
    user.value = null
    role.value = null
  }

  const displayName = computed(() => {
    if (user.value?.displayName) return user.value.displayName
    return user.value?.email?.split('@')[0] || ''
  })

  return {
    user,
    role,
    ready,
    displayName,
    isConfigured,
    initializationError,
    profileError,
    initialize,
    signInWithEmail,
    registerWithEmail,
    signInWithGoogle,
    signOut,
  }
})
