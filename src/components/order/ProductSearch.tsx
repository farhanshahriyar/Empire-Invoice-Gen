import { useState } from "react"
import { Check } from "lucide-react"
import { UseFormReturn } from "react-hook-form"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

interface ProductSearchProps {
  form: UseFormReturn<any>
}

export function ProductSearch({ form }: ProductSearchProps) {
  const [productSearch, setProductSearch] = useState("")

  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      console.log("Fetching products...")
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })
      
      if (error) {
        console.error("Error fetching products:", error)
        throw error
      }
      
      console.log("Fetched products:", data)
      return data || null
    },
  })

  const filteredProducts = products?.filter(product => 
    product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    product.sku.toLowerCase().includes(productSearch.toLowerCase())
  )

  const handleProductSelect = (product: any) => {
    console.log("Selected product:", product)
    form.setValue("productId", product.id)
    form.setValue("productName", product.name)
    form.setValue("productPrice", product.price)
  }

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="productSearch"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Search Products</FormLabel>
            <FormControl>
              <Input
                placeholder="Search by product name or SKU..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="mt-4">
        {isLoading ? (
          <div className="text-center py-4">Loading products...</div>
        ) : !filteredProducts || filteredProducts.length === 0 ? (
          <div className="text-center py-4">No products found.</div>
        ) : (
          <div className="space-y-2">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="flex flex-col p-4 border rounded-lg cursor-pointer hover:bg-accent"
                onClick={() => handleProductSelect(product)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-muted-foreground">
                      SKU: {product.sku}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Stock: {product.stock}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      ${product.price.toFixed(2)}
                    </div>
                    {product.stock <= product.min_stock && (
                      <div className="text-sm text-red-500">
                        Low Stock
                      </div>
                    )}
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