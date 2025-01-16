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
import { AlertCircle, Pencil, Trash2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { CreateProductForm } from "@/components/CreateProductForm"
import { EditProductForm } from "@/components/EditProductForm"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { useState } from "react"

const Inventory = () => {
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<null | {
    id: string
    name: string
    sku: string
    stock: number
    min_stock: number
    price: number
  }>(null)
  const queryClient = useQueryClient()

  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    },
  })

  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      toast.success("Product deleted successfully")
    },
    onError: () => {
      toast.error("Failed to delete product")
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Inventory</h1>
        <Drawer open={isCreateDrawerOpen} onOpenChange={setIsCreateDrawerOpen}>
          <DrawerTrigger asChild>
            <Button>Add Product</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Add New Product</DrawerTitle>
            </DrawerHeader>
            <div className="p-4">
              <CreateProductForm onSuccess={() => {
                setIsCreateDrawerOpen(false)
                queryClient.invalidateQueries({ queryKey: ["products"] })
              }} />
            </div>
          </DrawerContent>
        </Drawer>
      </div>
      
      <div className="grid gap-4">
        {products.some(p => p.stock < p.min_stock) && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Some products are running low on stock!
            </AlertDescription>
          </Alert>
        )}
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      product.stock > product.min_stock 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.stock > product.min_stock ? 'In Stock' : 'Low Stock'}
                    </span>
                  </TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingProduct(product)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteProduct.mutate(product.id)}
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
      </div>

      <Drawer 
        open={editingProduct !== null} 
        onOpenChange={(open) => !open && setEditingProduct(null)}
      >
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Edit Product</DrawerTitle>
          </DrawerHeader>
          <div className="p-4">
            {editingProduct && (
              <EditProductForm 
                product={editingProduct} 
                onSuccess={() => {
                  setEditingProduct(null)
                  queryClient.invalidateQueries({ queryKey: ["products"] })
                }} 
              />
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export default Inventory