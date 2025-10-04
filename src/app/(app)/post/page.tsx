
import { PostItemForm } from "@/components/post-item-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";
import Link from 'next/link';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Tag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PostItemPage() {
  return (
    <div className="container mx-auto max-w-3xl py-8">
       <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Give Your Item a Second Life</CardTitle>
            <CardDescription>Fill in the details below to list your old electronics.</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6 bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
                <Tag className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <AlertTitle className="text-blue-800 dark:text-blue-300">Want a faster, smarter listing?</AlertTitle>
                <AlertDescription className="flex justify-between items-center text-blue-700 dark:text-blue-400">
                    <span>Let our AI Valuator fill this form for you!</span>
                    <Button variant="link" className="text-blue-700 dark:text-blue-400" asChild>
                    <Link href="/valuator">
                        Use AI Valuator <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                    </Button>
                </AlertDescription>
            </Alert>
            <Suspense fallback={<div>Loading form...</div>}>
              <PostItemForm />
            </Suspense>
          </CardContent>
        </Card>
    </div>
  );
}
