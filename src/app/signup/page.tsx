import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthCard } from "@/components/auth-card"

export default function SignupPage() {
  return (
    <AuthCard
      title="Create an account"
      description="Enter your information to get started."
      footerText="Already have an account?"
      footerLink="/login"
      footerLinkText="Log in"
    >
      <div className="space-y-4">
        <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Jane Doe" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required />
        </div>
        <Button type="submit" className="w-full" asChild>
            <Link href="/dashboard">Create account</Link>
        </Button>
        <Button variant="outline" className="w-full">
          Sign up with Google
        </Button>
        <Button variant="outline" className="w-full">
          Sign up with Phone
        </Button>
      </div>
    </AuthCard>
  )
}
