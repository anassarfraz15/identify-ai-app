'use client';

import type { IdentifySpeciesOutput } from '@/ai/flows/identify-species';
import {
  AlertCircle,
  BookOpen,
  Globe,
  Layers,
  Leaf,
  Sparkles,
  ShieldCheck,
  Skull,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface SpeciesResultProps {
  result: IdentifySpeciesOutput;
  imagePreview: string;
  onReset: () => void;
}

interface InfoCardProps {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}

const InfoCard = ({ icon: Icon, title, children }: InfoCardProps) => (
  <Card className="glass-card h-full">
    <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
      <Icon className="w-6 h-6 text-primary" />
      <CardTitle className="text-lg font-headline">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">{children}</p>
    </CardContent>
  </Card>
);

export function SpeciesResult({ result, imagePreview, onReset }: SpeciesResultProps) {
  const lowConfidence = result.confidence < 70;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-1 flex flex-col items-center">
          <img
            src={imagePreview}
            alt={`Image of ${result.speciesName}`}
            className="rounded-2xl shadow-2xl object-cover w-full aspect-square"
            data-ai-hint="animal wildlife"
          />
        </div>
        <div className="md:col-span-2 space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <h1 className="text-4xl font-bold font-headline tracking-tight text-primary">{result.speciesName}</h1>
              <p className="text-lg text-muted-foreground flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <em>{result.scientificName}</em>
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold">Confidence</span>
                  <span className="font-bold text-primary">{result.confidence.toFixed(1)}%</span>
                </div>
                <Progress value={result.confidence} aria-label={`${result.confidence}% confidence`} />
              </div>
              {result.venomous !== undefined && (
                <div className="mt-4">
                  <Badge variant={result.venomous ? 'destructive' : 'default'} className="flex gap-2 items-center w-fit">
                    {result.venomous ? <Skull className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                    {result.venomous ? 'Venomous' : 'Non-Venomous'}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
           {lowConfidence && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Low Confidence</AlertTitle>
              <AlertDescription>
                The identification confidence is low. For a more accurate result, please try a clearer, higher-quality image.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <InfoCard icon={Layers} title="Classification">
          {result.speciesClassification}
        </InfoCard>
        <InfoCard icon={Globe} title="Habitat">
          {result.habitat}
        </InfoCard>
        <InfoCard icon={Leaf} title="Diet">
          {result.diet}
        </InfoCard>
        <InfoCard icon={ShieldCheck} title="Conservation Status">
          {result.conservationStatus}
        </InfoCard>
        <div className="sm:col-span-2 lg:col-span-3">
            <InfoCard icon={Sparkles} title="Interesting Facts">
                {result.interestingFacts}
            </InfoCard>
        </div>
      </div>
      
      <div className="text-center pt-4">
        <Button onClick={onReset} size="lg">Identify Another Species</Button>
      </div>
    </div>
  );
}
