"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const SERVICES = [
  { code: "telegram", name: "Telegram", icon: "📱" },
  { code: "whatsapp", name: "WhatsApp", icon: "💬" },
  { code: "facebook", name: "Facebook", icon: "📘" },
  { code: "instagram", name: "Instagram", icon: "📷" },
  { code: "twitter", name: "Twitter", icon: "🐦" },
  { code: "google", name: "Google", icon: "🔍" },
  { code: "discord", name: "Discord", icon: "🎮" },
  { code: "tiktok", name: "TikTok", icon: "🎵" },
]

interface ServiceSelectorProps {
  value?: string
  onValueChange: (value: string) => void
}

export function ServiceSelector({ value, onValueChange }: ServiceSelectorProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="เลือกบริการ" />
      </SelectTrigger>
      <SelectContent>
        {SERVICES.map((service) => (
          <SelectItem key={service.code} value={service.code}>
            <div className="flex items-center gap-2">
              <span>{service.icon}</span>
              <span>{service.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
