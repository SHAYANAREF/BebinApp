import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, set, onValue, onDisconnect } from "firebase/database";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBwp4qxPpfnKaZCm4zwIxlNxpezsWJ3ZeU",
  authDomain: "bebinapp-76d0b.firebaseapp.com",
  databaseURL: "https://bebinapp-76d0b-default-rtdb.firebaseio.com",
  projectId: "bebinapp-76d0b",
  storageBucket: "bebinapp-76d0b.firebasestorage.app",
  messagingSenderId: "984163241721",
  appId: "1:984163241721:web:071971b1fd76627c0d1c28",
  measurementId: "G-CJC8QMQEW9"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Temporarily disable App Check for local testing (replace with ReCaptcha Site Key for production)
const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider('6LfciPsqAAAAANpM7zVMonPNz_f2FMemarGT4Zmo'), // Firebase debug token for local testing
  isTokenAutoRefreshEnabled: true
});

// Export Firebase services
export { database as db, auth, appCheck, storage };

// Save scene function (updated to use storage and database)
export async function saveScene(file, fileName, type = 'model') {
  try {
    console.log('Saving scene metadata:', { fileName, type });
    
    // Upload file to Firebase Storage
    const storageReference = storageRef(storage, `models/${fileName}_${Date.now()}`);
    await uploadBytes(storageReference, file);
    const url = await getDownloadURL(storageReference);
    
    // Save metadata to Realtime Database
    const scenesRef = ref(database, 'scenes');
    const newSceneRef = push(scenesRef);
    const sceneId = newSceneRef.key;

    await set(newSceneRef, {
      url: url,
      name: fileName,
      type: type,
      timestamp: Date.now(),
      creator: auth.currentUser?.uid || 'anonymous',
      location: null // Will be updated later with geoUtils
    });

    return sceneId;
  } catch (error) {
    console.error('Save scene error:', error);
    throw new Error(`Firebase Error: ${error.message}`);
  }
}

// Load scenes and user count function
export function loadScenes(onSceneAdded, onUserCount) {
  console.log('Loading scenes from Firebase...');
  const scenesRef = ref(database, 'scenes');
  onValue(scenesRef, (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const data = childSnapshot.val();
      console.log('Scene loaded:', data);
      onSceneAdded(childSnapshot.key, data.url, data.name, data.type);
    });
  }, { onlyOnce: false });

  const usersRef = ref(database, 'users');
  onValue(usersRef, (snapshot) => {
    console.log('Users count:', snapshot.numChildren());
    onUserCount(snapshot.numChildren());
  }, { onlyOnce: false });

  const userRef = push(usersRef, { active: true });
  onDisconnect(userRef).remove();
}

// Google login function
export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}