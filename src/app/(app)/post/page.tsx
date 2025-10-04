import { PostItemForm } from "@/components/post-item-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PostItemPage() {
  return (
    <div className="container mx-auto max-w-3xl py-8">
       <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Create a New Listing</CardTitle>
            <CardDescription>Fill out the details below to post your item on Zwitch.</CardDescription>
          </CardHeader>
          <CardContent>
            <PostItemForm />
          </CardContent>
        </Card>
    </div>
  );
}
