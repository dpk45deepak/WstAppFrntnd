// src/pages/user/PaymentsPage.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Receipt,
  Download,
  Plus,
  Shield,
  CheckCircle,
  Clock,
  AlertCircle,
  Banknote,
  Smartphone,
  CreditCard as CardIcon,
  MoreVertical,
  Filter,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  History,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import Input from "../../components/common/Input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/Tabs";
import { Badge } from "../../components/ui/Badge";

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "payment" | "refund" | "withdrawal";
  status: "completed" | "pending" | "failed";
  method: string;
}

interface PaymentMethod {
  id: string;
  type: "card" | "bank" | "wallet";
  name: string;
  details: string;
  isDefault: boolean;
}

const PaymentsPage = () => {
  const [balance, _balance] = useState(1245.75);
  const [transactions, _transactions] = useState<Transaction[]>([
    {
      id: "T001",
      date: "Today, 10:30 AM",
      description: "Furniture Pickup - 3 items",
      amount: 89.99,
      type: "payment",
      status: "completed",
      method: "Visa **** 4832",
    },
    {
      id: "T002",
      date: "Yesterday, 3:45 PM",
      description: "Electronics Delivery",
      amount: 149.5,
      type: "payment",
      status: "completed",
      method: "Apple Pay",
    },
    {
      id: "T003",
      date: "Oct 12, 11:20 AM",
      description: "Refund - Cancelled Pickup",
      amount: 45.0,
      type: "refund",
      status: "completed",
      method: "Original Payment",
    },
    {
      id: "T004",
      date: "Oct 10, 9:15 AM",
      description: "Clothing Donation Pickup",
      amount: 25.0,
      type: "payment",
      status: "pending",
      method: "Visa **** 4832",
    },
    {
      id: "T005",
      date: "Oct 8, 2:30 PM",
      description: "Withdrawal to Banknote",
      amount: 500.0,
      type: "withdrawal",
      status: "completed",
      method: "Chase Banknote **** 9012",
    },
  ]);

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      type: "card",
      name: "Visa Credit Card",
      details: "**** 4832 • Exp 05/25",
      isDefault: true,
    },
    {
      id: "2",
      type: "bank",
      name: "Chase Banknote Account",
      details: "**** 9012 • Savings",
      isDefault: false,
    },
    {
      id: "3",
      type: "wallet",
      name: "Apple Pay",
      details: "iPhone 14 Pro",
      isDefault: false,
    },
  ]);

  const [activeTab, setActiveTab] = useState("transactions");

  const stats = {
    totalSpent: 1250.49,
    monthlyAverage: 312.62,
    pendingPayments: 25.0,
    refunds: 45.0,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "failed":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "payment":
        return <ArrowUpRight className="w-4 h-4" />;
      case "refund":
        return <ArrowDownRight className="w-4 h-4" />;
      case "withdrawal":
        return <Banknote className="w-4 h-4" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-linear-to-br from-indigo-50 to-rose-100 rounded-xl">
                  <CreditCard className="w-8 h-8 text-indigo-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
              </div>
              <p className="text-gray-600">
                Manage your payments and transaction history
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Statements
              </Button>
              <Button className="bg-linear-to-r from-indigo-500 to-rose-400 hover:from-indigo-600 hover:to-rose-500">
                <Plus className="w-4 h-4 mr-2" />
                Add Funds
              </Button>
            </div>
          </div>
        </div>

        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="border border-gray-200 bg-linear-to-r from-indigo-50 via-white to-rose-50">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <p className="text-gray-600 mb-2">Available Balance</p>
                  <div className="flex items-baseline gap-3">
                    <h2 className="text-5xl font-bold text-gray-900">
                      ${balance.toFixed(2)}
                    </h2>
                    <Badge className="bg-green-100 text-green-700 border-green-200">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +12.5%
                    </Badge>
                  </div>
                  <p className="text-gray-600 mt-3">Last updated just now</p>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                  >
                    <ArrowUpRight className="w-4 h-4 mr-2" />
                    Send Money
                  </Button>
                  <Button className="bg-linear-to-r from-indigo-500 to-rose-400 hover:from-indigo-600 hover:to-rose-500">
                    <ArrowDownRight className="w-4 h-4 mr-2" />
                    Withdraw
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total Spent",
              value: `$${stats.totalSpent.toFixed(2)}`,
              icon: DollarSign,
              color: "from-blue-500 to-blue-600",
              trend: "+8.2%",
            },
            {
              label: "Monthly Avg",
              value: `$${stats.monthlyAverage.toFixed(2)}`,
              icon: TrendingUp,
              color: "from-green-500 to-green-600",
              trend: "+5.1%",
            },
            {
              label: "Pending",
              value: `$${stats.pendingPayments.toFixed(2)}`,
              icon: Clock,
              color: "from-amber-500 to-amber-600",
              trend: "2 payments",
            },
            {
              label: "Refunds",
              value: `$${stats.refunds.toFixed(2)}`,
              icon: TrendingDown,
              color: "from-rose-500 to-rose-600",
              trend: "1 refund",
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border border-gray-200 hover:border-indigo-200 transition-all">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{stat.trend}</p>
                    </div>
                    <div
                      className={`p-3 bg-linear-to-br ${stat.color} rounded-xl`}
                    >
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="methods">Payment Methods</TabsTrigger>
            <TabsTrigger value="billing">Billing History</TabsTrigger>
          </TabsList>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <CardTitle>Recent Transactions</CardTitle>
                      <div className="flex gap-2">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            placeholder="Search..."
                            className="pl-9 w-48"
                          />
                        </div>
                        <Button variant="outline" size="icon">
                          <Filter className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {transactions.map((transaction, index) => (
                        <motion.div
                          key={transaction.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors group"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`p-2 rounded-lg ${
                                transaction.type === "payment"
                                  ? "bg-red-100 text-red-600"
                                  : transaction.type === "refund"
                                    ? "bg-green-100 text-green-600"
                                    : "bg-blue-100 text-blue-600"
                              }`}
                            >
                              {getTypeIcon(transaction.type)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {transaction.description}
                              </p>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-sm text-gray-500 flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {transaction.date}
                                </span>
                                <span className="text-sm text-gray-500">•</span>
                                <span className="text-sm text-gray-500">
                                  {transaction.method}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p
                                className={`font-bold ${
                                  transaction.type === "payment"
                                    ? "text-gray-900"
                                    : transaction.type === "refund"
                                      ? "text-green-600"
                                      : "text-blue-600"
                                }`}
                              >
                                {transaction.type === "payment" ? "-" : "+"}$
                                {Math.abs(transaction.amount).toFixed(2)}
                              </p>
                              <Badge
                                className={`${getStatusColor(transaction.status)} border text-xs`}
                              >
                                {transaction.status}
                              </Badge>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="opacity-0 group-hover:opacity-100"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Receipt className="w-4 h-4 mr-2" />
                      View Invoice
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="w-4 h-4 mr-2" />
                      Download Receipt
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Report Issue
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <History className="w-4 h-4 mr-2" />
                      View All History
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-green-600" />
                      Security Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          2FA Enabled
                        </span>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Encrypted</span>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          Fraud Protection
                        </span>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Payment Methods Tab */}
          <TabsContent value="methods" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Methods</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {paymentMethods.map((method, index) => (
                        <motion.div
                          key={method.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-indigo-200 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`p-3 rounded-xl ${
                                method.type === "card"
                                  ? "bg-blue-100"
                                  : method.type === "bank"
                                    ? "bg-green-100"
                                    : "bg-purple-100"
                              }`}
                            >
                              {method.type === "card" ? (
                                <CardIcon className="w-6 h-6 text-blue-600" />
                              ) : method.type === "bank" ? (
                                <Banknote className="w-6 h-6 text-green-600" />
                              ) : (
                                <Smartphone className="w-6 h-6 text-purple-600" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-gray-900">
                                  {method.name}
                                </h4>
                                {method.isDefault && (
                                  <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200">
                                    Default
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                {method.details}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {!method.isDefault && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setPaymentMethods((methods) =>
                                    methods.map((m) => ({
                                      ...m,
                                      isDefault: m.id === method.id,
                                    })),
                                  );
                                }}
                              >
                                Set Default
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              Remove
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <Button variant="outline" className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Payment Method
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Tips</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-800">
                        💳 Always keep a backup payment method
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm font-medium text-green-800">
                        🛡️ Your payments are encrypted & secure
                      </p>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-lg">
                      <p className="text-sm font-medium text-amber-800">
                        ⏰ Review pending payments regularly
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Spending</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          month: "October",
                          amount: 1250,
                          color: "bg-indigo-500",
                        },
                        {
                          month: "September",
                          amount: 980,
                          color: "bg-blue-500",
                        },
                        { month: "August", amount: 1150, color: "bg-rose-500" },
                        { month: "July", amount: 890, color: "bg-teal-500" },
                      ].map((item) => (
                        <div key={item.month}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">{item.month}</span>
                            <span className="font-medium">${item.amount}</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${item.color} rounded-full`}
                              style={{
                                width: `${(item.amount / 1500) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Billing History Tab */}
          <TabsContent value="billing" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <div className="inline-block p-4 bg-linear-to-br from-gray-100 to-gray-200 rounded-full mb-4">
                    <Receipt className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Billing History
                  </h3>
                  <p className="text-gray-600 max-w-sm mx-auto mb-6">
                    View and download your complete billing history and invoices
                  </p>
                  <Button className="bg-linear-to-r from-indigo-500 to-rose-400">
                    <History className="w-4 h-4 mr-2" />
                    View Complete History
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default PaymentsPage;
