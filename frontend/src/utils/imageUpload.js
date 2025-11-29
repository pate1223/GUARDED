import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { initializeFirebase } from '../services/firebase';

/**
 * Upload user profile photo to Firebase Storage
 * @param {File} file - The image file to upload
 * @param {string} userId - The user's ID
 * @returns {Promise<string>} The download URL of the uploaded image
 */
export const uploadProfilePhoto = async (file, userId) => {
  try {
    // Validate file
    if (!file) {
      throw new Error('No file provided');
    }

    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload a JPEG, PNG, or WebP image.');
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      throw new Error('File too large. Maximum size is 5MB.');
    }

    // Initialize Firebase
    await initializeFirebase();

    // Get storage reference
    const storage = getStorage();

    // Create unique file path: profile-photos/userId/timestamp_filename
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const storageRef = ref(storage, `profile-photos/${userId}/${fileName}`);

    // Upload file
    const snapshot = await uploadBytes(storageRef, file, {
      contentType: file.type,
      customMetadata: {
        uploadedBy: userId,
        uploadedAt: new Date().toISOString()
      }
    });

    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    return {
      success: true,
      url: downloadURL,
      path: snapshot.ref.fullPath
    };
  } catch (error) {
    console.error('Photo upload error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Delete user profile photo from Firebase Storage
 * @param {string} photoPath - The storage path of the photo to delete
 * @returns {Promise<boolean>} Success status
 */
export const deleteProfilePhoto = async (photoPath) => {
  try {
    if (!photoPath) {
      return { success: true, message: 'No photo to delete' };
    }

    const storage = getStorage();
    const photoRef = ref(storage, photoPath);

    await deleteObject(photoRef);

    return {
      success: true,
      message: 'Photo deleted successfully'
    };
  } catch (error) {
    console.error('Photo deletion error:', error);

    // If file doesn't exist, consider it a success
    if (error.code === 'storage/object-not-found') {
      return {
        success: true,
        message: 'Photo already deleted'
      };
    }

    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Compress image before upload (optional but recommended)
 * @param {File} file - The image file to compress
 * @param {number} maxWidth - Maximum width in pixels
 * @param {number} quality - Image quality (0-1)
 * @returns {Promise<File>} Compressed image file
 */
export const compressImage = (file, maxWidth = 800, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            resolve(compressedFile);
          },
          file.type,
          quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target.result;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};