import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import 'firebase/compat/storage';
import 'firebase/compat/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBwp4qxPpfnKaZCm4zwIxlNxpezsWJ3ZeU",
    authDomain: "bebinapp-76d0b.firebaseapp.com",
    projectId: "bebinapp-76d0b",
    storageBucket: "bebinapp-76d0b.firebasestorage.app",
    messagingSenderId: "984163241721",
    appId: "1:984163241721:web:071971b1fd76627c0d1c28",
    measurementId: "G-CJC8QMQEW9"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const storage = firebase.storage();
const auth = firebase.auth();

export { db, storage, auth };

export function saveScene(modelUrl, modelName, type = 'model') {
    console.log('Saving scene metadata and file:', { modelUrl, modelName, type });
    const ref = db.ref('scenes').push();
    const sceneId = ref.key;

    // ذخیره متادیتا در Realtime Database
    ref.set({
        url: modelUrl,
        name: modelName,
        type: type,
        timestamp: Date.now(),
        creator: auth.currentUser?.uid || 'anonymous',
        location: null // بعداً با geoUtils پر می‌شه
    });

    // ذخیره فایل در Firebase Storage (اختیاری، برای پلن رایگان محدود)
    if (type === 'model') {
        const blob = new Blob([modelUrl], { type: 'model/gltf-binary' });
        const storageRef = storage.ref(`models/${modelName}_${sceneId}.glb`);
        storageRef.put(blob).then(snapshot => {
            snapshot.ref.getDownloadURL().then(downloadURL => {
                ref.update({ url: downloadURL });
            });
        });
    }

    return sceneId;
}

export function loadScenes(onSceneAdded, onUserCount) {
    console.log('Loading scenes from Firebase...');
    db.ref('scenes').limitToLast(10).on('child_added', (snapshot) => {
        console.log('Scene loaded:', snapshot.val());
        const data = snapshot.val();
        onSceneAdded(snapshot.key, data.url, data.name, data.type);
    });
    db.ref('users').on('value', (snapshot) => {
        console.log('Users count:', snapshot.numChildren());
        onUserCount(snapshot.numChildren());
    });
    const userRef = db.ref('users').push({ active: true });
    userRef.onDisconnect().remove();
}

export async function loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
        const result = await auth.signInWithPopup(provider);
        return result.user;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}