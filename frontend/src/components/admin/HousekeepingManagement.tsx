import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Plus,
  Search,
  Filter,
  Clock,
  User,
} from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import { adminApi } from "../../services/api";
import { useAppContext } from "../../context/AppContext";
import { HousekeepingRequest, StaffMember } from "../../types";
import housekeepingBanner from "./imagess/housekeep.png";
import { HOUSEKEEPING_STAFF } from "../../data/staffData";

interface HousekeepingTask {
  id: string;
  roomNumber: string;
  taskType: string;
  assignedTo: string;
  status: "pending" | "in_progress" | "completed";
  notes: string;
  deadline: string;
  priority: "low" | "medium" | "high";
}

export default function HousekeepingManagement() {
  const { subscribe } = useAppContext();
  const [tasks, setTasks] = useState<HousekeepingTask[]>([]);
  const [staffMembers, setStaffMembers] = useState<string[]>(HOUSEKEEPING_STAFF);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<HousekeepingTask | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tasks and staff on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // TODO: Replace with actual API calls when backend is ready
        // const [tasksData, staffData] = await Promise.all([
        //   adminApi.getHousekeepingTasks({ status: statusFilter, search: searchQuery }),
        //   adminApi.getStaffMembers({ department: "Housekeeping" }),
        // ]);
        // setTasks(tasksData.map((task: HousekeepingRequest) => ({
        //   id: task.id,
        //   roomNumber: task.roomNumber,
        //   taskType: task.serviceType,
        //   assignedTo: task.assignedTo || "Unassigned",
        //   status: task.status,
        //   notes: task.notes || "",
        //   deadline: task.deadline || "",
        //   priority: task.priority,
        // })));
        // setStaffMembers(staffData.map((staff: StaffMember) => staff.name));
        
        // For testing: Use default staff (will be replaced by API)
        setTasks([]);
        // Staff is already initialized from HOUSEKEEPING_STAFF constant
        setStaffMembers(HOUSEKEEPING_STAFF);
      } catch (err) {
        setError("Failed to load tasks. Please try again later.");
        console.error("Error fetching data:", err);
        // Fallback to default staff on error
        setStaffMembers(HOUSEKEEPING_STAFF);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [statusFilter, searchQuery]);

  // Helper function to process and add task
  const processRequestEvent = (event: any) => {
    console.log("🧹 Admin Housekeeping: Processing request event", event);
    if (!event.payload || !event.payload.requestId) {
      console.error("🧹 Admin Housekeeping: Invalid event payload", event);
      return;
    }

    const newTask = {
      id: event.payload.requestId,
      roomNumber: event.payload.roomNumber,
      taskType: event.payload.serviceType,
      assignedTo: "Unassigned",
      status: "pending" as const,
      notes: event.payload.notes || "",
      deadline: "",
      priority: (event.payload.priority || "medium") as "low" | "medium" | "high",
    };
    
    console.log("🧹 Admin Housekeeping: Adding task to list", newTask);
    setTasks((prev) => {
      // Check if task already exists to avoid duplicates
      const exists = prev.some(t => t.id === newTask.id);
      if (exists) {
        console.log("🧹 Admin Housekeeping: Task already exists, skipping", newTask.id);
        return prev;
      }
      const updated = [newTask, ...prev];
      console.log("🧹 Admin Housekeeping: Updated tasks list", updated);
      return updated;
    });
  };

  // Subscribe to real-time events with replay of recent events
  useEffect(() => {
    console.log("🧹 Admin Housekeeping: Setting up event subscription");
    const unsubscribe = subscribe(
      (event) => {
        console.log("🧹 Admin Housekeeping: Received event", event);
        if (event.type === "housekeeping_request_created") {
          processRequestEvent(event);
        }
      },
      {
        replayRecent: true, // Replay recent events when component mounts
        eventTypes: ["housekeeping_request_created"],
      }
    );

    return () => {
      console.log("🧹 Admin Housekeeping: Unsubscribing from events");
      unsubscribe();
    };
  }, [subscribe]);

  const handleAssignStaff = (task: HousekeepingTask) => {
    setSelectedTask(task);
    setIsAssignModalOpen(true);
  };

  const handleSubmitAssignment = async (formData: any) => {
    if (selectedTask) {
      try {
        // TODO: Replace with actual API call when backend is ready
        // await adminApi.assignHousekeepingTask(selectedTask.id, {
        //   assignedTo: formData.staff,
        //   status: formData.status,
        //   priority: formData.priority,
        //   deadline: formData.deadline,
        //   notes: formData.notes,
        // });
        
        // For now, update local state
        setTasks(
          tasks.map((t) =>
            t.id === selectedTask.id
              ? {
                  ...t,
                  assignedTo: formData.staff,
                  status: formData.status,
                  notes: formData.notes || t.notes,
                  deadline: formData.deadline || t.deadline,
                  priority: formData.priority || t.priority,
                }
              : t
          )
        );
        toast.success(`Task assigned to ${formData.staff}`);
        setIsAssignModalOpen(false);
        setSelectedTask(null);
      } catch (err) {
        toast.error("Failed to assign task. Please try again.");
        console.error("Error assigning task:", err);
      }
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.taskType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-800",
      in_progress: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
    };
    return variants[status as keyof typeof variants] || variants.pending;
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      low: "bg-gray-100 text-gray-800",
      medium: "bg-orange-100 text-orange-800",
      high: "bg-red-100 text-red-800",
    };
    return variants[priority as keyof typeof variants] || variants.low;
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
    src={housekeepingBanner}
    alt="Housekeeping Banner"
    className="absolute inset-0 w-full h-full object-cover"
  />
  {/* Gradient Overlay for readability */}
  <div className="absolute inset-0 bg-gradient-to-r from-[#000000b3] to-[#00000080]" />
  
  {/* Text Content */}
  <div className="absolute inset-0 flex flex-col justify-center items-start px-8 sm:px-16">
    <h1 className="text-4xl sm:text-5xl font-bold text-[#FFD700] font-playfair drop-shadow-lg">
      Housekeeping Dashboard
    </h1>
    <p className="text-lg sm:text-xl text-white/90 mt-2 font-poppins">
      Keep your hotel spotless and your guests smiling
    </p>
  </div>
