// src/pages/user/ReportsPage.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  TrendingUp,
  TrendingDown,
  Download,
  Filter,
  Calendar,
  BarChart3,
  PieChart,
  Eye,
  Share2,
  Printer,
  Mail,
  MoreVertical,
  CheckCircle,
  Clock,
  AlertCircle,
  DollarSign,
  Package,
  MapPin,
  Clock as ClockIcon,
  Search,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import Input from "../../components/common/Input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/Tabs";
import { Badge } from "../../components/ui/Badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/Select";

interface Report {
  id: string;
  title: string;
  type: "analytics" | "financial" | "activity" | "summary";
  date: string;
  status: "generated" | "pending" | "failed";
  size: string;
  icon: React.ReactNode;
}

const ReportsPage = () => {
  const [reports, _Reports] = useState<Report[]>([
    {
      id: "R001",
      title: "Monthly Financial Summary",
      type: "financial",
      date: "Oct 15, 2023",
      status: "generated",
      size: "2.4 MB",
      icon: <DollarSign className="w-6 h-6" />,
    },
    {
      id: "R002",
      title: "Pickup Activity Report",
      type: "activity",
      date: "Oct 14, 2023",
      status: "generated",
      size: "1.8 MB",
      icon: <Package className="w-6 h-6" />,
    },
    {
      id: "R003",
      title: "Geographic Analysis",
      type: "analytics",
      date: "Oct 13, 2023",
      status: "pending",
      size: "3.2 MB",
      icon: <MapPin className="w-6 h-6" />,
    },
    {
      id: "R004",
      title: "Quarterly Summary",
      type: "summary",
      date: "Oct 12, 2023",
      status: "generated",
      size: "4.1 MB",
      icon: <FileText className="w-6 h-6" />,
    },
    {
      id: "R005",
      title: "Time Analysis Report",
      type: "analytics",
      date: "Oct 11, 2023",
      status: "failed",
      size: "2.9 MB",
      icon: <ClockIcon className="w-6 h-6" />,
    },
  ]);

  const [timeRange, setTimeRange] = useState("month");
  const [selectedReportType, setSelectedReportType] = useState("all");

  const stats = {
    totalReports: 24,
    generated: 18,
    pending: 4,
    failed: 2,
  };

  const analyticsData = {
    pickupsByMonth: [65, 59, 80, 81, 56, 55, 40],
    spendingTrend: [120, 190, 300, 500, 200, 300, 450],
    activityHours: [7, 5, 8, 6, 9, 7, 6],
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "generated":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "failed":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "financial":
        return "from-green-500 to-teal-400";
      case "activity":
        return "from-blue-500 to-indigo-400";
      case "analytics":
        return "from-purple-500 to-pink-400";
      case "summary":
        return "from-amber-500 to-orange-400";
      default:
        return "from-gray-500 to-gray-400";
    }
  };

  const filteredReports =
    selectedReportType === "all"
      ? reports
      : reports.filter((report) => report.type === selectedReportType);

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
                <div className="p-2 bg-linear-to-br from-teal-50 to-blue-100 rounded-xl">
                  <FileText className="w-8 h-8 text-teal-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">My Reports</h1>
              </div>
              <p className="text-gray-600">
                Access and analyze your pickup data and insights
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="border-teal-200 text-teal-600 hover:bg-teal-50"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button className="bg-linear-to-r from-teal-400 to-blue-400 hover:from-teal-500 hover:to-blue-500">
                <FileText className="w-4 h-4 mr-2" />
                Generate New Report
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total Reports",
              value: stats.totalReports,
              icon: FileText,
              color: "from-teal-500 to-teal-600",
              change: "+5",
            },
            {
              label: "Generated",
              value: stats.generated,
              icon: CheckCircle,
              color: "from-green-500 to-green-600",
              change: "+12%",
            },
            {
              label: "Pending",
              value: stats.pending,
              icon: Clock,
              color: "from-amber-500 to-amber-600",
              change: "2 new",
            },
            {
              label: "Failed",
              value: stats.failed,
              icon: AlertCircle,
              color: "from-rose-500 to-rose-600",
              change: "Fixed 1",
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border border-gray-200 hover:border-teal-200 transition-all">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {stat.change}
                      </p>
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

        <Tabs defaultValue="reports" className="w-full">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="reports">All Reports</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>

          {/* Reports Tab */}
          <TabsContent value="reports" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <CardTitle>Recent Reports</CardTitle>
                      <div className="flex gap-2">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            placeholder="Search reports..."
                            className="pl-9 w-48"
                          />
                        </div>
                        <Select
                          value={selectedReportType}
                          onValueChange={setSelectedReportType}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Filter by type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="financial">Financial</SelectItem>
                            <SelectItem value="activity">Activity</SelectItem>
                            <SelectItem value="analytics">Analytics</SelectItem>
                            <SelectItem value="summary">Summary</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredReports.map((report, index) => (
                        <motion.div
                          key={report.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-teal-200 transition-colors group"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`p-3 bg-linear-to-br ${getTypeColor(report.type)} rounded-xl`}
                            >
                              <div className="text-white">{report.icon}</div>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-gray-900">
                                  {report.title}
                                </h4>
                                <Badge
                                  variant="outline"
                                  className="text-xs capitalize"
                                >
                                  {report.type}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 mt-1">
                                <span className="text-sm text-gray-500 flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {report.date}
                                </span>
                                <span className="text-sm text-gray-500">•</span>
                                <span className="text-sm text-gray-500">
                                  {report.size}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge
                              className={`${getStatusColor(report.status)} border`}
                            >
                              {report.status}
                            </Badge>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </div>
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
                      <Download className="w-4 h-4 mr-2" />
                      Download All
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Mail className="w-4 h-4 mr-2" />
                      Email Reports
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Dashboard
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Filter className="w-4 h-4 mr-2" />
                      Advanced Filters
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Report Types</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      {
                        type: "financial",
                        label: "Financial Reports",
                        count: 8,
                        color: "bg-linear-to-r from-green-500 to-teal-400",
                      },
                      {
                        type: "activity",
                        label: "Activity Reports",
                        count: 7,
                        color: "bg-linear-to-r from-blue-500 to-indigo-400",
                      },
                      {
                        type: "analytics",
                        label: "Analytics Reports",
                        count: 5,
                        color: "bg-linear-to-r from-purple-500 to-pink-400",
                      },
                      {
                        type: "summary",
                        label: "Summary Reports",
                        count: 4,
                        color: "bg-linear-to-r from-amber-500 to-orange-400",
                      },
                    ].map((item) => (
                      <div
                        key={item.type}
                        className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-3 h-3 rounded-full ${item.color}`}
                          />
                          <span className="text-sm font-medium">
                            {item.label}
                          </span>
                        </div>
                        <Badge variant="secondary">{item.count}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Pickups Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Chart visualization */}
                    <div className="h-64 flex items-end gap-2 pt-8">
                      {analyticsData.pickupsByMonth.map((value, index) => (
                        <div
                          key={index}
                          className="flex-1 flex flex-col items-center"
                        >
                          <div
                            className="w-full bg-linear-to-t from-teal-500 to-teal-400 rounded-t-lg"
                            style={{ height: `${(value / 100) * 200}px` }}
                          />
                          <span className="text-xs text-gray-500 mt-2">
                            {
                              ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"][
                                index
                              ]
                            }
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">245</p>
                        <p className="text-sm text-gray-600">
                          Total pickups this year
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-700 border-green-200">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +18.5%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Spending Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="h-64 flex items-end gap-2 pt-8">
                      {analyticsData.spendingTrend.map((value, index) => (
                        <div
                          key={index}
                          className="flex-1 flex flex-col items-center"
                        >
                          <div
                            className="w-full bg-linear-to-t from-blue-500 to-indigo-400 rounded-t-lg"
                            style={{ height: `${(value / 500) * 200}px` }}
                          />
                          <span className="text-xs text-gray-500 mt-2">
                            {["W1", "W2", "W3", "W4", "W5", "W6", "W7"][index]}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          $1,245
                        </p>
                        <p className="text-sm text-gray-600">
                          Total spending this month
                        </p>
                      </div>
                      <Badge className="bg-rose-100 text-rose-700 border-rose-200">
                        <TrendingDown className="w-3 h-3 mr-1" />
                        -8.2%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
                    Pickup Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                      {
                        label: "Furniture",
                        value: 35,
                        color: "bg-linear-to-r from-teal-500 to-teal-400",
                      },
                      {
                        label: "Electronics",
                        value: 25,
                        color: "bg-linear-to-r from-blue-500 to-blue-400",
                      },
                      {
                        label: "Clothing",
                        value: 20,
                        color: "bg-linear-to-r from-purple-500 to-purple-400",
                      },
                      {
                        label: "Other",
                        value: 20,
                        color: "bg-linear-to-r from-amber-500 to-amber-400",
                      },
                    ].map((category, index) => (
                      <div key={index} className="text-center">
                        <div className="relative w-32 h-32 mx-auto mb-4">
                          <div className="absolute inset-0 rounded-full border-8 border-gray-100" />
                          <div
                            className="absolute inset-8 rounded-full"
                            style={{
                              background: `conic-linear(${category.color} ${category.value * 3.6}deg, #e5e7eb 0)`,
                            }}
                          />
                          <div className="absolute inset-12 rounded-full bg-white flex items-center justify-center">
                            <span className="text-2xl font-bold text-gray-900">
                              {category.value}%
                            </span>
                          </div>
                        </div>
                        <p className="font-medium text-gray-900">
                          {category.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Export Tab */}
          <TabsContent value="export" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="max-w-2xl mx-auto">
                  <div className="text-center mb-8">
                    <div className="inline-block p-4 bg-linear-to-br from-teal-50 to-blue-100 rounded-full mb-4">
                      <Download className="w-12 h-12 text-teal-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Export Your Data
                    </h3>
                    <p className="text-gray-600">
                      Choose your preferred format and date range
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Export Format
                      </label>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          {
                            format: "PDF",
                            icon: FileText,
                            color: "border-red-200 bg-red-50",
                          },
                          {
                            format: "CSV",
                            icon: BarChart3,
                            color: "border-green-200 bg-green-50",
                          },
                          {
                            format: "Excel",
                            icon: PieChart,
                            color: "border-blue-200 bg-blue-50",
                          },
                        ].map((item) => (
                          <button
                            key={item.format}
                            className={`p-4 border rounded-xl text-center transition-all hover:scale-105 ${item.color}`}
                          >
                            <item.icon className="w-8 h-8 mx-auto mb-2" />
                            <span className="font-medium text-gray-900">
                              {item.format}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date Range
                      </label>
                      <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="week">Last Week</SelectItem>
                          <SelectItem value="month">Last Month</SelectItem>
                          <SelectItem value="quarter">Last Quarter</SelectItem>
                          <SelectItem value="year">Last Year</SelectItem>
                          <SelectItem value="custom">Custom Range</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Include Data
                      </label>
                      <div className="space-y-2">
                        {[
                          "Transaction History",
                          "Pickup Details",
                          "Driver Information",
                          "Location Data",
                          "Payment Methods",
                          "Analytics Reports",
                        ].map((item) => (
                          <div key={item} className="flex items-center">
                            <input
                              type="checkbox"
                              id={item}
                              className="rounded border-gray-300"
                              defaultChecked
                            />
                            <label
                              htmlFor={item}
                              className="ml-2 text-gray-700"
                            >
                              {item}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button className="w-full bg-linear-to-r from-teal-400 to-blue-400 hover:from-teal-500 hover:to-blue-500">
                      <Download className="w-4 h-4 mr-2" />
                      Generate & Download Export
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default ReportsPage;
