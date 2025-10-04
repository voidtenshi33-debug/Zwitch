import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthCard } from "@/components/auth-card"

export default function LoginPage() {
  return (
    <AuthCard
      title="Welcome Back"
      description="Log in to your account to continue."
      footerText="Don't have an account?"
      footerLink="/signup"
      footerLinkText="Sign up"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required />
        </div>
        <div className="space-y-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <Link href="#" className="ml-auto inline-block text-sm underline">
              Forgot your password?
            </Link>
          </div>
          <Input id="password" type="password" required />
        </div>
        <Button type="submit" className="w-full" asChild>
          <Link href="/dashboard">Log in</Link>
        </Button>
        <Button variant="outline" className="w-full">
          Login with Google
        </Button>
        <Button variant="outline" className="w-full">
          Login with Phone
        </Button>
      </div>
    </AuthCard>
  )
}
