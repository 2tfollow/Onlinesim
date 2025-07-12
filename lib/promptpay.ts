import { generatePayload } from "promptpay-qr"
import QRCode from "qrcode"

export interface PromptPayQRData {
  qrCode: string
  reference: string
  amount: number
}

export const generatePromptPayQR = async (amount: number, reference: string): Promise<PromptPayQRData> => {
  const promptPayId = process.env.PROMPTPAY_ID! // Your PromptPay ID

  const payload = generatePayload(promptPayId, { amount })
  const qrCode = await QRCode.toDataURL(payload)

  return {
    qrCode,
    reference,
    amount,
  }
}

export const verifyPayment = async (reference: string): Promise<boolean> => {
  // Implement payment verification logic
  // This would typically involve checking with your bank's API
  // For demo purposes, we'll simulate verification
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(Math.random() > 0.3) // 70% success rate for demo
    }, 2000)
  })
}
