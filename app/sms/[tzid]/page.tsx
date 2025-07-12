"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, MessageSquare, Clock, CheckCircle, Copy } from "lucide-react"

export default function SMSPage() {
  const params = useParams()
  const tzid = params.tzid as string

  const [smsData, setSmsData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState(20 * 60) // 20 minutes in seconds

  useEffect(() => {
    const fetchSMS = async () => {
      try {
        const response = await fetch(`/api/sms/${tzid}`)
        const data = await response.json()
        setSmsData(data.data)

        if (data.data?.code) {
          setLoading(false)
        }
      } catch (error) {
        console.error("Failed to fetch SMS:", error)
      }
    }

    // Poll for SMS every 5 seconds
    const interval = setInterval(fetchSMS, 5000)
    fetchSMS()

    return () => clearInterval(interval)
  }, [tzid])

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              รอรับ SMS
            </CardTitle>
            <CardDescription>หมายเลข: {smsData?.number || "กำลังโหลด..."}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Timer */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-orange-500" />
                <span className="text-lg font-mono">{formatTime(timeLeft)}</span>
              </div>
              <Badge variant={timeLeft > 300 ? "default" : "destructive"}>
                {timeLeft > 0 ? "กำลังรอ SMS" : "หมดเวลา"}
              </Badge>
            </div>

            {/* Phone Number */}
            {smsData?.number && (
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">หมายเลขโทรศัพท์</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl font-mono font-bold">{smsData.number}</span>
                  <Button size="sm" variant="outline" onClick={() => copyToClipboard(smsData.number)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* SMS Status */}
            <div className="text-center">
              {loading && !smsData?.code ? (
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                  <p className="text-gray-600">กำลังรอ SMS... โปรดใช้หมายเลขด้านบนสำหรับยืนยันตัวตน</p>
                </div>
              ) : smsData?.code ? (
                <div className="flex flex-col items-center gap-4">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">รหัสยืนยัน</p>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-3xl font-mono font-bold text-green-700">{smsData.code}</span>
                      <Button size="sm" variant="outline" onClick={() => copyToClipboard(smsData.code)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {smsData.full_msg && (
                    <div className="p-3 bg-gray-50 rounded text-sm text-gray-600">
                      <p className="font-medium mb-1">ข้อความเต็ม:</p>
                      <p>{smsData.full_msg}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <p>ไม่ได้รับ SMS ภายในเวลาที่กำหนด</p>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">วิธีใช้งาน:</h4>
              <ol className="text-sm text-blue-800 space-y-1">
                <li>1. คัดลอกหมายเลขโทรศัพท์ด้านบน</li>
                <li>2. ไปที่แอปหรือเว็บไซต์ที่ต้องการยืนยัน</li>
                <li>3. ใส่หมายเลขและขอรหัสยืนยัน</li>
                <li>4. รอรหัสยืนยันแสดงที่นี่</li>
              </ol>
            </div>

            <div className="text-center">
              <Button onClick={() => (window.location.href = "/")}>กลับหน้าหลัก</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
