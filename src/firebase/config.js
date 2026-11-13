import { getApp, getApps, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const requiredConfigKeys = ['apiKey', 'authDomain', 'projectId', 'appId']
const missingConfigKeys = requiredConfigKeys.filter(key => !firebaseConfig[key])

export const firebaseConfigError = missingConfigKeys.length
  ? `Firebase is not configured. Add ${missingConfigKeys.map(key => `VITE_FIREBASE_${key.replace(/[A-Z]/g, letter => `_${letter}`).toUpperCase()}`).join(', ')} to your local environment file.`
  : ''

export const firebaseApp = missingConfigKeys.length
  ? null
  : getApps().length
    ? getApp()
    : initializeApp(firebaseConfig)

export const firebaseAuth = firebaseApp ? getAuth(firebaseApp) : null
