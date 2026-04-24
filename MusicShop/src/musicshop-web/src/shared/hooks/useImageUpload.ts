import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { uploadService } from '@/shared/services/uploadService';

interface UseImageUploadProps {
  onChange: (url: string) => void;
  folder?: string;
}

export function useImageUpload({ onChange, folder = 'general' }: UseImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }

    setIsUploading(true);
    
    try {
      const url = await uploadService.uploadImage(file, folder);
      onChange(url);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onBrowse = () => {
    fileInputRef.current?.click();
  };

  return {
    isDragging,
    isUploading,
    fileInputRef,
    onFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    onBrowse
  };
}
