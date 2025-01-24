"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function ProfilePage() {
  const [name, setName] = useState("John Doe")
  const [bio, setBio] = useState("AI enthusiast and prompt engineer")

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Your Profile</h1>
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={4} />
        </div>
        <Button>Update Profile</Button>
      </div>
    </div>
  )
}

