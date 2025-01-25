"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

export default function SettingsPage() {
  const [email, setEmail] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    // Load email from localStorage on component mount
    const savedEmail = localStorage.getItem("userEmail")
    if (savedEmail) {
      setEmail(savedEmail)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Save email to localStorage
    localStorage.setItem("userEmail", email)
    toast({
      title: "Settings saved",
      description: "Your email has been updated successfully.",
      duration: 3000
    })
  }

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <div className="space-y-6">
        <div className="border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Contact Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your contact email"
                required
              />
              <p className="text-sm text-muted-foreground">
                This email will be used for contact form submissions.
              </p>
            </div>
            <Button type="submit">Save Settings</Button>
          </form>
        </div>
      </div>
    </div>
  )
}
