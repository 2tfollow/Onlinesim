"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, QrCode } from "lucide-react"

interface PromptPayQRProps {
  userId: string
  onPaymentComplete: () => void
}

export function PromptPayQR({ userId, onPaymentComplete }: PromptPayQRProps) {
  const [amount, setAmount] = useState("")
  const [qrCode, setQrCode] = useState("")
  const [reference, setReference] = useState("")
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(false)

  const generateQR = async () => {
    if (!amount || Number.parseFloat(amount) < 1) return

    setLoading(true)
    try {
      const response = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number.parseFloat(amount), userId }),
      })

      const data = await response.json()
      if (data.success) {
        setQrCode(data.qrCode)
        setReference(data.reference)
      }
    } catch (error) {
      console.error("Failed to generate QR:", error)
    } finally {
      setLoading(false)
    }
  }

  const checkPayment = async () => {
    if (!reference) return

    setChecking(true)
    try {
      const response = await fetch(`/api/payment/verify/${reference}`)
      const data = await response.json()

      if (data.success) {
        onPaymentComplete()
      }
    } catch (error) {
      console.error("Failed to check payment:", error)
    } finally {
      setChecking(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          เติมเงินด้วย PromptPay
        </CardTitle>
        <CardDescription>สแกน QR Code เพื่อเติมเงินเข้าบัญชี</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!qrCode ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="amount">จำนวนเงิน (บาท)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="100"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
              />
            </div>
            <Button onClick={generateQR} disabled={loading || !amount} className="w-full">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              สร้าง QR Code
            </Button>
          </>
        ) : (
          <div className="text-center space-y-4">
            <img src={qrCode || "/placeholder.svg"} alt="PromptPay QR Code" className="mx-auto" />
            <div className="text-sm text-muted-foreground">
              <p>จำนวน: ฿{amount}</p>
              <p>รหัสอ้างอิง: {reference}</p>
            </div>
            <Button onClick={checkPayment} disabled={checking} className="w-full">
              {checking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              ตรวจสอบการชำระเงิน
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
