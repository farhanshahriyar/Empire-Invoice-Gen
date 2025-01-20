export interface Invoice {
  id: string
  invoice_number: string
  customer: string
  date: string
  amount: number
  status: string
  phone: string | null
  email: string | null
}