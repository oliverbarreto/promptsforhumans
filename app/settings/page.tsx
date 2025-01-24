"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function SettingsPage() {
  const [email, setEmail] = useState("user@example.com")
  const [notifications, setNotifications] = useState(true)

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Settings</h1>
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
          <Label htmlFor="notifications">Enable notifications</Label>
        </div>
        <Button>Save Changes</Button>
      </div>
    </div>
  )
}

