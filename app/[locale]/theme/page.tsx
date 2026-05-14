import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ThemeShowcasePage() {
  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Theme Showcase</h2>
          <p className="text-muted-foreground">
            A complete overview of the current design system and color palette.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Colors Section */}
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Color Palette</CardTitle>
            <CardDescription>The core variables powering the UI.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="space-y-2">
                <div className="h-20 w-full rounded-md bg-primary border" />
                <p className="text-sm font-medium">Primary</p>
                <p className="text-xs text-muted-foreground">bg-primary</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 w-full rounded-md bg-secondary border" />
                <p className="text-sm font-medium">Secondary</p>
                <p className="text-xs text-muted-foreground">bg-secondary</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 w-full rounded-md bg-destructive border" />
                <p className="text-sm font-medium">Destructive</p>
                <p className="text-xs text-muted-foreground">bg-destructive</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 w-full rounded-md bg-muted border" />
                <p className="text-sm font-medium">Muted</p>
                <p className="text-xs text-muted-foreground">bg-muted</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 w-full rounded-md bg-accent border" />
                <p className="text-sm font-medium">Accent</p>
                <p className="text-xs text-muted-foreground">bg-accent</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 w-full rounded-md bg-background border shadow-sm" />
                <p className="text-sm font-medium">Background</p>
                <p className="text-xs text-muted-foreground">bg-background</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
            <CardDescription>Standard button variants.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              <Button variant="default">Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
          </CardContent>
        </Card>

        {/* Form Inputs */}
        <Card>
          <CardHeader>
            <CardTitle>Forms & Inputs</CardTitle>
            <CardDescription>Standard input fields and focus rings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="m@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" />
            </div>
            <Button className="w-full">Sign In</Button>
          </CardContent>
        </Card>

        {/* Typography */}
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle>Typography & Content</CardTitle>
            <CardDescription>Text colors and foreground variations.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-foreground">
                Heading 1 (Foreground)
              </h1>
              <h2 className="text-3xl font-semibold tracking-tight text-foreground/90">
                Heading 2
              </h2>
              <h3 className="text-2xl font-semibold tracking-tight text-foreground/80">
                Heading 3
              </h3>
            </div>
            <div className="space-y-4">
              <p className="text-base text-foreground leading-7">
                This is standard body text using the <code className="bg-muted px-1.5 py-0.5 rounded">text-foreground</code> variable. It provides high contrast and readability for main paragraphs and content blocks.
              </p>
              <p className="text-sm text-muted-foreground leading-6">
                This is muted text using <code className="bg-muted px-1.5 py-0.5 rounded text-foreground">text-muted-foreground</code>. It is perfect for secondary information, descriptions, timestamps, or helper text beneath inputs.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
