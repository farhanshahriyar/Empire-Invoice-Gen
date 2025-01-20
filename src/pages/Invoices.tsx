import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CSVLink } from "react-csv"
import { BlobProvider } from "@react-pdf/renderer"
import { InvoicePDF } from "@/components/InvoicePDF"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { CreateInvoiceForm } from "@/components/CreateInvoiceForm"
import { EditInvoiceForm } from "@/components/EditInvoiceForm"
import { supabase } from "@/lib/supabase"
import { Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"

const Invoices = () => {
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [editingInvoice, setEditingInvoice] = useState(null)

  const { data: invoices = [], refetch } = useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    },
  })

  const handleEdit = (invoice) => {
    setEditingInvoice(invoice)
    setIsDrawerOpen(true)
  }

  const handleDelete = async (id) => {
    try {
      // First, check if there are any associated orders
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('id')
        .eq('invoice_id', id)

      if (ordersError) throw ordersError

      if (orders && orders.length > 0) {
        // Delete associated orders first
        const { error: deleteOrdersError } = await supabase
          .from('orders')
          .delete()
          .eq('invoice_id', id)

        if (deleteOrdersError) throw deleteOrdersError
      }

      // Now delete the invoice
      const { error: deleteInvoiceError } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id)

      if (deleteInvoiceError) throw deleteInvoiceError

      toast.success("Invoice deleted successfully")
      refetch()
    } catch (error) {
      console.error('Error deleting invoice:', error)
      if (error.message?.includes('foreign key constraint')) {
        toast.error("Cannot delete invoice with associated orders")
      } else {
        toast.error("Failed to delete invoice")
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Invoices</h1>
        <div className="space-x-2">
          <Button variant="outline" asChild>
            <CSVLink
              data={invoices}
              filename="empire-invoices.csv"
              className="flex items-center gap-2"
            >
              Export CSV
            </CSVLink>
          </Button>
          {selectedInvoice && (
            <Button variant="outline" asChild>
              <BlobProvider document={<InvoicePDF invoice={selectedInvoice} />}>
                {({ url }) => (
                  <a href={url} download="empire-invoice.pdf">
                    Download PDF
                  </a>
                )}
              </BlobProvider>
            </Button>
          )}
          <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <DrawerTrigger asChild>
              <Button>Create Invoice</Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>
                  {editingInvoice ? "Edit Invoice" : "Create New Invoice"}
                </DrawerTitle>
              </DrawerHeader>
              <div className="p-4">
                {editingInvoice ? (
                  <EditInvoiceForm 
                    invoice={editingInvoice} 
                    onSuccess={() => {
                      setIsDrawerOpen(false)
                      setEditingInvoice(null)
                      refetch()
                    }} 
                  />
                ) : (
                  <CreateInvoiceForm 
                    onSuccess={() => {
                      setIsDrawerOpen(false)
                      refetch()
                    }} 
                  />
                )}
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow
                key={invoice.id}
                className="cursor-pointer"
                onClick={() => setSelectedInvoice(invoice)}
              >
                <TableCell>{invoice.invoice_number}</TableCell>
                <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                <TableCell>{invoice.customer}</TableCell>
                <TableCell>{invoice.email || '-'}</TableCell>
                <TableCell>{invoice.phone || '-'}</TableCell>
                <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                <TableCell className="capitalize">{invoice.status}</TableCell>
                <TableCell className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEdit(invoice)
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(invoice.id)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default Invoices