import React, { useState, useRef } from 'react';
import { uploadProfilePhoto, compressImage } from '../utils/imageUpload';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';

const ProfilePhotoUpload = ({ currentPhotoURL, onPhotoUpdate }) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentPhotoURL);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploading(true);

      // Show preview immediately
      const previewURL = URL.createObjectURL(file);
      setPreview(previewURL);

      // Compress image
      const compressedFile = await compressImage(file, 400, 0.85);

      // Upload to Firebase Storage
      const uploadResult = await uploadProfilePhoto(compressedFile, user.uid);

      if (!uploadResult.success) {
        throw new Error(uploadResult.error);
      }

      // Update user profile in backend
      const updateResult = await apiService.updateProfilePhoto(uploadResult.url);

      if (updateResult.success) {
        // Notify parent component
        if (onPhotoUpdate) {
          onPhotoUpdate(uploadResult.url);
        }

        alert(t('photoUploadedSuccessfully') || 'Profile photo updated successfully!');
      } else {
        throw new Error(updateResult.error);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert(error.message || t('photoUploadFailed') || 'Failed to upload photo');
      setPreview(currentPhotoURL); // Reset to original
    } finally {
      setUploading(false);
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Profile Photo Display */}
      <div className="relative group">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-200 dark:border-purple-700 shadow-lg">
          {preview ? (
            <img
              src={preview}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={() => setPreview(null)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
              <span className="text-4xl text-white font-bold">
                {user?.email?.[0]?.toUpperCase() || '?'}
              </span>
            </div>
          )}
        </div>

        {/* Upload Overlay */}
        {!uploading && (
          <button
            onClick={handleClick}
            className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-full transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100"
          >
            <div className="text-white text-center">
              <svg
                className="w-8 h-8 mx-auto mb-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="text-xs">{t('changePhoto') || 'Change'}</span>
            </div>
          </button>
        )}

        {/* Uploading Spinner */}
        {uploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload Button (Alternative) */}
      <button
        onClick={handleClick}
        disabled={uploading}
        className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? t('uploading') || 'Uploading...' : t('uploadPhoto') || 'Upload Photo'}
      </button>

      {/* Instructions */}
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-xs">
        {t('photoInstructions') || 'Click to upload a profile photo. Max size: 5MB. Formats: JPEG, PNG, WebP'}
      </p>
    </div>
  );
};

export default ProfilePhotoUpload;