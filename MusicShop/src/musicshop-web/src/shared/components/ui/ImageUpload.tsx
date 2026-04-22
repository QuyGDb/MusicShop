import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/components';
import { uploadService } from '@/shared/services/uploadService';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove: () => void;
  className?: string;
  label?: string;
  aspectRatio?: 'square' | 'video' | 'portrait';
  folder?: string;
}

/**
 * A premium image upload component with drag & drop, preview, and progress states.
 */
export function ImageUpload({ 
  value, 
  onChange, 
  onRemove, 
  className,
  label = "Upload Image",
  aspectRatio = 'square',
  folder = "general"
}: ImageUploadProps) {
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

  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]'
  };

  return (
    <div className={cn("space-y-4 w-full", className)}>
      <div 
        className={cn(
          "relative border-2 border-dashed rounded-2xl overflow-hidden transition-all duration-300",
          aspectClasses[aspectRatio],
          isDragging ? "border-primary bg-primary/5 scale-[1.01]" : "border-border bg-muted/30 hover:bg-muted/50",
          value ? "border-none" : ""
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {value ? (
          <>
            <img 
              src={value} 
              alt="Preview" 
              className="w-full h-full object-cover animate-in fade-in zoom-in duration-500" 
            />
            <div className="absolute top-3 right-3 flex gap-2">
              <Button 
                type="button" 
                variant="destructive" 
                size="icon" 
                className="h-8 w-8 rounded-full shadow-lg"
                onClick={onRemove}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
               <p className="text-white text-xs font-bold uppercase tracking-wider">Change Image</p>
               <input 
                type="file" 
                className="absolute inset-0 opacity-0 cursor-pointer" 
                onChange={onFileChange}
                accept="image/*"
              />
            </div>
          </>
        ) : (
          <div 
            className="w-full h-full flex flex-col items-center justify-center p-6 text-center cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            {isUploading ? (
              <div className="space-y-4 flex flex-col items-center">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                <p className="text-sm font-medium text-muted-foreground">Uploading your magic...</p>
              </div>
            ) : (
              <>
                <div className="p-4 bg-primary/10 rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground">
                    Drag & drop or <span className="text-primary font-semibold underline">browse</span>
                  </p>
                  <p className="text-[10px] text-subtle pt-2">PNG, JPG, WEBP (Max 5MB)</p>
                </div>
              </>
            )}
            <input 
              type="file" 
              ref={fileInputRef}
              className="hidden" 
              onChange={onFileChange}
              accept="image/*"
            />
          </div>
        )}
      </div>

      {!value && !isUploading && (
        <div className="flex items-center gap-2 p-3 bg-muted/20 border border-border rounded-xl text-xs text-muted-foreground">
          <ImageIcon className="h-4 w-4 text-subtle" />
          Recommended size: 1080x1080px for best quality.
        </div>
      )}
    </div>
  );
}
