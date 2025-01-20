import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"
import * as z from "zod"

export const formSchema = z.object({
  invoiceId: z.string().min(1, "Invoice is required"),
  productId: z.string().optional(),
  productName: z.string().optional(),
  productPrice: z.number().optional(),
  shippingAddress: z.object({
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zip: z.string().min(1, "ZIP code is required"),
  }),
  sameAsBilling: z.boolean().default(false),
  billingAddress: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
  }),
  paymentMethod: z.enum(["cod", "bkash", "nagad"]),
  transactionId: z.string().optional(),
})

export type OrderFormValues = z.infer<typeof formSchema>

export const submitOrderForm = async (values: OrderFormValues) => {
  console.log("Starting form submission with values:", values)

  try {
    // Basic validation
    if (!values.invoiceId) {
      console.error("Missing invoice ID")
      toast.error("Please select an invoice")
      return false
    }

    if (!values.shippingAddress.street || !values.shippingAddress.city || 
        !values.shippingAddress.state || !values.shippingAddress.zip) {
      console.error("Missing shipping address fields")
      toast.error("Please fill in all shipping address fields")
      return false
    }

    // Validate billing address if not same as shipping
    if (!values.sameAsBilling) {
      if (!values.billingAddress.street || !values.billingAddress.city ||
          !values.billingAddress.state || !values.billingAddress.zip) {
        console.error("Missing billing address fields")
        toast.error("Please fill in all billing address fields")
        return false
      }
    }

    // Validate transaction ID for mobile payments
    if ((values.paymentMethod === "bkash" || values.paymentMethod === "nagad") && !values.transactionId) {
      console.error("Missing transaction ID for mobile payment")
      toast.error("Please provide a transaction ID")
      return false
    }

    const orderData = {
      invoice_id: values.invoiceId,
      product_id: values.productId || null,
      product_name: values.productName || null,
      product_price: values.productPrice || 0,
      shipping_street: values.shippingAddress.street,
      shipping_city: values.shippingAddress.city,
      shipping_state: values.shippingAddress.state,
      shipping_zip: values.shippingAddress.zip,
      billing_street: values.sameAsBilling ? values.shippingAddress.street : values.billingAddress.street,
      billing_city: values.sameAsBilling ? values.shippingAddress.city : values.billingAddress.city,
      billing_state: values.sameAsBilling ? values.shippingAddress.state : values.billingAddress.state,
      billing_zip: values.sameAsBilling ? values.shippingAddress.zip : values.billingAddress.zip,
      payment_method: values.paymentMethod,
      transaction_id: values.transactionId || null,
      status: 'pending'
    }

    console.log("Attempting to insert order data:", orderData)

    const { data, error } = await supabase
      .from("orders")
      .insert([orderData])
      .select()

    if (error) {
      console.error("Supabase insert error:", error)
      toast.error("Failed to create order: " + error.message)
      return false
    }

    console.log("Order created successfully:", data)
    toast.success("Order created successfully!")
    return true
  } catch (error) {
    console.error("Error creating order:", error)
    toast.error("Failed to create order. Please try again.")
    return false
  }
}