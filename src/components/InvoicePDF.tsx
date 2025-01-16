import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 30,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  date: {
    color: "#666",
    fontSize: 11,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    paddingBottom: 5,
    borderBottom: "1px solid #eee",
  },
  itemsTable: {
    marginBottom: 20,
  },
  itemRow: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  itemDescription: {
    flex: 2,
  },
  itemQuantity: {
    flex: 1,
    textAlign: "center",
  },
  itemPrice: {
    flex: 1,
    textAlign: "right",
  },
  summarySection: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  summaryLabel: {
    color: "#666",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#000",
    marginTop: 4,
    fontWeight: "bold",
  },
  infoSection: {
    marginBottom: 20,
  },
  infoTitle: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  infoText: {
    color: "#444",
    marginBottom: 4,
  },
  twoColumnSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  column: {
    flex: 1,
    paddingRight: 20,
  },
})

export const InvoicePDF = ({ invoice }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.orderNumber}>Order {invoice.invoice_number}</Text>
        <Text style={styles.date}>Date: {new Date(invoice.date).toLocaleDateString()}</Text>
      </View>

      <View style={styles.itemsTable}>
        <Text style={styles.sectionTitle}>Order Details</Text>
        {invoice.items?.map((item) => (
          <View key={item.id} style={styles.itemRow}>
            <Text style={styles.itemDescription}>
              {item.description} x {item.quantity}
            </Text>
            <Text style={styles.itemPrice}>${item.total.toFixed(2)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.summarySection}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text>${invoice.amount.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Shipping</Text>
          <Text>$0.00</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Tax</Text>
          <Text>${(invoice.amount * 0.1).toFixed(2)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text>Total</Text>
          <Text>${(invoice.amount * 1.1).toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.twoColumnSection}>
        <View style={styles.column}>
          <Text style={styles.infoTitle}>Shipping Information</Text>
          <Text style={styles.infoText}>{invoice.customer}</Text>
          <Text style={styles.infoText}>123 Main St</Text>
          <Text style={styles.infoText}>Anytown, CA 12345</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.infoTitle}>Billing Information</Text>
          <Text style={styles.infoText}>Same as shipping address</Text>
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Customer Information</Text>
        <Text style={styles.infoText}>Customer: {invoice.customer}</Text>
        <Text style={styles.infoText}>Email: {invoice.email || 'Not provided'}</Text>
        <Text style={styles.infoText}>Phone: {invoice.phone || 'Not provided'}</Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Payment Information</Text>
        <Text style={styles.infoText}>Visa **** **** **** 4532</Text>
      </View>
    </Page>
  </Document>
)