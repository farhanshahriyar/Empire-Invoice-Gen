import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"

interface ProductFormData {
  name: string
  sku: string
  stock: number
  min_stock: number
  price: number
}

export function CreateProductForm({ onSuccess }: { onSuccess: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ProductFormData>()

  const onSubmit = async (data: ProductFormData) => {
    try {
      setIsSubmitting(true)
      const { error } = await supabase
        .from('products')
        .insert([data])

      if (error) throw error

      toast.success("Product created successfully")
      reset()
      onSuccess()
    } catch (error) {
      console.error('Error creating product:', error)
      toast.error("Failed to create product")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Product Name</Label>
        <Input
          id="name"
          {...register("name", { required: "Product name is required" })}
          placeholder="Product name"
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="sku">SKU</Label>
        <Input
          id="sku"
          {...register("sku", { required: "SKU is required" })}
          placeholder="SKU"
        />
        {errors.sku && (
          <p className="text-sm text-red-500">{errors.sku.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="stock">Current Stock</Label>
        <Input
          id="stock"
          type="number"
          {...register("stock", { 
            required: "Stock quantity is required",
            min: { value: 0, message: "Stock cannot be negative" }
          })}
          placeholder="0"
        />
        {errors.stock && (
          <p className="text-sm text-red-500">{errors.stock.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="min_stock">Minimum Stock Level</Label>
        <Input
          id="min_stock"
          type="number"
          {...register("min_stock", { 
            required: "Minimum stock level is required",
            min: { value: 0, message: "Minimum stock cannot be negative" }
          })}
          placeholder="0"
        />
        {errors.min_stock && (
          <p className="text-sm text-red-500">{errors.min_stock.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          {...register("price", { 
            required: "Price is required",
            min: { value: 0, message: "Price must be positive" }
          })}
          placeholder="0.00"
        />
        {errors.price && (
          <p className="text-sm text-red-500">{errors.price.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Product"}
      </Button>
    </form>
  )
}