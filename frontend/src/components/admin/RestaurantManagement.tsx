import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Search, Filter, ChefHat, Truck } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { toast } from "sonner";
import { adminApi } from "../../services/api";
import { useAppContext } from "../../context/AppContext";
import { Order, StaffMember } from "../../types";
import restaurantBanner from "../admin/imagess/res.png";
import { RESTAURANT_CHEFS, RESTAURANT_WAITERS } from "../../data/staffData";

interface RestaurantOrder {
  id: string;
  orderNumber: string;
  roomNumber: string;
  dishes: string[];
  assignedChef: string;
  assignedWaiter: string;
  status: "new" | "preparing" | "out_for_delivery" | "delivered";
  estimatedDelivery: string;
  total: number;
}

export default function RestaurantManagement() {
  const { subscribe } = useAppContext();
  const [orders, setOrders] = useState<RestaurantOrder[]>([]);
  const [chefs, setChefs] = useState<string[]>(RESTAURANT_CHEFS);
  const [waiters, setWaiters] = useState<string[]>(RESTAURANT_WAITERS);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<RestaurantOrder | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch orders and staff on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // TODO: Replace with actual API calls when backend is ready
        // const [ordersData, staffData] = await Promise.all([
        //   adminApi.getRestaurantOrders({ status: statusFilter, search: searchQuery }),
        //   adminApi.getStaffMembers({ department: "Restaurant" }),
        // ]);
        // setOrders(ordersData.map((order: Order) => ({
        //   id: order.id,
        //   orderNumber: order.orderNumber,
        //   roomNumber: order.roomNumber,
        //   dishes: order.items.map(item => item.name),
        //   assignedChef: order.assignedChef || "Unassigned",
        //   assignedWaiter: order.assignedWaiter || "Unassigned",
        //   status: order.status,
        //   estimatedDelivery: order.estimatedDelivery || "30 min",
        //   total: order.total,
        // })));
        // const restaurantStaff = staffData.filter((staff: StaffMember) => 
        //   staff.role.toLowerCase().includes("chef") || staff.role.toLowerCase().includes("waiter")
        // );
        // setChefs(restaurantStaff.filter((staff: StaffMember) => staff.role.toLowerCase().includes("chef")).map(s => s.name));
        // setWaiters(restaurantStaff.filter((staff: StaffMember) => staff.role.toLowerCase().includes("waiter")).map(s => s.name));
        
        // For testing: Use default staff (will be replaced by API)
        setOrders([]);
        // Staff is already initialized from RESTAURANT_CHEFS and RESTAURANT_WAITERS constants
        setChefs(RESTAURANT_CHEFS);
        setWaiters(RESTAURANT_WAITERS);
      } catch (err) {
        setError("Failed to load orders. Please try again later.");
        console.error("Error fetching data:", err);
        // Fallback to default staff on error
        setChefs(RESTAURANT_CHEFS);
        setWaiters(RESTAURANT_WAITERS);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [statusFilter, searchQuery]);

  // Helper function to process and add order
  const processOrderEvent = (event: any) => {
    console.log("🍽️ Admin Restaurant: Processing order event", event);
    if (!event.payload || !event.payload.orderId) {
      console.error("🍽️ Admin Restaurant: Invalid event payload", event);
      return;
    }

    const newOrderEntry = {
      id: event.payload.orderId,
      orderNumber: event.payload.orderNumber,
      roomNumber: event.payload.roomNumber,
      dishes: event.payload.items?.map((item: any) => item.name) || [],
      assignedChef: "Unassigned",
      assignedWaiter: "Unassigned",
      status: "new" as const,
      estimatedDelivery: "30 min",
      total: event.payload.total || 0,
    };
    
    console.log("🍽️ Admin Restaurant: Adding order to list", newOrderEntry);
    setOrders((prev) => {
      // Check if order already exists to avoid duplicates
      const exists = prev.some(o => o.id === newOrderEntry.id);
      if (exists) {
        console.log("🍽️ Admin Restaurant: Order already exists, skipping", newOrderEntry.id);
        return prev;
      }
      const updated = [newOrderEntry, ...prev];
      console.log("🍽️ Admin Restaurant: Updated orders list", updated);
      return updated;
    });
  };

  // Subscribe to real-time events with replay of recent events
  useEffect(() => {
    console.log("🍽️ Admin Restaurant: Setting up event subscription");
    const unsubscribe = subscribe(
      (event) => {
        console.log("🍽️ Admin Restaurant: Received event", event);
        if (event.type === "restaurant_order_created") {
          processOrderEvent(event);
        }
      },
      {
        replayRecent: true, // Replay recent events when component mounts
        eventTypes: ["restaurant_order_created"],
      }
    );

    return () => {
      console.log("🍽️ Admin Restaurant: Unsubscribing from events");
      unsubscribe();
    };
  }, [subscribe]);

  const handleAssignStaff = (order: RestaurantOrder) => {
    setSelectedOrder(order);
    setIsAssignModalOpen(true);
  };

  const handleSubmitAssignment = async (formData: any) => {
    if (selectedOrder) {
      try {
        // TODO: Replace with actual API call when backend is ready
        // await adminApi.assignRestaurantOrder(selectedOrder.id, {
        //   assignedChef: formData.chef,
        //   assignedWaiter: formData.waiter,
        //   status: formData.status,
        // });
        
        // For now, update local state
        setOrders(
          orders.map((o) =>
            o.id === selectedOrder.id
              ? {
                  ...o,
                  assignedChef: formData.chef,
                  assignedWaiter: formData.waiter,
                  status: formData.status,
                }
              : o
          )
        );
        toast.success("Staff assigned successfully");
        setIsAssignModalOpen(false);
        setSelectedOrder(null);
      } catch (err) {
        toast.error("Failed to assign staff. Please try again.");
        console.error("Error assigning staff:", err);
      }
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.roomNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      new: "bg-yellow-100 text-yellow-800",
      preparing: "bg-blue-100 text-blue-800",
      out_for_delivery: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
    };
    return variants[status as keyof typeof variants] || variants.new;
  };

  return (
    <div className="space-y-6">

      {/* ✅ Banner Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative h-64 sm:h-72 rounded-2xl overflow-hidden shadow-lg"
      >
        <img
          src={restaurantBanner}
          alt="Restaurant Banner"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#000000b3] to-[#00000080]" />
        <div className="absolute inset-0 flex flex-col justify-center items-start px-8 sm:px-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#FFD700] font-playfair drop-shadow-lg">
            Restaurant Management
          </h1>
          <p className="text-lg sm:text-xl text-white/90 mt-2 font-poppins">
            Manage dining orders, chefs, and waiters efficiently
          </p>
        </div>
      </motion.div>

{/* 🚀 Floating Capsule Filter Bar */}
<motion.div
  initial={{ opacity: 0, y: -15 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  className="relative"
>
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 bg-white/60 backdrop-blur-xl rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.08)] px-5 sm:px-8 py-3 sm:py-4 border border-[#FFD700]/30">

    {/* Search Box */}
    <div className="flex-1 min-w-[220px]">
      <Input
        placeholder="Search by order or room..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="h-10 sm:h-11 rounded-full border-none bg-gradient-to-r from-white/70 to-white/40 text-sm sm:text-base px-5 shadow-inner focus:ring-2 focus:ring-[#FFD700]/50 placeholder:text-gray-500 transition-all"
      />
    </div>

    {/* Filters Row */}
    <div className="flex flex-wrap items-center justify-start sm:justify-end gap-2 sm:gap-3">
      {/* Status Filter */}
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-[150px] sm:w-[180px] h-10 sm:h-11 rounded-full text-sm sm:text-base bg-gradient-to-r from-[#FFF5CC] to-[#FFE580] text-[#2D2D2D] border-none shadow-md hover:scale-[1.03] transition-all font-medium">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="new">New</SelectItem>
          <SelectItem value="preparing">Preparing</SelectItem>
          <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
          <SelectItem value="delivered">Delivered</SelectItem>
        </SelectContent>
      </Select>

      {/* Refresh Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-4 py-2 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#2D2D2D] text-sm font-semibold shadow-md hover:shadow-lg transition-all"
      >
        Refresh
      </motion.button>
    </div>
  </div>
</motion.div>


      {/* Table */}
      <Card className="border-none shadow-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading orders...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-[#FFD700]">Order #</TableHead>
                  <TableHead className="font-semibold text-[#FFD700]">Room</TableHead>
                  <TableHead className="font-semibold text-[#FFD700]">Dishes</TableHead>
                  <TableHead className="font-semibold text-[#FFD700]">Chef</TableHead>
                  <TableHead className="font-semibold text-[#FFD700]">Waiter</TableHead>
                  <TableHead className="font-semibold text-[#FFD700]">Status</TableHead>
                  <TableHead className="font-semibold text-[#FFD700]">Total</TableHead>
                  <TableHead className="font-semibold text-[#FFD700]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                <TableRow key={order.id} className="hover:bg-gray-50">
                  <TableCell className="font-semibold">#{order.orderNumber}</TableCell>
                  <TableCell>{order.roomNumber}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {order.dishes.map((dish, idx) => (
                        <span key={idx} className="text-sm">
                          {dish}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <ChefHat className="w-4 h-4 text-gray-400" />
                      {order.assignedChef}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-gray-400" />
                      {order.assignedWaiter}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge(order.status)}>
                      {order.status.replace("_", " ").toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold">₹{order.total}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleAssignStaff(order)}
                      variant="outline"
                      size="sm"
                      className="border-[#FFD700] text-[#FFA500] hover:bg-[#FFD700] hover:text-[#2D2D2D]"
                    >
                      Assign
                    </Button>
                  </TableCell>
                  </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      No orders found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* Dialog for staff assignment */}
      <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-playfair text-2xl text-[#2D2D2D]">
              Assign Staff to Order #{selectedOrder?.orderNumber || "N/A"}
            </DialogTitle>
          </DialogHeader>
          {selectedOrder ? (
            <AssignStaffForm
              order={selectedOrder}
              chefs={chefs}
              waiters={waiters}
              onSubmit={handleSubmitAssignment}
              onCancel={() => {
                setIsAssignModalOpen(false);
                setSelectedOrder(null);
              }}
            />
          ) : (
            <div className="p-8 text-center text-gray-500">
              <p>No order selected. Please try again.</p>
              <Button
                onClick={() => {
                  setIsAssignModalOpen(false);
                  setSelectedOrder(null);
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
  order,
  chefs,
  waiters,
  onSubmit,
  onCancel,
}: {
  order: RestaurantOrder;
  chefs: string[];
  waiters: string[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    chef: order.assignedChef === "Unassigned" ? "" : order.assignedChef,
    waiter: order.assignedWaiter === "Unassigned" ? "" : order.assignedWaiter,
    status: order.status,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label>Room Number</Label>
        <Input value={order.roomNumber} disabled />
      </div>

      <div className="space-y-2">
        <Label>Dishes</Label>
        <div className="p-3 bg-gray-50 rounded-lg">
          {order.dishes.map((dish, idx) => (
            <span key={idx} className="text-sm">
              {dish}
              {idx < order.dishes.length - 1 && ", "}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="chef">Assign Chef *</Label>
          {chefs.length > 0 ? (
            <Select value={formData.chef} onValueChange={(value) => setFormData({ ...formData, chef: value })}>
              <SelectTrigger id="chef">
                <SelectValue placeholder="Select chef" />
              </SelectTrigger>
              <SelectContent>
                {chefs.map((chef) => (
                  <SelectItem key={chef} value={chef}>
                    {chef}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="p-2 text-sm text-gray-500 border rounded-md">
              No chefs available
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="waiter">Assign Waiter *</Label>
          {waiters.length > 0 ? (
            <Select value={formData.waiter} onValueChange={(value) => setFormData({ ...formData, waiter: value })}>
              <SelectTrigger id="waiter">
                <SelectValue placeholder="Select waiter" />
              </SelectTrigger>
              <SelectContent>
                {waiters.map((waiter) => (
                  <SelectItem key={waiter} value={waiter}>
                    {waiter}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="p-2 text-sm text-gray-500 border rounded-md">
              No waiters available
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as any })}>
          <SelectTrigger id="status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="preparing">Preparing</SelectItem>
            <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#2D2D2D] hover:shadow-lg"
        >
          Assign Staff
        </Button>
      </DialogFooter>
    </form>
  );
}
