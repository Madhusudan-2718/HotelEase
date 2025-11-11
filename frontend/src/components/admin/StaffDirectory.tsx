import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Phone,
  Mail,
  Clock,
  Star,
  CheckCircle2,
  XCircle,
  Clock3,
} from "lucide-react";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { adminApi } from "../../services/api";
import { StaffMember } from "../../types";
import staffBanner from "../admin/imagess/staff.png";
import { ALL_STAFF_MEMBERS } from "../../data/staffData";

export default function StaffDirectory() {
  const [staff, setStaff] = useState<StaffMember[]>(ALL_STAFF_MEMBERS);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch staff on component mount
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // TODO: Replace with actual API call when backend is ready
        // const staffData = await adminApi.getStaffMembers({
        //   department: departmentFilter !== "all" ? departmentFilter : undefined,
        //   status: statusFilter !== "all" ? statusFilter : undefined,
        //   rating: ratingFilter !== "all" ? ratingFilter : undefined,
        //   search: searchQuery || undefined,
        // });
        // setStaff(staffData);
        
        // For now, use the centralized staff data (will be replaced by API)
        setStaff(ALL_STAFF_MEMBERS);
      } catch (err) {
        setError("Failed to load staff. Please try again later.");
        console.error("Error fetching staff:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [departmentFilter, statusFilter, ratingFilter, searchQuery]);

  const handleStaffClick = (member: StaffMember) => {
    setSelectedStaff(member);
    setIsProfileModalOpen(true);
  };

  const filteredStaff = staff.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment =
      departmentFilter === "all" || member.department === departmentFilter;
    const matchesStatus =
      statusFilter === "all" || member.status === statusFilter;
    const matchesRating =
      ratingFilter === "all" ||
      (ratingFilter === "high" && member.rating >= 4.5) ||
      (ratingFilter === "medium" &&
        member.rating >= 4.0 &&
        member.rating < 4.5) ||
      (ratingFilter === "low" && member.rating < 4.0);
    return matchesSearch && matchesDepartment && matchesStatus && matchesRating;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      available: { bg: "bg-green-100", text: "text-green-800", icon: CheckCircle2 },
      busy: { bg: "bg-yellow-100", text: "text-yellow-800", icon: Clock3 },
      off_duty: { bg: "bg-gray-100", text: "text-gray-800", icon: XCircle },
    };
    return variants[status as keyof typeof variants] || variants.available;
  };

  const getDepartmentColor = (department: string) => {
    const colors = {
      Housekeeping: "bg-[#6B8E23]",
      Restaurant: "bg-[#FFD700]",
      "Travel Desk": "bg-[#FFA500]",
    };
    return colors[department as keyof typeof colors] || "bg-gray-500";
  };

  return (
    <div className="space-y-6">
      {/* ✅ Banner Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative h-64 sm:h-72 rounded-2xl overflow-hidden shadow-lg"
      >
        <img
          src={staffBanner}
          alt="Staff Banner"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#000000b3] to-[#00000080]" />
        <div className="absolute inset-0 flex flex-col justify-center items-start px-8 sm:px-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#FFD700] font-playfair drop-shadow-lg">
            Staff Directory
          </h1>
          <p className="text-lg sm:text-xl text-white/90 mt-2 font-poppins">
            View and manage your hotel staff members efficiently
          </p>
        </div>
      </motion.div>

{/* 👔 Staff Directory Capsule Filter Bar */}
<motion.div
  initial={{ opacity: 0, y: -15 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  className="relative"
>
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 bg-white/70 backdrop-blur-xl rounded-full border border-[#FFD700]/30 shadow-[0_4px_20px_rgba(0,0,0,0.08)] px-5 sm:px-8 py-3 sm:py-4">

    {/* 🧑‍💼 Search Field */}
    <Input
      placeholder="Search staff by name or role..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="flex-1 min-w-[240px] h-10 sm:h-11 rounded-full border-none bg-gradient-to-r from-white/85 to-white/50 text-sm sm:text-base px-5 shadow-inner focus:ring-2 focus:ring-[#FFD700]/50 placeholder:text-gray-500 transition-all"
    />

    {/* ⚙️ Filter Controls */}
    <div className="flex flex-wrap items-center justify-start sm:justify-end gap-3">
      {/* Department Filter */}
      <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
        <SelectTrigger className="w-[150px] sm:w-[160px] h-10 sm:h-11 rounded-full text-sm sm:text-base bg-gradient-to-r from-[#FFF8DC] to-[#FFE580] text-[#2D2D2D] font-medium border-none shadow-md hover:scale-[1.03] focus:ring-2 focus:ring-[#FFD700]/50 transition-all">
          <SelectValue placeholder="Department" />
        </SelectTrigger>
        <SelectContent className="rounded-xl shadow-lg border border-[#FFD700]/20 bg-white/90 backdrop-blur-sm">
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="Housekeeping">Housekeeping</SelectItem>
          <SelectItem value="Restaurant">Restaurant</SelectItem>
          <SelectItem value="Travel Desk">Travel Desk</SelectItem>
        </SelectContent>
      </Select>

      {/* Status Filter */}
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-[130px] sm:w-[140px] h-10 sm:h-11 rounded-full text-sm sm:text-base bg-gradient-to-r from-[#FDF5CE] to-[#FFE580] text-[#2D2D2D] font-medium border-none shadow-md hover:scale-[1.03] focus:ring-2 focus:ring-[#FFD700]/50 transition-all">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent className="rounded-xl shadow-lg border border-[#FFD700]/20 bg-white/90 backdrop-blur-sm">
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="available">Available</SelectItem>
          <SelectItem value="busy">Busy</SelectItem>
          <SelectItem value="off_duty">Off Duty</SelectItem>
        </SelectContent>
      </Select>

      {/* Rating Filter */}
      <Select value={ratingFilter} onValueChange={setRatingFilter}>
        <SelectTrigger className="w-[130px] sm:w-[140px] h-10 sm:h-11 rounded-full text-sm sm:text-base bg-gradient-to-r from-[#FFF5CC] to-[#FFE580] text-[#2D2D2D] font-medium border-none shadow-md hover:scale-[1.03] focus:ring-2 focus:ring-[#FFD700]/50 transition-all">
          <SelectValue placeholder="Rating" />
        </SelectTrigger>
        <SelectContent className="rounded-xl shadow-lg border border-[#FFD700]/20 bg-white/90 backdrop-blur-sm">
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="high">High (4.5+)</SelectItem>
          <SelectItem value="medium">Medium (4.0–4.5)</SelectItem>
          <SelectItem value="low">Low (&lt;4.0)</SelectItem>
        </SelectContent>
      </Select>

      {/* ✨ Quick Action */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-5 py-2 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#2D2D2D] text-sm font-semibold shadow-md hover:shadow-lg transition-all"
      >
        Apply
      </motion.button>
    </div>
  </div>
</motion.div>


      {/* Staff Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading staff...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStaff.length > 0 ? (
            filteredStaff.map((member) => {
          const statusBadge = getStatusBadge(member.status);
          const StatusIcon = statusBadge.icon;
          return (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Card
                className="p-6 border-none shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => handleStaffClick(member)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarFallback
                        className={`${getDepartmentColor(
                          member.department
                        )} text-white text-xl font-bold`}
                      >
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-playfair text-xl font-bold text-[#2D2D2D]">
                        {member.name}
                      </h3>
                      <p className="text-sm text-gray-600 font-poppins">
                        {member.role}
                      </p>
                    </div>
                  </div>
                  <Badge
                    className={`${statusBadge.bg} ${statusBadge.text} flex items-center gap-1`}
                  >
                    <StatusIcon className="w-3 h-3" />
                    {member.status.replace("_", " ").toUpperCase()}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Department</span>
                    <Badge
                      className={`${getDepartmentColor(
                        member.department
                      )} text-white`}
                    >
                      {member.department}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-[#FFD700] text-[#FFD700]" />
                      <span className="font-semibold">{member.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Recent Tasks</span>
                    <span className="font-semibold text-[#6B8E23]">
                      {member.recentTasks}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{member.shiftTiming}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
            );
            })
          ) : (
            <div className="col-span-3 text-center py-12 text-gray-500">
              No staff members found
            </div>
          )}
        </div>
      )}

      {/* Staff Profile Modal */}
      <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-playfair text-2xl text-[#2D2D2D]">
              Staff Profile
            </DialogTitle>
          </DialogHeader>
          {selectedStaff && (
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarFallback
                    className={`${getDepartmentColor(
                      selectedStaff.department
                    )} text-white text-3xl font-bold`}
                  >
                    {selectedStaff.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-playfair text-2xl font-bold text-[#2D2D2D] mb-1">
                    {selectedStaff.name}
                  </h3>
                  <p className="text-gray-600 font-poppins mb-2">
                    {selectedStaff.role}
                  </p>
                  <Badge
                    className={`${getDepartmentColor(
                      selectedStaff.department
                    )} text-white`}
                  >
                    {selectedStaff.department}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <ContactInfo staff={selectedStaff} />
                </div>

                <div className="space-y-4">
                  <PerformanceInfo staff={selectedStaff} />
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Label({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`font-semibold text-[#2D2D2D] ${className}`}>
      {children}
    </label>
  );
}

function ContactInfo({ staff }: { staff: StaffMember }) {
  return (
    <>
      <div>
        <Label className="text-gray-600 text-sm">Contact Information</Label>
        <div className="mt-2 space-y-2">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-400" />
            <span className="text-sm">{staff.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-400" />
            <span className="text-sm">{staff.email}</span>
          </div>
        </div>
      </div>

      <div>
        <Label className="text-gray-600 text-sm">Shift Timing</Label>
        <div className="mt-2 flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-sm">{staff.shiftTiming}</span>
        </div>
      </div>
    </>
  );
}

function PerformanceInfo({ staff }: { staff: StaffMember }) {
  const statusBadge = {
    available: { bg: "bg-green-100", text: "text-green-800", icon: CheckCircle2 },
    busy: { bg: "bg-yellow-100", text: "text-yellow-800", icon: Clock3 },
    off_duty: { bg: "bg-gray-100", text: "text-gray-800", icon: XCircle },
  }[staff.status];
  const StatusIcon = statusBadge.icon;

  return (
    <>
      <div>
        <Label className="text-gray-600 text-sm">Performance</Label>
        <div className="mt-2 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Rating</span>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-[#FFD700] text-[#FFD700]" />
              <span className="font-semibold">{staff.rating}/5.0</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Tasks Completed</span>
            <span className="font-semibold text-[#6B8E23]">
              {staff.recentTasks} this week
            </span>
          </div>
        </div>
      </div>

      <div>
        <Label className="text-gray-600 text-sm">Status</Label>
        <div className="mt-2">
          <Badge
            className={`${statusBadge.bg} ${statusBadge.text} flex items-center gap-1 w-fit`}
          >
            <StatusIcon className="w-3 h-3" />
            {staff.status.replace("_", " ").toUpperCase()}
          </Badge>
        </div>
      </div>
    </>
  );
}