</motion.div>


{/* 🧹 Housekeeping Capsule Filter Bar */}
<motion.div
  initial={{ opacity: 0, y: -15 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  className="relative"
>
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 bg-white/60 backdrop-blur-xl rounded-full border border-[#6B8E23]/30 shadow-[0_4px_20px_rgba(107,142,35,0.15)] px-5 sm:px-8 py-3 sm:py-4">

    {/* 🔍 Search Box */}
    <Input
      placeholder="Search by room, task type, or staff..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="flex-1 min-w-[220px] h-10 sm:h-11 rounded-full border-none bg-gradient-to-r from-white/80 to-white/50 text-sm sm:text-base px-5 shadow-inner focus:ring-2 focus:ring-[#6B8E23]/50 focus:border-none placeholder:text-gray-500 transition-all"
    />

    {/* 🧭 Status Filter */}
    <div className="flex flex-wrap items-center justify-start sm:justify-end gap-3">
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-[160px] sm:w-[180px] h-10 sm:h-11 rounded-full text-sm sm:text-base bg-gradient-to-r from-[#C1DC7D] to-[#A8C45A] text-[#2D2D2D] font-medium border-none shadow-md hover:scale-[1.03] focus:ring-2 focus:ring-[#6B8E23]/50 transition-all">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent className="rounded-xl shadow-lg border border-[#6B8E23]/20 bg-white/90 backdrop-blur-sm">
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="in_progress">In Progress</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
        </SelectContent>
      </Select>

      {/* ✅ Quick Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-5 py-2 rounded-full bg-gradient-to-r from-[#6B8E23] to-[#8FBC8F] text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all"
      >
        Refresh
      </motion.button>
    </div>
  </div>
</motion.div>


      {/* Tasks Table */}
      <Card className="border-none shadow-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading tasks...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-[#6B8E23]">Room No</TableHead>
                  <TableHead className="font-semibold text-[#6B8E23]">Task Type</TableHead>
                  <TableHead className="font-semibold text-[#6B8E23]">Assigned To</TableHead>
                  <TableHead className="font-semibold text-[#6B8E23]">Status</TableHead>
                  <TableHead className="font-semibold text-[#6B8E23]">Priority</TableHead>
                  <TableHead className="font-semibold text-[#6B8E23]">Deadline</TableHead>
                  <TableHead className="font-semibold text-[#6B8E23]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                <TableRow key={task.id} className="hover:bg-gray-50">
                  <TableCell className="font-semibold">{task.roomNumber}</TableCell>
                  <TableCell>{task.taskType}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      {task.assignedTo}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge(task.status)}>
                      {task.status.replace("_", " ").toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityBadge(task.priority)}>
                      {task.priority.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-gray-400" />
                      {task.deadline || "Not set"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleAssignStaff(task)}
                      variant="outline"
                      size="sm"
                      className="border-[#6B8E23] text-[#6B8E23] hover:bg-[#6B8E23] hover:text-white"
                    >
                      {task.assignedTo === "Unassigned" ? "Assign" : "Reassign"}
                    </Button>
                  </TableCell>
                  </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No tasks found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* Assign Staff Modal */}
      <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-playfair text-2xl text-[#2D2D2D]">
              {selectedTask?.assignedTo === "Unassigned"
                ? "Assign Staff"
                : "Reassign Staff"}
            </DialogTitle>
          </DialogHeader>
          {selectedTask ? (
            <AssignStaffForm
              task={selectedTask}
              staffMembers={staffMembers}
              onSubmit={handleSubmitAssignment}
              onCancel={() => {
                setIsAssignModalOpen(false);
                setSelectedTask(null);
              }}
            />
          ) : (
            <div className="p-8 text-center text-gray-500">
              <p>No task selected. Please try again.</p>
              <Button
                onClick={() => {
                  setIsAssignModalOpen(false);
                  setSelectedTask(null);
                }}
                className="mt-4"
                variant="outline"
              >
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AssignStaffForm({
  task,
  staffMembers,
  onSubmit,
  onCancel,
}: {
  task: HousekeepingTask;
  staffMembers: string[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    staff: task.assignedTo === "Unassigned" ? "" : task.assignedTo,
    status: task.status,
    notes: task.notes,
    deadline: task.deadline,
    priority: task.priority,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.staff) {
      toast.error("Please select a staff member");
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="room">Room Number</Label>
        <Input id="room" value={task.roomNumber} disabled />
      </div>

      <div className="space-y-2">
        <Label htmlFor="taskType">Task Type</Label>
        <Input id="taskType" value={task.taskType} disabled />
      </div>

      <div className="space-y-2">
        <Label htmlFor="staff">Assign Staff *</Label>
        {staffMembers.length > 0 ? (
          <Select
            value={formData.staff}
            onValueChange={(value) => setFormData({ ...formData, staff: value })}
          >
            <SelectTrigger id="staff">
              <SelectValue placeholder="Select staff member" />
            </SelectTrigger>
            <SelectContent>
              {staffMembers.map((staff) => (
                <SelectItem key={staff} value={staff}>
                  {staff}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <div className="p-2 text-sm text-gray-500 border rounded-md">
            No staff members available
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) =>
              setFormData({ ...formData, status: value as any })
            }
          >
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select
            value={formData.priority}
            onValueChange={(value) =>
              setFormData({ ...formData, priority: value as any })
            }
          >
            <SelectTrigger id="priority">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="deadline">Deadline</Label>
        <Input
          id="deadline"
          type="datetime-local"
          value={formData.deadline}
          onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Special Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) =>
            setFormData({ ...formData, notes: e.target.value })
          }
          placeholder="Add any special instructions or notes..."
          rows={4}
        />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#2D2D2D] hover:shadow-lg"
        >
          {task.assignedTo === "Unassigned"
            ? "Assign Task"
            : "Update Assignment"}
        </Button>
      </DialogFooter>
    </form>
  );
}
