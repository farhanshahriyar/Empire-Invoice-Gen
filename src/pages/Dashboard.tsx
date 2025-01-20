import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Package, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { format } from "date-fns";

const Dashboard = () => {
  const { data: customerStats } = useQuery({
    queryKey: ["customer-stats"],
    queryFn: async () => {
      const { count } = await supabase
        .from("customers")
        .select("*", { count: "exact" });
      return { total: count || 0 };
    },
  });

  const { data: inventoryStats } = useQuery({
    queryKey: ["inventory-stats"],
    queryFn: async () => {
      const { data } = await supabase.from("products").select("stock, price");

      if (!data) return { totalStock: 0, totalValue: 0 };

      return {
        totalStock: data.reduce((sum, item) => sum + (item.stock || 0), 0),
        totalValue: data.reduce(
          (sum, item) => sum + (item.stock || 0) * (item.price || 0),
          0
        ),
      };
    },
  });

  const { data: recentInvoices } = useQuery({
    queryKey: ["recent-invoices"],
    queryFn: async () => {
      const { data } = await supabase
        .from("invoices")
        .select("*")
        .order("date", { ascending: false })
        .limit(5);
      return data || [];
    },
  });

  const { data: monthlyData } = useQuery({
    queryKey: ["monthly-invoices"],
    queryFn: async () => {
      const { data } = await supabase
        .from("invoices")
        .select("date, amount")
        .order("date", { ascending: true });

      if (!data) return [];

      const monthlyTotals = data.reduce((acc, invoice) => {
        const month = format(new Date(invoice.date), "MMM yyyy");
        if (!acc[month]) acc[month] = 0;
        acc[month] += Number(invoice.amount);
        return acc;
      }, {});

      return Object.entries(monthlyTotals).map(([month, total]) => ({
        month,
        total,
      }));
    },
  });

  const chartConfig = {
    revenue: {
      label: "Revenue",
      theme: {
        light: "hsl(var(--primary))",
        dark: "hsl(var(--primary))",
      },
    },
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerStats?.total || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {inventoryStats?.totalStock || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Inventory Value
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${inventoryStats?.totalValue.toFixed(2) || "0.00"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <XAxis
                      dataKey="month"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Bar
                      dataKey="total"
                      fill="#6366F1"
                      radius={[4, 4, 0, 0]}
                    />
                    <ChartTooltip />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Invoices */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentInvoices?.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{invoice.invoice_number}</p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(invoice.date), "PPP")}
                    </p>
                  </div>
                  <div className="text-sm font-medium">
                    ${Number(invoice.amount).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
