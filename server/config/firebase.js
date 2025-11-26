// Import Firebase SDK functions
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Storage
const storage = getStorage(app);

console.log('✓ Firebase Client SDK initialized successfully');

/**
 * Upload a file to Firebase Storage
 * @param {string} path - Storage path (e.g., 'accounts/user123.jpg')
 * @param {Buffer} buffer - File buffer
 * @param {string} contentType - MIME type (e.g., 'image/jpeg')
 * @returns {Promise<string>} - Storage path
 */
export async function uploadFile(path, buffer, contentType) {
  try {
    const storageRef = ref(storage, path);
    const metadata = {
      contentType: contentType,
      cacheControl: 'public, max-age=3600', // Cache for 1 hour
    };
    
    await uploadBytes(storageRef, buffer, metadata);
    return path;
  } catch (error) {
    console.error('Firebase upload error:', error);
    throw new Error(`Failed to upload file: ${error.message}`);
  }
}

/**
 * Get download URL for a file
 * @param {string} path - Storage path
 * @returns {Promise<string|null>} - Download URL or null if not found
 */
export async function getFileUrl(path) {
  if (!path) return null;
  
  try {
    const storageRef = ref(storage, path);
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    if (error.code === 'storage/object-not-found') {
      // Silently return null - warnings are logged once by cache layer
      return null;
    }
    console.error('Firebase getDownloadURL error:', error);
    throw new Error(`Failed to get file URL: ${error.message}`);
  }
}

/**
 * Delete a file from Firebase Storage
 * @param {string} path - Storage path
 * @returns {Promise<boolean>} - True if deleted, false if not found
 */
export async function deleteFile(path) {
  if (!path) return false;
  
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
    return true;
  } catch (error) {
    if (error.code === 'storage/object-not-found') {
      console.warn(`File not found for deletion: ${path}`);
      return false;
    }
    console.error('Firebase delete error:', error);
    throw new Error(`Failed to delete file: ${error.message}`);
  }
}

// Export for use in other files
export { app, storage };
export default storage;
