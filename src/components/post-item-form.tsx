
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import React, { useEffect, useState, Suspense, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { collection, addDoc, Timestamp } from "firebase/firestore"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useDebounce } from "use-debounce";

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { ImagePlus, Loader2, Sparkles, X, Camera, Tag, ArrowRight } from "lucide-react"
import { generateListingDescription } from "@/ai/flows/generate-listing-description"
import { deviceValuator, type DeviceValuatorOutput } from "@/ai/flows/device-valuator-flow"
import { categories } from "@/lib/categories"
import type { ItemCondition, ListingType } from "@/lib/types"
import { useFirestore, useUser } from "@/firebase"
import { Slider } from "./ui/slider"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { CameraCapture } from '@/components/camera-capture';
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"

const popularLocations = [
    'Kothrud',
    'Viman Nagar',
    'Koregaon Park',
    'Deccan Gymkhana',
    'Pimpri-Chinchwad',
    'Hadapsar',
    'Hinjawadi',
    'Aundh',
    'Baner',
    'Wakad',
    'Kharadi',
    'Camp',
];

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long."),
  brand: z.string().min(1, "Please enter the brand name.").optional(),
  description: z.string().min(20, "Description must be at least 20 characters long."),
  category: z.string().min(1, "Please select a category."),
  condition: z.string().min(1, "Please select the item's condition."),
  listingType: z.enum(["Sell", "Donate", "Spare Parts"]),
  price: z.number().optional(),
  locality: z.string().min(1, "Please select your locality."),
  images: z.array(z.instanceof(File)).min(1, "Please upload at least one image.").max(5, "You can upload a maximum of 5 images."),
}).refine(data => {
    if (data.listingType === "Sell") {
        return data.price !== undefined && data.price >= 0;
    }
    return true;
}, {
    message: "A valid price is required for items you want to sell.",
    path: ["price"],
});

const conditions: ItemCondition[] = ['New', 'Used - Like New', 'Used - Good', 'Needs Minor Repair', 'For Spare Parts', 'Working', 'For Parts Only'];

const fileToDataUri = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
  });
};

type ValuationData = DeviceValuatorOutput & {
    images: File[];
};
interface PostItemFormProps {
    valuationData?: ValuationData;
}

