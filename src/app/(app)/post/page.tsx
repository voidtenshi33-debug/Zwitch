
import { PostItemForm } from "@/components/post-item-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";

export default function PostItemPage() {
  return (
    <div className="container mx-auto max-w-3xl py-8">
       <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Give Your Item a Second Life</CardTitle>
            <CardDescription>List your old electronics to sell, donate, or recycle.</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading form...</div>}>
              <PostItemForm />
            </Suspense>
          </CardContent>
        </Card>
    </div>
  );
}
