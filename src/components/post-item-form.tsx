
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { collection, addDoc, Timestamp } from "firebase/firestore"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
import { ImagePlus, Loader2, Sparkles, X } from "lucide-react"
import { generateListingDescription } from "@/ai/flows/generate-listing-description"
import { categories } from "@/lib/categories"
import type { ItemCondition, ListingType } from "@/lib/types"
import { useFirestore, useUser } from "@/firebase"

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
  description: z.string().min(20, "Description must be at least 20 characters long."),
  category: z.string().min(1, "Please select a category."),
  condition: z.string().min(1, "Please select the item's condition."),
  listingType: z.enum(["Sell", "Donate", "Spare Parts"]),
  price: z.string().optional(),
  locality: z.string().min(1, "Please select your locality."),
  images: z.array(z.instanceof(File)).min(1, "Please upload at least one image."),
}).refine(data => {
    if (data.listingType === "Sell") {
        return data.price && !isNaN(parseFloat(data.price)) && parseFloat(data.price) > 0;
    }
    return true;
}, {
    message: "A valid price is required for items you want to sell.",
    path: ["price"],
});

const conditions: ItemCondition[] = ['New', 'Used - Like New', 'Used - Good', 'Needs Minor Repair', 'For Spare Parts', 'Working', 'For Parts Only'];

export function PostItemForm() {
  const { toast } = useToast()
  const router = useRouter()
  const firestore = useFirestore()
  const { user: authUser } = useUser()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isDescriptionGenerating, setIsDescriptionGenerating] = React.useState(false)
  const [imagePreviews, setImagePreviews] = React.useState<string[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      condition: "",
      listingType: "Sell",
      price: "",
      locality: "",
      images: [],
    },
  })
  
  const listingType = form.watch("listingType")

  const uploadImages = async (images: File[]): Promise<string[]> => {
    const storage = getStorage();
    const imageUrls: string[] = [];
    for (const image of images) {
      const storageRef = ref(storage, `items/${Date.now()}_${image.name}`);
      const snapshot = await uploadBytes(storageRef, image);
      const downloadURL = await getDownloadURL(snapshot.ref);
      imageUrls.push(downloadURL);
    }
    return imageUrls;
  };


  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore || !authUser) {
        toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to post an item.' });
        return;
    }
    setIsSubmitting(true);
    try {
        const imageUrls = await uploadImages(values.images);
        
        await addDoc(collection(firestore, "items"), {
            title: values.title,
            description: values.description,
            category: values.category,
            condition: values.condition,
            listingType: values.listingType,
            price: values.listingType === 'Sell' ? parseFloat(values.price!) : 0,
            locality: values.locality,
            imageUrls: imageUrls,
            ownerId: authUser.uid,
            ownerName: authUser.displayName || "Anonymous",
            ownerAvatarUrl: authUser.photoURL,
            ownerRating: 0, // This would be calculated or fetched
            status: 'Available',
            isFeatured: false,
            postedAt: Timestamp.now(),
        });

        toast({
            title: "Listing Submitted!",
            description: "Your item has been successfully listed.",
        });
        
        form.reset();
        setImagePreviews([]);
        router.push('/dashboard');

    } catch (error) {
        console.error("Error submitting form:", error);
        toast({
            variant: 'destructive',
            title: 'Submission Failed',
            description: 'There was an error posting your item. Please try again.',
        });
    } finally {
        setIsSubmitting(false);
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
        const files = Array.from(e.target.files);
        const currentImageCount = imagePreviews.length;
        if (currentImageCount + files.length > 5) {
            toast({ variant: 'destructive', title: 'Too many images', description: 'You can upload a maximum of 5 images.' });
            return;
        }
        form.setValue("images", [...form.getValues("images"), ...files]);
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    const currentImages = form.getValues("images");
    currentImages.splice(index, 1);
    form.setValue("images", currentImages);
  };
  
  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
  };

  const handleGenerateDescription = async () => {
    const title = form.getValues("title");
    const category = form.getValues("category");
    if (!title || title.length < 5) {
      toast({ variant: "destructive", title: "Please enter a title first." });
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


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Images (up to 5)</FormLabel>
              <FormControl>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                  {imagePreviews.map((src, index) => (
                      <div key={index} className="relative aspect-square">
                          <Image src={src} alt={`Preview ${index+1}`} fill className="rounded-md object-cover" />
                          <Button type="button" size="icon" variant="destructive" className="absolute -top-2 -right-2 h-6 w-6 rounded-full" onClick={() => removeImage(index)}>
                              <X className="h-4 w-4" />
                          </Button>
                      </div>
                  ))}
                  {imagePreviews.length < 5 && (
                    <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-muted-foreground/50 text-muted-foreground transition-colors hover:border-primary hover:text-primary">
                        <ImagePlus className="h-8 w-8" />
                        <span className="mt-2 text-xs text-center">Add Image</span>
                        <input type="file" multiple accept="image/*" className="sr-only" onChange={handleImageChange} disabled={isSubmitting} />
                    </label>
                  )}
                </div>
              </FormControl>
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
                <Input placeholder="e.g. 'Lightly Used Modern Laptop'" {...field} disabled={isSubmitting} />
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
                <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe your item in detail..." rows={6} {...field} disabled={isSubmitting || isDescriptionGenerating} />
              </FormControl>
              <FormDescription>
                Provide a title and category, and let AI help you write a great description.
              </FormDescription>
              <FormMessage />
              <div className="flex flex-wrap gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={handleGenerateDescription} disabled={isDescriptionGenerating || isSubmitting}>
                  {isDescriptionGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                  Generate Description
                </Button>
              </div>
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
                This helps local buyers find your item.
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
                  onValueChange={field.onChange}
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
                <FormLabel>Price</FormLabel>
                <FormControl>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">₹</span>
                        <Input type="number" placeholder="2500" className="pl-7" {...field} disabled={isSubmitting} />
                    </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}


        <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" size="lg" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Post My Item
        </Button>
      </form>
    </Form>
  )
}

    