function PostItemFormContent({ valuationData }: PostItemFormProps) {
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const firestore = useFirestore()
  const { user: authUser } = useUser()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isDescriptionGenerating, setIsDescriptionGenerating] = React.useState(false)
  const [imagePreviews, setImagePreviews] = React.useState<string[]>([])
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [isValuating, setIsValuating] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      brand: "",
      description: "",
      category: "",
      condition: "",
      listingType: "Sell",
      price: undefined,
      locality: "",
      images: [],
    },
  })
  
  const listingType = form.watch("listingType")
  const formImages = form.watch('images');
  const formBrand = form.watch('brand');
  const formCategory = form.watch('category');

  const [debouncedBrand] = useDebounce(formBrand, 500);
  const [debouncedCategory] = useDebounce(formCategory, 500);

  useEffect(() => {
    if (valuationData) {
        form.setValue('title', valuationData.suggestedTitle);
        form.setValue('category', valuationData.suggestedCategory);
        form.setValue('description', valuationData.suggestedDescription);
        form.setValue('images', valuationData.images);
        
        const previews = valuationData.images.map(file => URL.createObjectURL(file));
        setImagePreviews(previews);

        if (valuationData.estimatedMinValue && valuationData.estimatedMaxValue) {
            const min = valuationData.estimatedMinValue;
            const max = valuationData.estimatedMaxValue;
            setMinPrice(min);
            setMaxPrice(max);
            const initialPrice = Math.round((min + max) / 2);
            setSelectedPrice(initialPrice);
            form.setValue('price', initialPrice);
        }
    } else {
        const title = searchParams.get('title');
        const category = searchParams.get('category');
        const minPriceParam = searchParams.get('minPrice');
        const maxPriceParam = searchParams.get('maxPrice');

        if (title) form.setValue('title', title);
        if (category) form.setValue('category', category);
        if (minPriceParam && maxPriceParam) {
            const min = parseInt(minPriceParam, 10);
            const max = parseInt(maxPriceParam, 10);
            setMinPrice(min);
            setMaxPrice(max);
            const initialPrice = Math.round((min + max) / 2);
            setSelectedPrice(initialPrice);
            form.setValue('price', initialPrice);
        }
    }
  }, [valuationData, searchParams, form]);


  const triggerValuation = useCallback(async (brand: string, category: string, images: File[]) => {
      if (valuationData || isValuating || !brand || !category || images.length === 0) return;

      setIsValuating(true);
      toast({ title: 'AI Valuator Started', description: 'Analyzing your item to suggest a title, category, and price...' });
      
      try {
          const photoDataUris = await Promise.all(images.map(fileToDataUri));
          const result = await deviceValuator({
              deviceType: category, // Using category as deviceType
              model: brand, // Using brand as model
              photoDataUris,
          });

          form.setValue('title', result.suggestedTitle, { shouldValidate: true });
          form.setValue('category', result.suggestedCategory, { shouldValidate: true });
          form.setValue('description', result.suggestedDescription, { shouldValidate: true });
          
          if (form.getValues('listingType') === 'Sell') {
            const min = result.estimatedMinValue;
            const max = result.estimatedMaxValue;
            setMinPrice(min);
            setMaxPrice(max);
            const initialPrice = Math.round((min + max) / 2);
            setSelectedPrice(initialPrice);
            form.setValue('price', initialPrice);
          }

          toast({ title: 'AI Valuation Complete!', description: 'We\'ve filled in some details for you.' });
      } catch (error) {
          console.error("Error during automatic valuation:", error);
          toast({ variant: 'destructive', title: 'Valuation Failed', description: 'Could not automatically value your item.' });
      } finally {
          setIsValuating(false);
      }
  }, [form, isValuating, toast, valuationData]);
  
  useEffect(() => {
      if (valuationData) return;
      // Trigger valuation only when these debounced values change and are valid
      if (debouncedBrand && debouncedCategory && formImages.length > 0) {
          triggerValuation(debouncedBrand, debouncedCategory, formImages);
      }
  }, [debouncedBrand, debouncedCategory, formImages, triggerValuation, valuationData]);
  
  const uploadImages = async (images: File[], docId: string): Promise<string[]> => {
    const storage = getStorage();
    const imageUrls: string[] = [];
    
    const uploadPromises = images.map(image => {
        const storageRef = ref(storage, `items/${docId}/${image.name}`);
        return uploadBytes(storageRef, image).then(snapshot => getDownloadURL(snapshot.ref));
    });

    try {
        const urls = await Promise.all(uploadPromises);
        imageUrls.push(...urls);
        return imageUrls;
    } catch (error) {
        console.error("Error uploading images:", error);
        toast({
            variant: "destructive",
            title: "Image Upload Failed",
            description: "There was an error uploading your images. Please try again.",
        });
        // Re-throw the error to be caught by the onSubmit handler
        throw error;
    }
};

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore || !authUser) {
        toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to post an item.' });
        return;
    }
    setIsSubmitting(true);

    try {
        // 1. Upload images and get their URLs
        // We use a temporary ID for the storage path to avoid collisions
        const tempDocId = collection(firestore, "items").doc().id;
        const imageUrls = await uploadImages(values.images, tempDocId);

        // 2. Now, create the document in Firestore with the real image URLs
        await addDoc(collection(firestore, "items"), {
            title: values.title,
            brand: values.brand,
            description: values.description,
            category: values.category,
            condition: values.condition,
            listingType: values.listingType,
            price: values.listingType === 'Sell' ? (selectedPrice ?? values.price) : 0,
            locality: values.locality,
            imageUrls: imageUrls,
            ownerId: authUser.uid,
            ownerName: authUser.displayName || "Anonymous",
            ownerAvatarUrl: authUser.photoURL,
            ownerRating: 0, // This should probably be fetched from the user's profile
            status: 'Available',
            isFeatured: false,
            postedAt: Timestamp.now(),
        });
        
        toast({
            title: "Success!",
            description: "Your item has been listed.",
        });

        // 3. Navigate away and reset the form
        router.push('/dashboard');
        form.reset();
        setImagePreviews([]);

    } catch (error) {
        console.error("Error submitting form:", error);
        // Toast for specific image upload failure is handled in `uploadImages`
        // This is a more general fallback.
        if (!toast.toString().includes("Image Upload Failed")) {
            toast({
                variant: 'destructive',
                title: 'Submission Failed',
                description: 'There was an error posting your item. Please try again.',
            });
        }
    } finally {
        setIsSubmitting(false);
    }
  }
  
  const addImages = (files: File[]) => {
    const currentImageCount = imagePreviews.length;
    if (currentImageCount + files.length > 5) {
        toast({ variant: 'destructive', title: 'Too many images', description: 'You can upload a maximum of 5 images.' });
        return;
    }
    form.setValue("images", [...form.getValues("images"), ...files], { shouldValidate: true });
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
        const files = Array.from(e.target.files);
        addImages(files);
    }
  };

  const removeImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    const currentImages = form.getValues("images");
    currentImages.splice(index, 1);
    form.setValue("images", currentImages, { shouldValidate: true });
  };
  
  const handleGenerateDescription = async () => {
    const title = form.getValues("title");
    const category = form.getValues("category");
    if (!title || title.length < 5) {
      toast({ variant: "destructive", title: "Please enter a title (at least 5 characters) first." });
      return;
    }
    if (!category) {
        toast({ variant: "destructive", title: "Please select a category first." });
        return;
    }
    setIsDescriptionGenerating(true);
    try {
        const images = form.getValues("images");
        let photoDataUri;
        if (images.length > 0) {
            photoDataUri = await fileToDataUri(images[0]);
        }
        const result = await generateListingDescription({ title, category, photoDataUri });
        form.setValue("description", result.description, { shouldValidate: true });
    } catch (error) {
        console.error(error);
        toast({ variant: "destructive", title: "Error", description: "Could not generate a description." });
    } finally {
        setIsDescriptionGenerating(false);
    }
  };
  
  const handlePriceChange = (value: number[]) => {
      setSelectedPrice(value[0]);
      form.setValue('price', value[0]);
  };

  return (
    <>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {!valuationData && !minPrice && (
            <Alert className="bg-accent/10 border-accent/30">
            <Tag className="h-4 w-4 text-accent" />
            <AlertTitle className="text-accent">Unsure of the value?</AlertTitle>
            <AlertDescription className="flex justify-between items-center">
                <span className="text-accent/90">Let our AI Valuator suggest a price.</span>
                <Button variant="link" className="text-accent" asChild>
                <Link href="/valuator">
                    Use AI Valuator <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
                </Button>
            </AlertDescription>
            </Alert>
        )}

        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Images (up to 5)</FormLabel>
              {!valuationData && <FormDescription>The AI valuator will automatically run after you select a brand, category, and upload a photo.</FormDescription>}
              <FormControl>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                  {imagePreviews.map((src, index) => (
                      <div key={index} className="relative aspect-square">
                          <Image src={src} alt={`Preview ${index+1}`} fill className="rounded-md object-cover" />
                          {!valuationData && (
                            <Button type="button" size="icon" variant="destructive" className="absolute -top-2 -right-2 h-6 w-6 rounded-full" onClick={() => removeImage(index)}>
                                <X className="h-4 w-4" />
                            </Button>
                          )}
                      </div>
                  ))}
                  {imagePreviews.length < 5 && !valuationData && (
                    <>
                      <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-muted-foreground/50 text-muted-foreground transition-colors hover:border-primary hover:text-primary">
                          <ImagePlus className="h-8 w-8" />
                          <span className="mt-2 text-xs text-center">From Gallery</span>
                          <input type="file" multiple accept="image/*" className="sr-only" onChange={handleImageChange} disabled={isSubmitting || !!valuationData} />
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
        
        <FormField
          control={form.control}
          name="brand"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brand</FormLabel>
              <FormControl>
                <Input placeholder="e.g. 'Apple', 'Samsung', 'Dell'" {...field} disabled={isSubmitting || isValuating} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting || isValuating}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category for your electronic device" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map(cat => <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Listing Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. 'Lightly Used Modern Laptop'" {...field} disabled={isSubmitting || isValuating} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe your electronic item in detail..." rows={6} {...field} disabled={isSubmitting || isDescriptionGenerating || isValuating || !!valuationData} />
              </FormControl>
               {!valuationData && (
                <>
                <FormDescription>
                    Provide a title and category, then let AI help you write a great description for your gadget.
                </FormDescription>
                <FormMessage />
                <div className="flex flex-wrap gap-2 pt-2">
                    <Button type="button" variant="outline" size="sm" onClick={handleGenerateDescription} disabled={isDescriptionGenerating || isSubmitting || isValuating}>
                    {isDescriptionGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Generate Description
                    </Button>
                </div>
                </>
               )}
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="condition"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Condition</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select the item's condition" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {conditions.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="locality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Locality</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your locality in Pune" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {popularLocations.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                  </SelectContent>
                </Select>
                 <FormDescription>
                This helps local buyers find your gadget.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="listingType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>How do you want to list this?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={(value) => {
                    field.onChange(value);
                    if (value !== 'Sell') {
                      form.setValue('price', 0);
                      setSelectedPrice(0);
                    } else if (minPrice !== null && maxPrice !== null) {
                        const initialPrice = Math.round((minPrice + maxPrice) / 2);
                        setSelectedPrice(initialPrice);
                        form.setValue('price', initialPrice);
                    }
                  }}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                  disabled={isSubmitting}
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Sell" />
                    </FormControl>
                    <FormLabel className="font-normal">Sell</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Donate" />
                    </FormControl>
                    <FormLabel className="font-normal">Donate</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Spare Parts" />
                    </FormControl>
                    <FormLabel className="font-normal">Sell as Spare Parts</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {listingType === "Sell" && (
            <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                    <FormLabel>Price</FormLabel>
                    {isValuating ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : (selectedPrice !== null && <span className="font-bold text-lg text-primary">₹{selectedPrice.toLocaleString('en-IN')}</span>)}
                </div>
                {minPrice !== null && maxPrice !== null && selectedPrice !== null ? (
                    <>
                        <FormControl>
                            <Slider
                                min={minPrice}
                                max={maxPrice}
                                step={Math.max(1, Math.round((maxPrice - minPrice) / 100))}
                                value={[selectedPrice]}
                                onValueChange={handlePriceChange}
                                disabled={isSubmitting}
                            />
                        </FormControl>
                        <FormDescription>
                            We've suggested a price range based on the AI valuation. Adjust it to your liking.
                        </FormDescription>
                    </>
                ) : (
                    <FormControl>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">₹</span>
                            <Input 
                                type="number" 
                                placeholder="2500" 
                                className="pl-7" 
                                value={field.value ?? ''}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    const price = val === '' ? undefined : parseFloat(val);
                                    field.onChange(price);
                                    if(price !== undefined) setSelectedPrice(price); else setSelectedPrice(null);
                                }}
                                disabled={isSubmitting || isValuating} 
                            />
                        </div>
                    </FormControl>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        )}


        <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" size="lg" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Post My Gadget
        </Button>
      </form>
    </Form>
    {!valuationData && (
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
    )}
    </>
  )
}

// Wrap the component that uses useSearchParams with Suspense
export function PostItemForm({ valuationData }: PostItemFormProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PostItemFormContent valuationData={valuationData} />
    </Suspense>
  )
}

  