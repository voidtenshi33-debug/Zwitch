'use client';

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthCard } from "@/components/auth-card"
import { useAuth, useFirestore } from "@/firebase";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from "firebase/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { doc } from "firebase/firestore";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";

export default function SignupPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      // Create user document in Firestore
      const userRef = doc(firestore, "users", user.uid);
      setDocumentNonBlocking(userRef, {
        id: user.uid,
        displayName: name,
        photoURL: null,
        email: user.email,
        createdAt: new Date().toISOString(),
        joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        avgRating: 0,
        itemsRecycled: 0,
      });

      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: error.message,
      });
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Create or update user document in Firestore
      const userRef = doc(firestore, "users", user.uid);
      setDocumentNonBlocking(userRef, {
        id: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
        email: user.email,
        createdAt: new Date().toISOString(),
        joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        avgRating: 0,
        itemsRecycled: 0,
      }, { merge: true });

      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Google Sign-In Failed",
        description: error.message,
      });
    }
  };

  return (
    <AuthCard
      title="Create an account"
      description="Enter your information to get started."
      footerText="Already have an account?"
      footerLink="/login"
      footerLinkText="Log in"
    >
      <form onSubmit={handleSignup} className="space-y-4">
        <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Jane Doe" required value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <Button type="submit" className="w-full">
            Create account
        </Button>
        <Button variant="outline" className="w-full" type="button" onClick={handleGoogleSignIn}>
          Sign up with Google
        </Button>
        <Button variant="outline" className="w-full" type="button">
          Sign up with Phone
        </Button>
      </form>
    </AuthCard>
  )
}
