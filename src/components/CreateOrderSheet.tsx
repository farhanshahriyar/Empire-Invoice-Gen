import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import * as z from "zod";

const orderFormSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  customerEmail: z.string().email().optional().or(z.literal("")),
  customerPhone: z.string().min(1, "Phone number is required"),
  orderDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Order date is invalid")
    .transform((val) => new Date(val)),
  paymentMethod: z.enum(
    ["credit_card", "paypal", "bank_transfer", "bkash", "nagad", "cod"],
    {
      required_error: "Please select a payment method",
    }
  ),
  status: z.enum(["pending", "fulfilled", "cancelled", "returned"], {
    required_error: "Please select an order status",
  }),
  items: z
    .array(
      z.object({
        productName: z.string().min(1, "Product name is required"),
        quantity: z.number().min(1, "Quantity must be at least 1"),
        price: z.number().min(0, "Price must be positive"),
      })
    )
    .min(1, "At least one item is required"),
  transactionId: z.string().optional(),
  shippingStreet: z.string().min(1, "Shipping street is required"),
  shippingCity: z.string().min(1, "Shipping city is required"),
  shippingState: z.string().min(1, "Shipping state is required"),
  shippingZip: z.string().min(1, "Shipping ZIP is required"),
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

const defaultValues: Partial<OrderFormValues> = {
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  orderDate: new Date().toISOString(),
  paymentMethod: "cod",
  status: "pending",
  items: [{ productName: "", quantity: 1, price: 0 }],
  transactionId: "",
  shippingStreet: "",
  shippingCity: "",
  shippingState: "",
  shippingZip: "",
};

interface CreateOrderSheetProps {
  onOrderCreated?: () => void;
}

export function CreateOrderSheet({ onOrderCreated }: CreateOrderSheetProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    name: "items",
    control: form.control,
  });

  const calculateTotal = () => {
    const items = form.watch("items");
    return items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  };

  const onSubmit = async (values: OrderFormValues) => {
    try {
      const orderPayloads = values.items.map((item) => ({
        shipping_street: values.shippingStreet,
        shipping_city: values.shippingCity,
        shipping_state: values.shippingState,
        shipping_zip: values.shippingZip,
        payment_method: values.paymentMethod,
        transaction_id:
          values.paymentMethod === "bkash" || values.paymentMethod === "nagad"
            ? values.transactionId
            : null,
        status: values.status,
        product_name: item.productName,
        product_price: item.price,
        quantity: item.quantity,
        customer_name: values.customerName,
        customer_email: values.customerEmail || null,
        customer_phone: values.customerPhone,
        order_date: values.orderDate.toISOString(),
      }));

      const { error: ordersError } = await supabase.from("orders").insert(orderPayloads);

      if (ordersError) {
        toast.error(`Failed to create orders: ${ordersError.message}`);
        return;
      }

      toast.success("Order created successfully");
      setOpen(false);
      form.reset(defaultValues);
      onOrderCreated?.();
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to create order");
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>Create New Order</Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Create New Order</SheetTitle>
          <SheetDescription>
            Fill in the order details below
          </SheetDescription>
        </SheetHeader>
        {/* Form starts */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            {/* Customer Name */}
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter customer name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Customer Email */}
            <FormField
              control={form.control}
              name="customerEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Email (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter customer email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Customer Phone */}
            <FormField
              control={form.control}
              name="customerPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter customer phone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Order Date */}
            <FormField
              control={form.control}
              name="orderDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(new Date(field.value), "PPP")
                          ) : (
                            "Pick a date"
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) =>
                          field.onChange(date ? date.toISOString() : "")
                        }
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Payment Method */}
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="credit_card">Credit Card</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      <SelectItem value="bkash">Bkash</SelectItem>
                      <SelectItem value="nagad">Nagad</SelectItem>
                      <SelectItem value="cod">Cash on Delivery</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Transaction ID for Bkash/Nagad */}
            {(form.watch("paymentMethod") === "bkash" ||
              form.watch("paymentMethod") === "nagad") && (
                <FormField
                  control={form.control}
                  name="transactionId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{form.watch("paymentMethod")} Transaction ID</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={`Enter ${form.watch("paymentMethod")} transaction ID`}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

            {/* Order Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select order status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="fulfilled">Fulfilled</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="returned">Returned</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Shipping Details */}
            <FormField
              control={form.control}
              name="shippingStreet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shipping Street</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter shipping street" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shippingCity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shipping City</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter shipping city" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shippingState"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shipping State</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter shipping state" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shippingZip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shipping ZIP</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter shipping ZIP" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Order Items */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Order Items</h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ productName: "", quantity: 1, price: 0 })}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>

              {fields.map((field, index) => (
                <div key={field.id} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <h5 className="font-medium">Item {index + 1}</h5>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {/* Product Name */}
                  <FormField
                    control={form.control}
                    name={`items.${index}.productName`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter product name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Quantity and Price */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`items.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value) || 1)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`items.${index}.price`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value) || 0)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="text-right text-sm text-muted-foreground">
                    Total: $
                    {(
                      form.watch(`items.${index}.quantity`) *
                      form.watch(`items.${index}.price`)
                    ).toFixed(2)}
                  </div>
                </div>
              ))}

              <div className="text-right font-medium">
                Order Total: ${calculateTotal().toFixed(2)}
              </div>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full">
              Create Order
            </Button>
          </form>
        </Form>
        {/* Form ends */}
      </SheetContent>
    </Sheet>
  );
}
