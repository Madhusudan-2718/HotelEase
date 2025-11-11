import { motion } from "motion/react";
import { Download, Calendar, TrendingUp, BarChart3, PieChart as PieChartIcon } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";

const tasksByDepartment = [
  { name: "Housekeeping", tasks: 45, completed: 38, color: "#6B8E23" },
  { name: "Restaurant", tasks: 32, completed: 28, color: "#FFD700" },
  { name: "Travel Desk", tasks: 18, completed: 15, color: "#FFA500" },
];

const completionTimeData = [
  { name: "Sita Kumar", avgTime: 25, color: "#6B8E23" },
  { name: "Chef Ramesh", avgTime: 30, color: "#FFD700" },
  { name: "Rajesh Kumar", avgTime: 20, color: "#FFA500" },
  { name: "Priya Sharma", avgTime: 28, color: "#6B8E23" },
  { name: "Amit Kumar", avgTime: 22, color: "#FFD700" },
];

const slaComplianceData = [
  { name: "Week 1", compliance: 92 },
  { name: "Week 2", compliance: 88 },
  { name: "Week 3", compliance: 95 },
  { name: "Week 4", compliance: 90 },
];

const departmentDistribution = [
  { name: "Housekeeping", value: 45, color: "#6B8E23" },
  { name: "Restaurant", value: 32, color: "#FFD700" },
  { name: "Travel Desk", value: 18, color: "#FFA500" },
];

export default function ReportsAnalytics() {
  const handleExport = (format: "pdf" | "excel" | "csv") => {
    // Simulate export
    console.log(`Exporting as ${format}...`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-playfair text-3xl font-bold text-[#2D2D2D] mb-2">
            Reports & Analytics
          </h1>
          <p className="text-gray-600 font-poppins">
            Track performance metrics and generate reports
          </p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="weekly">
            <SelectTrigger className="w-[140px]">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={() => handleExport("pdf")}
            className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#2D2D2D] hover:shadow-lg"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6 border-none shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#6B8E23] to-[#556B2F] rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-[#6B8E23]">95</span>
            </div>
            <h3 className="text-gray-600 font-poppins mb-1">Total Tasks</h3>
            <p className="text-sm text-gray-500">This week</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 border-none shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-[#FFD700]">91%</span>
            </div>
            <h3 className="text-gray-600 font-poppins mb-1">SLA Compliance</h3>
            <p className="text-sm text-gray-500">Average this month</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 border-none shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <PieChartIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-blue-600">24 min</span>
            </div>
            <h3 className="text-gray-600 font-poppins mb-1">Avg Completion</h3>
            <p className="text-sm text-gray-500">Time per task</p>
          </Card>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks by Department */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="p-6 border-none shadow-lg">
            <h2 className="font-playfair text-xl font-bold text-[#2D2D2D] mb-6">
              Tasks by Department
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={tasksByDepartment}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="tasks" fill="#6B8E23" radius={[8, 8, 0, 0]} />
                <Bar dataKey="completed" fill="#FFD700" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#6B8E23] rounded"></div>
                <span className="text-sm text-gray-600">Total Tasks</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#FFD700] rounded"></div>
                <span className="text-sm text-gray-600">Completed</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Department Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="p-6 border-none shadow-lg">
            <h2 className="font-playfair text-xl font-bold text-[#2D2D2D] mb-6">
              Department Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {departmentDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Average Completion Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 border-none shadow-lg">
            <h2 className="font-playfair text-xl font-bold text-[#2D2D2D] mb-6">
              Average Completion Time by Staff
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={completionTimeData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" stroke="#6b7280" />
                <YAxis dataKey="name" type="category" stroke="#6b7280" width={100} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="avgTime" radius={[0, 8, 8, 0]}>
                  {completionTimeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <p className="text-sm text-gray-500 text-center mt-4">Time in minutes</p>
          </Card>
        </motion.div>

        {/* SLA Compliance Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 border-none shadow-lg">
            <h2 className="font-playfair text-xl font-bold text-[#2D2D2D] mb-6">
              SLA Compliance Trend
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={slaComplianceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" domain={[80, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="compliance"
                  stroke="#6B8E23"
                  strokeWidth={3}
                  dot={{ fill: "#6B8E23", r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-sm text-gray-500 text-center mt-4">Compliance percentage (%)</p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

