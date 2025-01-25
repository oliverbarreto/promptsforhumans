"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function ContactPage() {
  const [name, setName] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const userEmail = localStorage.getItem("userEmail")
    if (!userEmail) {
      toast({
        title: "No email configured",
        description: "Please configure your email in settings first.",
        variant: "destructive"
      })
      router.push("/settings")
      return
    }

    // Create mailto URL with all form fields
    const mailtoUrl = `mailto:${
      process.env.NEXT_PUBLIC_APP_EMAIL_ADDRESS
    }?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      `Name: ${name}\nEmail: ${userEmail}\n\nMessage:\n${message}`
    )}`

    // Open default email client
    window.location.href = mailtoUrl

    // Show success toast
    toast({
      title: "Email client opened",
      description: `Sending email to ${process.env.NEXT_PUBLIC_APP_EMAIL_ADDRESS} with subject "${subject}"`,
      duration: 5000
    })
  }

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Contact Us</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            required
          />
        </div>
        <Button type="submit">Send Message</Button>
      </form>
    </div>
  )
}
