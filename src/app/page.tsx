
'use client';

import { useState } from 'react';
import { Loader, Sparkles } from 'lucide-react';

import type { IdentifySpeciesOutput } from '@/ai/flows/identify-species';
import { identifySpecies } from '@/ai/flows/identify-species';
import { ImageUploader } from '@/components/image-uploader';
import { SpeciesResult } from '@/components/species-result';
import { ThemeToggle } from '@/components/theme-toggle';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);
  const [result, setResult] = useState<IdentifySpeciesOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleIdentify = async (dataUri: string) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setImageDataUri(dataUri);

    try {
      const res = await identifySpecies({ photoDataUri: dataUri });
      setResult(res);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(errorMessage);
      toast({
        title: 'Error Identifying Species',
        description: 'Could not identify the species. Please try another image.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImageDataUri(null);
    setResult(null);
    setError(null);
    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="relative flex-grow flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 overflow-hidden">
        <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-4xl mx-auto">
          {!result && !loading && (
            <header className="text-center mb-8">
              <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter flex items-center justify-center gap-3">
                <Sparkles className="w-10 h-10 text-primary" />
                NatureID
              </h1>
              <p className="text-muted-foreground mt-2 text-base sm:text-lg">Upload an image to identify any species.</p>
            </header>
          )}

          <div className="w-full transition-all duration-500">
            {!imageDataUri && <ImageUploader onImageReady={handleIdentify} />}
            
            {loading && (
              <div className="flex flex-col items-center justify-center gap-4 text-center p-8 rounded-lg">
                <Loader className="w-12 h-12 animate-spin text-primary" />
                <h2 className="text-2xl font-semibold font-headline">Analyzing your image...</h2>
                <p className="text-muted-foreground">Our AI is working its magic to identify the species.</p>
                {imageDataUri && (
                  <img src={imageDataUri} alt="Preview for analysis" className="mt-4 rounded-lg shadow-lg max-w-xs max-h-64 object-contain" />
                )}
              </div>
            )}
            
            {error && !loading && (
               <div className="text-center p-8">
                  <p className="text-destructive mb-4">{error}</p>
                  <Button onClick={handleReset}>Try again</Button>
              </div>
            )}

            {result && !loading && (
              <div className="animate-in fade-in-50 duration-500">
                <SpeciesResult result={result} imagePreview={imageDataUri!} onReset={handleReset} />
              </div>
            )}
          </div>
        </div>
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground">
        Developed by <span className="font-semibold">Anas Sarfraz</span>
      </footer>
    </div>
  );
}
