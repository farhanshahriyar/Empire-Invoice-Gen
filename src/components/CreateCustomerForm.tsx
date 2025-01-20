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
import { supabase } from "@/integrations/supabase/client"

interface CustomerFormData {
  name: string
  email: string
  phone: string
  status: "active" | "inactive"
  shipping_street: string
  shipping_city: string
  shipping_state: string
  shipping_zip: string
  preferred_payment_method: "cod" | "bkash" | "nagad" | null
}

export function CreateCustomerForm({ onSuccess }: { onSuccess: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<CustomerFormData>({
    defaultValues: {
      status: "active",
      preferred_payment_method: null
    }
  })

  const onSubmit = async (data: CustomerFormData) => {
    try {
      setIsSubmitting(true)
      const { error } = await supabase
        .from('customers')
        .insert([{
          name: data.name,
          email: data.email,
          phone: data.phone,
          status: data.status || 'active',
          shipping_street: data.shipping_street,
          shipping_city: data.shipping_city,
          shipping_state: data.shipping_state,
          shipping_zip: data.shipping_zip,
          preferred_payment_method: data.preferred_payment_method
        }])

      if (error) {
        if (error.code === '23505') {
          toast.error("A customer with this email already exists")
          return
        }
        throw error
      }

      toast.success("Customer created successfully")
      onSuccess()
    } catch (error) {
      console.error('Error creating customer:', error)
      toast.error("Failed to create customer")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStatusChange = (value: string) => {
    setValue('status', value as 'active' | 'inactive')
  }

  const handlePaymentMethodChange = (value: string) => {
    setValue('preferred_payment_method', value as 'cod' | 'bkash' | 'nagad')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          {...register("name", { required: "Name is required" })}
          placeholder="Customer name"
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...register("email", { 
            required: "Email is required",
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
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          {...register("phone", { required: "Phone number is required" })}
          placeholder="Phone number"
        />
        {errors.phone && (
          <p className="text-sm text-red-500">{errors.phone.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Shipping Information</Label>
        <Input
          {...register("shipping_street")}
          placeholder="Street Address"
          className="mb-2"
        />
        <Input
          {...register("shipping_city")}
          placeholder="City"
          className="mb-2"
        />
        <Input
          {...register("shipping_state")}
          placeholder="State"
          className="mb-2"
        />
        <Input
          {...register("shipping_zip")}
          placeholder="ZIP Code"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="preferred_payment_method">Preferred Payment Method</Label>
        <Select onValueChange={handlePaymentMethodChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select payment method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cod">Cash on Delivery</SelectItem>
            <SelectItem value="bkash">Bkash</SelectItem>
            <SelectItem value="nagad">Nagad</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select onValueChange={handleStatusChange} defaultValue="active">
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Customer"}
      </Button>
    </form>
  )
}