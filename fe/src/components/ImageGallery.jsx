import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Trash2, Upload, X, Plus, Image } from 'lucide-react';
import { useFeatures } from '../context/FeatureContext';

const ImageGallery = ({ images = [], onAddImage, onDeleteImage }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [imageName, setImageName] = useState('');
  const fileInputRef = useRef(null);
  const { currentFeature } = useFeatures();

  useEffect(() => {
    // Reset index when images change
    if (images.length > 0 && currentIndex >= images.length) {
      setCurrentIndex(images.length - 1);
    }
    if (images.length === 0) {
      setCurrentIndex(0);
    }
  }, [images, currentIndex]);

  const handlePrev = () => {
    if (images.length > 0) {
      setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
    }
  };

  const handleNext = () => {
    if (images.length > 0) {
      setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file) => {
    // Preview the image
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
    
    // Set the uploaded file
    setUploadedFile(file);
    setImageName(file.name.split('.')[0]); // Default name is file name without extension
    setIsUploading(true);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSaveImage = async () => {
    if (!uploadedFile || !imageName) return;
    
    try {
      const formData = new FormData();
      formData.append('image', uploadedFile);
      formData.append('name', imageName);
      
      if (currentFeature) {
        formData.append('featureId', currentFeature._id);
      }
      
      await onAddImage(formData);
      
      // Reset the form
      setIsUploading(false);
      setUploadedFile(null);
      setPreviewUrl('');
      setImageName('');
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleDeleteImage = async (id) => {
    try {
      await onDeleteImage(id);
      if (currentIndex >= images.length - 1) {
        setCurrentIndex(Math.max(0, images.length - 2));
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-md font-medium">Component Snapshots</h3>
        {!isUploading && (
          <button 
            className="btn btn-sm btn-primary"
            onClick={() => setIsUploading(true)}
          >
            <Plus size={16} className="mr-1" /> Add Image
          </button>
        )}
      </div>
      
      {isUploading ? (
        <div className="border border-gray-200 rounded-lg p-4 bg-white">
          <div className="mb-3">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">Image Name:</label>
              <button
                className="btn btn-sm btn-ghost"
                onClick={() => {
                  setIsUploading(false);
                  setUploadedFile(null);
                  setPreviewUrl('');
                  setImageName('');
                }}
              >
                <X size={16} />
              </button>
            </div>
            <input 
              type="text" 
              className="input input-bordered w-full" 
              value={imageName}
              onChange={(e) => setImageName(e.target.value)}
              placeholder="Enter a name for this snapshot"
            />
          </div>

          <div 
            className={`border-2 border-dashed rounded-lg ${dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'} 
              h-64 flex flex-col items-center justify-center cursor-pointer relative`}
            onClick={previewUrl ? null : handleUploadClick}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />

            {previewUrl ? (
              <div className="w-full h-full flex items-center justify-center relative">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="max-h-full max-w-full object-contain"
                />
                <button 
                  className="absolute top-2 right-2 btn btn-sm btn-circle bg-white hover:bg-gray-100"
                  onClick={() => {
                    setPreviewUrl('');
                    setUploadedFile(null);
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <>
                <Upload size={32} className="text-gray-400 mb-2" />
                <p className="text-gray-500 text-center">
                  Drag & drop an image here, or click to select
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  Supports: JPG, PNG, GIF (max 5MB)
                </p>
              </>
            )}
          </div>
          
          <div className="flex justify-end mt-3">
            <button 
              className="btn btn-sm btn-primary"
              disabled={!uploadedFile || !imageName}
              onClick={handleSaveImage}
            >
              Save Image
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="border border-gray-200 rounded-lg h-64 bg-white flex items-center justify-center relative">
            {images.length > 0 ? (
              <>
                <img 
                  src={images[currentIndex]?.url} 
                  alt={images[currentIndex]?.name} 
                  className="max-h-full max-w-full object-contain p-2"
                />
                <div className="absolute top-2 right-2 flex space-x-1">
                  <button 
                    className="btn btn-sm btn-circle bg-white hover:bg-gray-100"
                    onClick={() => handleDeleteImage(images[currentIndex]._id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-75 px-3 py-1 rounded text-sm">
                  {images[currentIndex]?.name || 'Unnamed Image'}
                </div>
              </>
            ) : (
              <div className="text-center p-4">
                <Image size={48} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No images added yet</p>
                <p className="text-gray-400 text-sm mt-1">
                  Add images to showcase your component visuals
                </p>
                <button 
                  className="btn btn-sm btn-primary mt-3"
                  onClick={() => setIsUploading(true)}
                >
                  <Upload size={16} className="mr-1" /> Add First Image
                </button>
              </div>
            )}
          </div>
          
          {images.length > 1 && (
            <div className="flex justify-between mt-2">
              <button 
                className="btn btn-sm btn-circle"
                onClick={handlePrev}
              >
                <ArrowLeft size={16} />
              </button>
              <span className="text-sm text-gray-500">
                {currentIndex + 1} / {images.length}
              </span>
              <button 
                className="btn btn-sm btn-circle"
                onClick={handleNext}
              >
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ImageGallery;