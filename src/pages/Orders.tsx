import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Filter, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/integrations/supabase/client"
import { CreateOrderSheet } from "@/components/CreateOrderSheet"
import { CSVLink } from "react-csv"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useState } from "react"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { addDays } from "date-fns"
import { toast } from "sonner"
import { DateRange } from "react-day-picker"

export default function Orders() {
  const [currentPage, setCurrentPage] = useState(1)
  const [dateRange, setDateRange] = useState<DateRange>({
    from: addDays(new Date(), -30),
    to: new Date(),
  })
  const ordersPerPage = 10
  const queryClient = useQueryClient()

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders", dateRange],
    queryFn: async () => {
      console.log("Fetching orders with date range:", dateRange)
      // const { data, error } = await supabase
      //   .from("orders")
      //   .select(`
      //     *,
      //     invoice:invoices(
      //       customer,
      //       date,
      //       amount
      //     )
      //   `)
      //   .gte('created_at', dateRange.from?.toISOString() ?? '')
      //   .lte('created_at', dateRange.to?.toISOString() ?? new Date().toISOString())
      //   .order('created_at', { ascending: false })
      const { data, error } = await supabase
        .from("orders")
        .select(`
    *,
    invoice:invoices(
      customer,
      date,
      amount
    )
  `)
        .gte('created_at', dateRange.from?.toISOString() ?? '')
        .lte('created_at', dateRange.to?.toISOString() ?? new Date().toISOString())
        .order('created_at', { ascending: false });


      if (error) {
        console.error("Error fetching orders:", error)
        toast.error("Failed to fetch orders")
        throw error
      }

      console.log("Fetched orders:", data)
      return data || []
    },
  })

  // Calculate statistics
  const totalAmount = orders.reduce((sum, order) => sum + Number(order.invoice?.amount || 0), 0)
  const fulfilledOrders = orders.filter(order => order.status === "fulfilled").length
  const pendingOrders = orders.filter(order => order.status === "pending").length

  // Pagination
  const totalPages = Math.ceil(orders.length / ordersPerPage)
  const startIndex = (currentPage - 1) * ordersPerPage
  const paginatedOrders = orders.slice(startIndex, startIndex + ordersPerPage)

  // CSV Export Data
  const csvData = [
    ['Customer Name', 'Order ID', 'Payment Method', 'Date', 'Status', 'Amount'],
    ...orders.map(order => [
      order.invoice?.customer,
      order.id,
      order.payment_method,
      order.invoice?.date ? new Date(order.invoice.date).toLocaleDateString() : '-',
      order.status,
      order.invoice?.amount ? `$${Number(order.invoice.amount).toFixed(2)}` : '$0.00'
    ])
  ]

  const handleOrderCreated = () => {
    // Invalidate and refetch orders
    queryClient.invalidateQueries({ queryKey: ["orders"] })
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Your Orders</h2>
              <p className="text-muted-foreground">
                Introducing Our Dynamic Orders Dashboard for Seamless Management and
                Insightful Analysis.
              </p>
            </div>
          </div>
          <CreateOrderSheet onOrderCreated={handleOrderCreated} />
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <div className="space-y-2">
            <h3 className="text-sm text-muted-foreground">Total Revenue</h3>
            <div className="text-3xl font-bold">${totalAmount.toFixed(2)}</div>
            <p className="text-sm text-muted-foreground">+10% from last month</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-2">
            <h3 className="text-sm text-muted-foreground">Fulfilled Orders</h3>
            <div className="text-3xl font-bold">{fulfilledOrders}</div>
            <p className="text-sm text-muted-foreground">+5% from last week</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-2">
            <h3 className="text-sm text-muted-foreground">Pending Orders</h3>
            <div className="text-3xl font-bold">{pendingOrders}</div>
            <p className="text-sm text-muted-foreground">-2% from last week</p>
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recent Orders</h3>
            <p className="text-sm text-muted-foreground">
              Recent orders from your store
            </p>
          </div>

          <div className="flex items-center justify-between">
            <Tabs defaultValue="week">
              <TabsList>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="year">Year</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex gap-2 items-center">
              <DatePickerWithRange date={dateRange} setDate={setDateRange} />
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <CSVLink
                data={csvData}
                filename="orders.csv"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </CSVLink>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      Loading orders...
                    </TableCell>
                  </TableRow>
                ) : paginatedOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        {order.invoice?.customer}
                      </TableCell>
                      <TableCell>{order.id.slice(0, 8)}</TableCell>
                      <TableCell>{order.payment_method}</TableCell>
                      <TableCell>
                        {order.invoice?.date ? new Date(order.invoice.date).toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${order.status === 'fulfilled'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'declined'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                          }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        ${Number(order.invoice?.amount || 0).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {orders.length > 0 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setCurrentPage(p => Math.max(1, p - 1))
                    }}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        setCurrentPage(page)
                      }}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setCurrentPage(p => Math.min(totalPages, p + 1))
                    }}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </Card>
    </div>
  )
}