import { type NextRequest, NextResponse } from "next/server"
import { onlineSimAPI } from "@/lib/onlinesim"
import { db } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const { service, country, userId } = await request.json()

    // Get number from OnlineSim
    const numberResponse = await onlineSimAPI.getNumber(service, country)

    if (numberResponse.response !== "1") {
      return NextResponse.json({ error: "Failed to get number" }, { status: 400 })
    }

    const { tzid, number } = numberResponse.data

    // Get tariff to calculate cost
    const tariffResponse = await onlineSimAPI.getTariffs(country, service)
    const tariff = tariffResponse.data?.find((t) => t.service === service && t.country === country)

    if (!tariff) {
      return NextResponse.json({ error: "Service not available" }, { status: 400 })
    }

    // Add markup (e.g., 20% profit margin)
    const cost = tariff.cost * 1.2

    // Check user balance
    const userResult = await db.query("SELECT balance FROM users WHERE id = $1", [userId])
    if (userResult.rows[0]?.balance < cost) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 })
    }

    // Deduct balance and create purchase record
    await db.query("BEGIN")

    await db.query("UPDATE users SET balance = balance - $1 WHERE id = $2", [cost, userId])

    const purchaseResult = await db.query(
      `
      INSERT INTO purchases (user_id, tzid, number, service, country, cost, expires_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW() + INTERVAL '20 minutes')
      RETURNING *
    `,
      [userId, tzid, number, service, country, cost],
    )

    await db.query("COMMIT")

    return NextResponse.json({
      success: true,
      purchase: purchaseResult.rows[0],
    })
  } catch (error) {
    await db.query("ROLLBACK")
    return NextResponse.json({ error: "Purchase failed" }, { status: 500 })
  }
}
