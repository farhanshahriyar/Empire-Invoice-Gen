import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { UseFormReturn } from "react-hook-form"
import { Invoice } from "@/types/invoice"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

interface InvoiceSearchProps {
  form: UseFormReturn<any>
  invoices: Invoice[] | null
  isLoading: boolean
  openCombobox: boolean
  setOpenCombobox: (open: boolean) => void
}

export function InvoiceSearch({ 
  form, 
  invoices, 
  isLoading, 
  openCombobox, 
  setOpenCombobox 
}: InvoiceSearchProps) {
  const [phoneSearch, setPhoneSearch] = useState("")

  const { data: customers, isLoading: isLoadingCustomers } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      console.log("Fetching customers...")
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3)
      
      if (error) {
        console.error("Error fetching customers:", error)
        throw error
      }
      
      console.log("Fetched customers:", data)
      return data || null
    },
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const filteredCustomers = customers?.filter(customer => 
    customer.phone.toLowerCase().includes(phoneSearch.toLowerCase())
  )

  const handleCustomerSelect = (customer: any) => {
    console.log("Selected customer:", customer)
    // Find the corresponding invoice for this customer
    const customerInvoice = invoices?.find(inv => inv.phone === customer.phone)
    if (customerInvoice) {
      console.log("Found matching invoice:", customerInvoice)
      form.setValue("invoiceId", customerInvoice.id)
    }
  }

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="phoneSearch"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Search by Phone Number</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter phone number..."
                value={phoneSearch}
                onChange={(e) => setPhoneSearch(e.target.value)}
                className="w-full"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="mt-4">
        {isLoadingCustomers ? (
          <div className="text-center py-4">Loading customers...</div>
        ) : !filteredCustomers || filteredCustomers.length === 0 ? (
          <div className="text-center py-4">No customers found.</div>
        ) : (
          <div className="space-y-2">
            {filteredCustomers.map((customer) => (
              <div
                key={customer.id}
                className="flex flex-col p-4 border rounded-lg cursor-pointer hover:bg-accent"
                onClick={() => handleCustomerSelect(customer)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{customer.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {customer.email}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {customer.phone}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">
                      {formatDate(customer.created_at)}
                    </div>
                    <div className="font-medium">
                      {customer.status}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}