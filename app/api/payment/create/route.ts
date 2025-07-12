import { type NextRequest, NextResponse } from "next/server"
import { generatePromptPayQR } from "@/lib/promptpay"
import { db } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const { amount, userId } = await request.json()

    // Generate unique reference
    const reference = `PAY${Date.now()}${Math.random().toString(36).substr(2, 5)}`

    // Create transaction record
    await db.query(
      `
      INSERT INTO transactions (user_id, type, amount, payment_method, reference)
      VALUES ($1, 'deposit', $2, 'promptpay', $3)
    `,
      [userId, amount, reference],
    )

    // Generate PromptPay QR
    const qrData = await generatePromptPayQR(amount, reference)

    return NextResponse.json({
      success: true,
      ...qrData,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create payment" }, { status: 500 })
  }
}
