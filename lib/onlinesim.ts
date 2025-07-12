import type { OnlineSimResponse, TariffData, NumberData, StateData } from "@/types/api"

const ONLINESIM_API_KEY = process.env.ONLINESIM_API_KEY
const BASE_URL = "https://onlinesim.io"

// Log the API key status for debugging
if (!ONLINESIM_API_KEY) {
  console.error(
    "CRITICAL ERROR: ONLINESIM_API_KEY is not set. Please check your .env.local file or Vercel Environment Variables.",
  )
} else {
  console.log("ONLINESIM_API_KEY is loaded.")
}

class OnlineSimAPI {
  private async request<T>(endpoint: string, params: Record<string, any> = {}): Promise<OnlineSimResponse<T>> {
    if (!ONLINESIM_API_KEY) {
      // This error will now be more clearly logged above as well
      throw new Error("ONLINESIM_API_KEY is not set in environment variables. Please ensure it's configured.")
    }

    const url = new URL(endpoint, BASE_URL)
    url.searchParams.append("apikey", ONLINESIM_API_KEY)

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, value.toString())
      }
    })

    const response = await fetch(url.toString())

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`OnlineSim API Error (${response.status}): ${errorText}`)
      throw new Error(`OnlineSim API request failed: ${response.statusText} - ${errorText.substring(0, 200)}...`)
    }

    try {
      return await response.json()
    } catch (jsonError) {
      const rawText = await response.text()
      console.error("Failed to parse JSON response from OnlineSim:", rawText)
      throw new Error(`OnlineSim API returned non-JSON response: ${rawText.substring(0, 200)}...`)
    }
  }

  // Get available tariffs
  async getTariffs(country?: number, service?: string): Promise<OnlineSimResponse<TariffData[]>> {
    return this.request("/api/getTariffs.php", { country, service })
  }

  // Get phone number
  async getNumber(service: string, country: number): Promise<OnlineSimResponse<NumberData>> {
    return this.request("/api/getNum.php", { service, country })
  }

  // Get SMS state
  async getState(tzid: number): Promise<OnlineSimResponse<StateData>> {
    return this.request("/api/getState.php", { tzid })
  }

  // Set operation as OK
  async setOperationOk(tzid: number): Promise<OnlineSimResponse> {
    return this.request("/api/setOperationOk.php", { tzid })
  }

  // Get balance
  async getBalance(): Promise<OnlineSimResponse<{ balance: number }>> {
    return this.request("/api/getBalance.php")
  }

  // Rent APIs
  async getRentTariffs(): Promise<OnlineSimResponse> {
    return this.request("/api/rent/tariffsRent.php")
  }

  async getRentNumber(country: number, days: number): Promise<OnlineSimResponse> {
    return this.request("/api/rent/getRentNum.php", { country, days })
  }
}

export const onlineSimAPI = new OnlineSimAPI()
