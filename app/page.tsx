"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CountrySelector } from "@/components/country-selector"
import { ServiceSelector } from "@/components/service-selector"
import { PromptPayQR } from "@/components/promptpay-qr"
import { Smartphone, MessageSquare, Wallet, Clock } from "lucide-react"

export default function HomePage() {
  const [selectedCountry, setSelectedCountry] = useState<number>()
  const [selectedService, setSelectedService] = useState<string>()
  const [tariffs, setTariffs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [userBalance, setUserBalance] = useState(0)

  // Mock user ID - in real app, get from auth
  const userId = "user-123"

  useEffect(() => {
    if (selectedCountry && selectedService) {
      fetchTariffs()
    }
  }, [selectedCountry, selectedService])

  const fetchTariffs = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/tariffs?country=${selectedCountry}&service=${selectedService}`)
      const data = await response.json()
      setTariffs(data.data || [])
    } catch (error) {
      console.error("Failed to fetch tariffs:", error)
    } finally {
      setLoading(false)
    }
  }

  const purchaseNumber = async () => {
    if (!selectedCountry || !selectedService) return

    try {
      const response = await fetch("/api/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country: selectedCountry,
          service: selectedService,
          userId,
        }),
      })

      const data = await response.json()
      if (data.success) {
        // Redirect to SMS waiting page
        window.location.href = `/sms/${data.purchase.tzid}`
      }
    } catch (error) {
      console.error("Purchase failed:", error)
    }
  }

  const currentTariff = tariffs.find((t) => t.country === selectedCountry && t.service === selectedService)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Smartphone className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">ThaiSMS</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-gray-600" />
                <span className="font-medium">฿{userBalance.toFixed(2)}</span>
              </div>
              <Button onClick={() => setShowPayment(true)} variant="outline">
                เติมเงิน
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">รับ SMS ออนไลน์ ง่าย รวดเร็ว ปลอดภัย</h2>
          <p className="text-xl text-gray-600 mb-8">บริการรับ SMS สำหรับยืนยันตัวตนจากทั่วโลก ราคาถูก เริ่มต้นเพียง 5 บาท</p>
        </div>

        {/* Service Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              เลือกบริการ
            </CardTitle>
            <CardDescription>เลือกประเทศและบริการที่ต้องการรับ SMS</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">ประเทศ</label>
                <CountrySelector value={selectedCountry} onValueChange={setSelectedCountry} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">บริการ</label>
                <ServiceSelector value={selectedService} onValueChange={setSelectedService} />
              </div>
            </div>

            {currentTariff && (
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium">ราคา: ฿{(currentTariff.cost * 1.2).toFixed(2)}</p>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    หมดอายุใน 20 นาที
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="mb-2">
                    มีให้บริการ {currentTariff.count} หมายเลข
                  </Badge>
                  <br />
                  <Button onClick={purchaseNumber} disabled={loading}>
                    {loading ? "กำลังประมวลผล..." : "เช่าหมายเลข"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🚀 รวดเร็ว</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">รับหมายเลขทันที ไม่ต้องรอนาน SMS มาถึงภายใน 1-2 นาที</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">💰 ราคาถูก</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">ราคาเริ่มต้นเพียง 5 บาท รองรับการชำระเงินผ่าน PromptPay</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🔒 ปลอดภัย</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">ระบบความปลอดภัยสูง ข้อมูลเข้ารหัส ไม่เก็บข้อมูลส่วนตัว</p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">เติมเงิน</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowPayment(false)}>
                ✕
              </Button>
            </div>
            <PromptPayQR
              userId={userId}
              onPaymentComplete={() => {
                setShowPayment(false)
                // Refresh balance
                setUserBalance((prev) => prev + Number.parseFloat("100")) // Mock
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
