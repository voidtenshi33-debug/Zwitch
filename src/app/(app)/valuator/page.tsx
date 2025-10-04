
'use client';

import React, { useState, Suspense, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from "next/image";
import { deviceValuator, type DeviceValuatorOutput } from '@/ai/flows/device-valuator-flow';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Sparkles, Tag, ImagePlus, X, Camera, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { CameraCapture } from '@/components/camera-capture';
import { PostItemForm } from '@/components/post-item-form';


const valuatorFormSchema = z.object({
  deviceType: z.string().min(1, 'Please select a device type.'),
  otherDeviceType: z.string().optional(),
  model: z.string().min(2, 'Please enter a model name.'),
  images: z.array(z.instanceof(File)).min(1, "Please upload at least one image showing the item's condition.").max(3, "You can upload a maximum of 3 images."),
}).refine(data => {
  if (data.deviceType === 'Other') {
    return data.otherDeviceType && data.otherDeviceType.length > 0;
  }
  return true;
}, {
  message: "Please specify the device type.",
  path: ["otherDeviceType"],
});

const deviceTypes = ["Mobile Phone", "Laptop", "Tablet", "Smartwatch", "Headphones", "Camera", "Other"];

const fileToDataUri = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
  });
};

type ValuatorResult = DeviceValuatorOutput & {
  images: File[];
};

function ValuatorPageContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ValuatorResult | null>(null);
  const { toast } = useToast();
  const [imagePreviews, setImagePreviews] = React.useState<string[]>([])
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const form = useForm<z.infer<typeof valuatorFormSchema>>({
    resolver: zodResolver(valuatorFormSchema),
    defaultValues: {
      deviceType: '',
      otherDeviceType: '',
      model: '',
      images: [],
    },
  });

  const deviceType = form.watch('deviceType');

  const rerunValuation = useCallback(async () => {
    const values = form.getValues();
    if (values.images.length === 0 || !values.deviceType || !values.model) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please provide device type, model, and at least one image to run the valuation.',
      });
      return;
    }
    await onSubmit(values);
  }, [form, onSubmit]);

  async function onSubmit(values: z.infer<typeof valuatorFormSchema>) {
    setIsLoading(true);
    // Don't clear old result, so the form stays visible
    // setResult(null); 
    try {
      const photoDataUris = await Promise.all(values.images.map(fileToDataUri));
      const finalDeviceType = values.deviceType === 'Other' ? values.otherDeviceType! : values.deviceType;

      const valuationResult = await deviceValuator({
        deviceType: finalDeviceType,
        model: values.model,
        photoDataUris: photoDataUris,
      });
      setResult({ ...valuationResult, images: values.images });
      toast({
        title: "Valuation Updated!",
        description: "We've refreshed the listing details based on your input."
      });
    } catch (error) {
      console.error('Error getting valuation:', error);
      toast({
        variant: 'destructive',
        title: 'Valuation Failed',
        description: 'There was an error trying to value your device. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const addImages = (files: File[]) => {
    const currentFiles = form.getValues("images");
    const combinedFiles = [...currentFiles, ...files];
    if (combinedFiles.length > 3) {
        toast({ variant: 'destructive', title: 'Too many images', description: 'You can upload a maximum of 3 images.' });
        return;
    }
    form.setValue("images", combinedFiles, { shouldValidate: true });
    const newPreviews = combinedFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(newPreviews);
  };

  const removeImage = (index: number) => {
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(updatedPreviews);
    
    const currentImages = form.getValues("images");
    currentImages.splice(index, 1);
    form.setValue("images", currentImages, { shouldValidate: true });
  };
  
  const handleImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addImages(Array.from(e.target.files));
    }
  };


  return (
    <div className="space-y-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
              <Tag className="h-6 w-6 text-primary" />
              AI Device Valuator
          </CardTitle>
          <CardDescription>
            Find out what your old electronics are worth. Provide a few details and photos to get an instant valuation and a pre-filled listing form.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="deviceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Device Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="e.g., Mobile Phone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {deviceTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {deviceType === 'Other' && (
                <FormField
                  control={form.control}
                  name="otherDeviceType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Please Specify Device Type</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Gaming Console" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand and Model</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Apple iPhone 11" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Condition Photos (up to 3)</FormLabel>
                    <FormDescription>Upload clear photos of the front, back, and any specific damage.</FormDescription>
                    <FormControl>
                      <div className="grid grid-cols-3 gap-4">
                        {imagePreviews.map((src, index) => (
                            <div key={index} className="relative aspect-square">
                                <Image src={src} alt={`Preview ${index+1}`} fill className="rounded-md object-cover" />
                                <Button type="button" size="icon" variant="destructive" className="absolute -top-2 -right-2 h-6 w-6 rounded-full" onClick={() => removeImage(index)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        {imagePreviews.length < 3 && (
                          <>
                            <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-muted-foreground/50 text-muted-foreground transition-colors hover:border-primary hover:text-primary">
                                <ImagePlus className="h-8 w-8" />
                                <span className="mt-2 text-xs text-center">Add Photo</span>
                                <input type="file" multiple accept="image/*" className="sr-only" onChange={handleImageInputChange} disabled={isLoading} />
                            </label>
                             <button type="button" onClick={() => setIsCameraOpen(true)} className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-muted-foreground/50 text-muted-foreground transition-colors hover:border-primary hover:text-primary">
                                <Camera className="h-8 w-8" />
                                <span className="mt-2 text-xs text-center">Use Camera</span>
                            </button>
                          </>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                {result ? "Re-run Valuation" : "Get My Valuation"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {isLoading && !result && (
        <div className="flex flex-col items-center justify-center text-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <h2 className="font-headline text-2xl font-bold">Analyzing your item... 🧠</h2>
            <p className="text-muted-foreground">Our AI is calculating the best value for you.</p>
        </div>
      )}

      {result && (
        <Card className="max-w-2xl mx-auto">
           <CardHeader>
             <CardTitle className="font-headline text-2xl flex items-center gap-2">
                <Wand2 className="h-6 w-6 text-primary"/>
                AI-Generated Listing
             </CardTitle>
             <CardDescription>We've pre-filled the details based on our AI valuation. Review, adjust, and post your item!</CardDescription>
           </CardHeader>
           <CardContent>
              <PostItemForm valuationData={result} />
           </CardContent>
        </Card>
      )}

      <Dialog open={isCameraOpen} onOpenChange={setIsCameraOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Capture Device Photo</DialogTitle>
            <DialogDescription>
              Center your device in the frame and take a clear picture.
            </DialogDescription>
          </DialogHeader>
          <CameraCapture
            onCapture={(file) => {
              addImages([file]);
              setIsCameraOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function ValuatorPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ValuatorPageContent />
    </Suspense>
  )
}

    