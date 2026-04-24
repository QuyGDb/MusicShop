import { useState, useRef, ChangeEvent, DragEvent, useEffect } from 'react';
import { uploadService } from '@/shared/services/uploadService';

interface UseImageUploadProps {
  value?: string | File;
  onChange: (value: string | File) => void;
  folder?: string;
  immediate?: boolean;
}

export function useImageUpload({ 
  value,
  onChange, 
  folder = 'general',
  immediate = true 
}: UseImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value instanceof File) {
      const url = URL.createObjectURL(value);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview(value as string || null);
    }
  }, [value]);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }

    if (!immediate) {
      onChange(file);
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
    preview,
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
