import { type NextRequest, NextResponse } from "next/server"
import { onlineSimAPI } from "@/lib/onlinesim"
import { db } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { tzid: string } }) {
  try {
    const tzid = Number.parseInt(params.tzid)

    // Get SMS state from OnlineSim
    const response = await onlineSimAPI.getState(tzid)

    // Update database if SMS received
    if (response.data?.code) {
      await db.query(
        `
        UPDATE purchases 
        SET sms_code = $1, status = 'completed'
        WHERE tzid = $2
      `,
        [response.data.code, tzid],
      )
    }

    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json({ error: "Failed to get SMS state" }, { status: 500 })
  }
}
