import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { CreateCustomerForm } from "@/components/CreateCustomerForm"
import { EditCustomerForm } from "@/components/EditCustomerForm"
import { Pencil, Trash2 } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { useState } from "react"

const Customers = () => {
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<null | {
    id: string
    name: string
    email: string
    phone: string
    status: string
  }>(null)
  const queryClient = useQueryClient()

  const { data: customers = [] } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    },
  })

  const deleteCustomer = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] })
      toast.success("Customer deleted successfully")
    },
    onError: () => {
      toast.error("Failed to delete customer")
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Customers</h1>
        <Drawer open={isCreateDrawerOpen} onOpenChange={setIsCreateDrawerOpen}>
          <DrawerTrigger asChild>
            <Button>Add Customer</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Add New Customer</DrawerTitle>
            </DrawerHeader>
            <div className="p-4">
              <CreateCustomerForm onSuccess={() => {
                setIsCreateDrawerOpen(false)
                queryClient.invalidateQueries({ queryKey: ["customers"] })
              }} />
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    customer.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {customer.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingCustomer(customer)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteCustomer.mutate(customer.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Drawer 
        open={editingCustomer !== null} 
        onOpenChange={(open) => !open && setEditingCustomer(null)}
      >
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Edit Customer</DrawerTitle>
          </DrawerHeader>
          <div className="p-4">
            {editingCustomer && (
              <EditCustomerForm 
                customer={editingCustomer} 
                onSuccess={() => {
                  setEditingCustomer(null)
                  queryClient.invalidateQueries({ queryKey: ["customers"] })
                }} 
              />
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export default Customers