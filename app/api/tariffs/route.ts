import { type NextRequest, NextResponse } from "next/server"
import { onlineSimAPI } from "@/lib/onlinesim"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const country = searchParams.get("country")
    const service = searchParams.get("service")

    const response = await onlineSimAPI.getTariffs(country ? Number.parseInt(country) : undefined, service || undefined)

    return NextResponse.json(response)
  } catch (error: any) {
    console.error("Error in /api/tariffs:", error.message || error)
    return NextResponse.json({ error: error.message || "Failed to fetch tariffs" }, { status: 500 })
  }
}
