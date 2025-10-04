'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm, zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { deviceValuator, type DeviceValuatorOutput } from '@/ai/flows/device-valuator-flow';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles, Tag, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const valuatorFormSchema = z.object({
  deviceType: z.string().min(1, 'Please select a device type.'),
  model: z.string().min(2, 'Please enter a model name.'),
  condition: z.string().min(10, 'Please describe the condition briefly.'),
});

const deviceTypes = ["Mobile Phone", "Laptop", "Tablet", "Smartwatch", "Headphones", "Camera", "Other"];

export default function ValuatorPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DeviceValuatorOutput | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof valuatorFormSchema>>({
    resolver: zodResolver(valuatorFormSchema),
    defaultValues: {
      deviceType: '',
      model: '',
      condition: '',
    },
  });

  async function onSubmit(values: z.infer<typeof valuatorFormSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const valuationResult = await deviceValuator(values);
      setResult(valuationResult);
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
  
  const handleListNow = () => {
    if (!result) return;
    const params = new URLSearchParams();
    params.set('title', result.suggestedTitle);
    params.set('category', result.suggestedCategory);
    router.push(`/post?${params.toString()}`);
  }


  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h2 className="font-headline text-2xl font-bold">Analyzing your item... 🧠</h2>
        <p className="text-muted-foreground">Our AI is calculating the best value for you.</p>
      </div>
    )
  }

  if (result) {
    return (
       <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
            <Sparkles className="h-10 w-10 text-accent mx-auto" />
            <CardTitle className="font-headline text-2xl mt-2">Valuation Report</CardTitle>
            <CardDescription>Here's what our AI thinks your device is worth.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="text-center bg-primary/10 rounded-lg p-6">
                <p className="text-sm font-semibold text-primary">Estimated Resale Value on Zwitch</p>
                <p className="font-headline text-4xl font-bold text-primary">
                    ₹{result.estimatedMinValue.toLocaleString('en-IN')} - ₹{result.estimatedMaxValue.toLocaleString('en-IN')}
                </p>
            </div>
             <div className="space-y-2">
                <p className="font-semibold">AI Recommendation:</p>
                <p className="text-muted-foreground p-4 bg-muted rounded-lg border">{result.recommendation}</p>
             </div>
              <div className="space-y-2">
                <p className="font-semibold">Suggested Listing Title:</p>
                <p className="text-muted-foreground p-4 bg-muted rounded-lg border">{result.suggestedTitle}</p>
             </div>
        </CardContent>
        <CardFooter className="flex-col gap-4">
            <Button size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleListNow}>
                List this item now! <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full" onClick={() => setResult(null)}>
                Value Another Item
            </Button>
        </CardFooter>
       </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <Tag className="h-6 w-6 text-primary" />
            AI Device Valuator
        </CardTitle>
        <CardDescription>
          Find out what your old, forgotten electronics are worth. Just provide a few details to get started.
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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

            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand and Model</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Apple iPhone 11" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="condition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Condition</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Screen has a small crack in the corner, but it turns on and works fine. Battery health is around 80%." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Get My Valuation
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
