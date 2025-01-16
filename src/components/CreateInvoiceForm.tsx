import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"

interface InvoiceFormData {
  number: string
  date: string
  customer: string
  amount: number
  status: "pending" | "paid" | "overdue"
  email?: string
  phone?: string
}

export function CreateInvoiceForm({ onSuccess }: { onSuccess: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<InvoiceFormData>({
    defaultValues: {
      status: "pending",
      number: "INV-"
    }
  })

  const onSubmit = async (data: InvoiceFormData) => {
    try {
      setIsSubmitting(true)
      const { error } = await supabase
        .from('invoices')
        .insert([
          {
            invoice_number: data.number,
            date: data.date,
            customer: data.customer,
            amount: data.amount,
            status: data.status,
            email: data.email,
            phone: data.phone
          }
        ])

      if (error) throw error

      toast.success("Invoice created successfully")
      onSuccess()
    } catch (error) {
      console.error('Error creating invoice:', error)
      toast.error("Failed to create invoice")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="number">Invoice Number</Label>
        <Input
          id="number"
          {...register("number", { required: "Invoice number is required" })}
          placeholder="001"
        />
        {errors.number && (
          <p className="text-sm text-red-500">{errors.number.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          {...register("date", { required: "Date is required" })}
        />
        {errors.date && (
          <p className="text-sm text-red-500">{errors.date.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="customer">Customer</Label>
        <Input
          id="customer"
          {...register("customer", { required: "Customer name is required" })}
          placeholder="Customer name"
        />
        {errors.customer && (
          <p className="text-sm text-red-500">{errors.customer.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email (Optional)</Label>
        <Input
          id="email"
          type="email"
          {...register("email", {
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address"
            }
          })}
          placeholder="customer@example.com"
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number (Optional)</Label>
        <Input
          id="phone"
          type="tel"
          {...register("phone")}
          placeholder="+1 234 567 890"
        />
        {errors.phone && (
          <p className="text-sm text-red-500">{errors.phone.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          {...register("amount", { 
            required: "Amount is required",
            min: { value: 0, message: "Amount must be positive" }
          })}
          placeholder="0.00"
        />
        {errors.amount && (
          <p className="text-sm text-red-500">{errors.amount.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select 
          defaultValue="pending"
          onValueChange={(value) => setValue("status", value as "pending" | "paid" | "overdue")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
        {errors.status && (
          <p className="text-sm text-red-500">{errors.status.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Invoice"}
      </Button>
    </form>
  )
}