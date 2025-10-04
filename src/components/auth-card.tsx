import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Logo } from "@/components/logo"

interface AuthCardProps {
  title: string
  description: string
  footerText: string
  footerLink: string
  footerLinkText: string
  children: React.ReactNode
}

export function AuthCard({ title, description, footerText, footerLink, footerLinkText, children }: AuthCardProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/50 px-4 py-12">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
             <Logo />
          </div>
          <CardTitle className="font-headline text-2xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
        <CardFooter>
            <div className="mt-4 text-center text-sm w-full">
                {footerText}{" "}
                <Link href={footerLink} className="underline">
                {footerLinkText}
                </Link>
            </div>
        </CardFooter>
      </Card>
    </div>
  )
}
