"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const COUNTRIES = [
  { code: 7, name: "รัสเซีย", flag: "🇷🇺" },
  { code: 1, name: "สหรัฐอเมริกา", flag: "🇺🇸" },
  { code: 44, name: "อังกฤษ", flag: "🇬🇧" },
  { code: 33, name: "ฝรั่งเศส", flag: "🇫🇷" },
  { code: 49, name: "เยอรมนี", flag: "🇩🇪" },
  { code: 380, name: "ยูเครน", flag: "🇺🇦" },
  { code: 48, name: "โปแลนด์", flag: "🇵🇱" },
]

interface CountrySelectorProps {
  value?: number
  onValueChange: (value: number) => void
}

export function CountrySelector({ value, onValueChange }: CountrySelectorProps) {
  return (
    <Select value={value?.toString()} onValueChange={(val) => onValueChange(Number.parseInt(val))}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="เลือกประเทศ" />
      </SelectTrigger>
      <SelectContent>
        {COUNTRIES.map((country) => (
          <SelectItem key={country.code} value={country.code.toString()}>
            <div className="flex items-center gap-2">
              <span>{country.flag}</span>
              <span>{country.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
