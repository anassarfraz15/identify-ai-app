'use client';

import { useState, useRef, useCallback, type DragEvent } from 'react';
import { Camera, UploadCloud, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  onImageReady: (dataUri: string) => void;
}

export function ImageUploader({ onImageReady }: ImageUploaderProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const cleanupStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  const handleFileChange = (file: File) => {
    if (file && ['image/jpeg', 'image/png', 'image/heic', 'image/webp'].includes(file.type)) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        setImagePreview(dataUri);
        onImageReady(dataUri);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please upload a valid image file (JPEG, PNG, HEIC, WEBP).');
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleCameraClick = async () => {
    setIsCapturing(true);
    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = streamRef.current;
      }
    } catch (err) {
      console.error("Error accessing camera: ", err);
      alert("Could not access camera. Please ensure you have given permission.");
      setIsCapturing(false);
    }
  };

  const handleCapture = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUri = canvas.toDataURL('image/jpeg');
        setImagePreview(dataUri);
        onImageReady(dataUri);
      }
      setIsCapturing(false);
      cleanupStream();
    }
  };

  const handleStopCapture = () => {
    setIsCapturing(false);
    cleanupStream();
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileChange(file);
    }
  };

  if (isCapturing) {
    return (
      <div className="w-full flex flex-col items-center gap-4 glass-card p-4 animate-in fade-in-50 duration-500">
        <video ref={videoRef} autoPlay playsInline className="w-full max-w-lg rounded-lg shadow-lg" />
        <div className="flex gap-4">
          <Button onClick={handleCapture} size="lg">
            <Camera className="mr-2 h-5 w-5" /> Capture
          </Button>
          <Button onClick={handleStopCapture} variant="ghost" size="icon">
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragOver={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'w-full max-w-xl mx-auto flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl text-center transition-all duration-300',
        isDragging ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
      )}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => e.target.files && handleFileChange(e.target.files[0])}
        accept="image/jpeg,image/png,image/heic,image/webp"
        className="hidden"
      />
      <div className="flex flex-col items-center gap-4">
        <div className="p-4 bg-primary/10 rounded-full text-primary">
            <UploadCloud className="w-12 h-12" />
        </div>
        <h3 className="text-2xl font-bold font-headline">Drag & Drop Image</h3>
        <p className="text-muted-foreground">or choose one of the options below</p>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Button onClick={handleUploadClick} size="lg">
            <ImageIcon className="mr-2 h-5 w-5" /> Upload from Device
          </Button>
          <Button onClick={handleCameraClick} variant="secondary" size="lg">
            <Camera className="mr-2 h-5 w-5" /> Use Camera
          </Button>
        </div>
      </div>
    </div>
  );
}
