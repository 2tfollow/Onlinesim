// OnlineSim API Types
export interface OnlineSimResponse<T = any> {
  response: string
  data?: T
  error?: string
}

export interface TariffData {
  country: number
  service: string
  cost: number
  count: number
}

export interface NumberData {
  tzid: number
  number: string
  country: number
  service: string
}

export interface StateData {
  tzid: number
  number: string
  msg: string
  code: string
  full_msg: string
  response: string
}

// Database Types
export interface User {
  id: string
  email: string
  balance: number
  created_at: Date
  updated_at: Date
}

export interface Transaction {
  id: string
  user_id: string
  type: "deposit" | "purchase"
  amount: number
  status: "pending" | "completed" | "failed"
  payment_method: "promptpay"
  reference: string
  created_at: Date
}

export interface Purchase {
  id: string
  user_id: string
  tzid: number
  number: string
  service: string
  country: number
  cost: number
  status: "active" | "completed" | "cancelled"
  sms_code?: string
  created_at: Date
  expires_at: Date
}
