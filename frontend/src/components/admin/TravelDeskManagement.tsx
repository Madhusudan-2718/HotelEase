import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Search, Filter, Car, MapPin, User } from "lucide-react";
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
import { TravelBooking, StaffMember } from "../../types";
import travelDeskBanner from "./imagess/traveldesk.png";
import { TRAVEL_DRIVERS, TRAVEL_VEHICLES, Driver } from "../../data/staffData";

interface TravelBookingAdmin {
  id: string;
  bookingId: string;
  guestName: string;
  tripType: string;
  pickup: string;
  drop: string;
  assignedDriver: string;
  vehicle: string;
  status: "new" | "confirmed" | "driver_assigned" | "ongoing" | "completed";
  date: string;
  time: string;
  price: number;
}

export default function TravelDeskManagement() {
  const { subscribe } = useAppContext();
  const [bookings, setBookings] = useState<TravelBookingAdmin[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>(TRAVEL_DRIVERS);
  const [vehicles, setVehicles] = useState<string[]>(TRAVEL_VEHICLES);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<TravelBookingAdmin | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch bookings and drivers on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // TODO: Replace with actual API calls when backend is ready
        // const [bookingsData, staffData] = await Promise.all([
        //   adminApi.getTravelBookings({ status: statusFilter, search: searchQuery }),
        //   adminApi.getStaffMembers({ department: "Travel Desk" }),
        // ]);
        // setBookings(bookingsData.map((booking: TravelBooking) => ({
        //   id: booking.id,
        //   bookingId: booking.bookingId,
        //   guestName: booking.guestName || `Room ${booking.roomNumber}`,
        //   tripType: booking.serviceType,
        //   pickup: booking.pickupLocation,
        //   drop: booking.dropLocation,
        //   assignedDriver: booking.assignedDriver || "Unassigned",
        //   vehicle: booking.vehicle || "Not Assigned",
        //   status: booking.status,
        //   date: booking.date,
        //   time: booking.time,
        //   price: booking.price,
        // })));
        // setDrivers(staffData.map((staff: StaffMember) => ({
        //   name: staff.name,
        //   phone: staff.phone,
        //   available: staff.status === "available",
        // })));
        // setVehicles(["DL 01 AB 1234", "DL 01 CD 5678", "DL 01 EF 9012", "DL 01 GH 3456"]); // This would come from API
        
        // For testing: Use default drivers and vehicles (will be replaced by API)
        setBookings([]);
        // Staff is already initialized from TRAVEL_DRIVERS and TRAVEL_VEHICLES constants
        setDrivers(TRAVEL_DRIVERS);
        setVehicles(TRAVEL_VEHICLES);
      } catch (err) {
        setError("Failed to load bookings. Please try again later.");
        console.error("Error fetching data:", err);
        // Fallback to default data on error
        setDrivers(TRAVEL_DRIVERS);
        setVehicles(TRAVEL_VEHICLES);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [statusFilter, searchQuery]);

  // Helper function to process and add booking
  const processBookingEvent = (event: any) => {
    console.log("✈️ Admin Travel Desk: Processing booking event", event);
    if (!event.payload || !event.payload.bookingId) {
      console.error("✈️ Admin Travel Desk: Invalid event payload", event);
      return;
    }

    const newBookingEntry = {
      id: event.payload.bookingId || Date.now().toString(),
      bookingId: event.payload.bookingId,
      guestName: `Room ${event.payload.roomNumber}`,
      tripType: event.payload.serviceType,
      pickup: event.payload.pickupLocation,
      drop: event.payload.dropLocation,
      assignedDriver: "Unassigned",
      vehicle: "Not Assigned",
      status: "new" as const,
      date: event.timestamp ? new Date(event.timestamp).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
      time: event.timestamp ? new Date(event.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      price: event.payload.price || 0,
    };
    
    console.log("✈️ Admin Travel Desk: Adding booking to list", newBookingEntry);
    setBookings((prev) => {
      // Check if booking already exists to avoid duplicates
      const exists = prev.some(b => b.bookingId === newBookingEntry.bookingId);
      if (exists) {
        console.log("✈️ Admin Travel Desk: Booking already exists, skipping", newBookingEntry.bookingId);
        return prev;
      }
      const updated = [newBookingEntry, ...prev];
      console.log("✈️ Admin Travel Desk: Updated bookings list", updated);
      return updated;
    });
  };

  // Subscribe to real-time events with replay of recent events
  useEffect(() => {
    console.log("✈️ Admin Travel Desk: Setting up event subscription");
    const unsubscribe = subscribe(
      (event) => {
        console.log("✈️ Admin Travel Desk: Received event", event);
        if (event.type === "travel_booking_created") {
          processBookingEvent(event);
        }
      },
      {
        replayRecent: true, // Replay recent events when component mounts
        eventTypes: ["travel_booking_created"],
      }
    );

    return () => {
      console.log("✈️ Admin Travel Desk: Unsubscribing from events");
      unsubscribe();
    };
  }, [subscribe]);

  const handleAssignDriver = (booking: TravelBookingAdmin) => {
    setSelectedBooking(booking);
    setIsAssignModalOpen(true);
  };

  const handleSubmitAssignment = async (formData: any) => {
    if (selectedBooking) {
      try {
        // TODO: Replace with actual API call when backend is ready
        // await adminApi.assignTravelBooking(selectedBooking.id, {
        //   assignedDriver: formData.driver,
        //   vehicle: formData.vehicle,
        //   status: formData.status,
        //   remarks: formData.remarks,
        // });
        
        // For now, update local state
        setBookings(
          bookings.map((b) =>
            b.id === selectedBooking.id
              ? {
                  ...b,
                  assignedDriver: formData.driver,
                  vehicle: formData.vehicle,
                  status: formData.status,
                }
              : b
          )
        );
        toast.success(`Driver ${formData.driver} assigned successfully`);
        setIsAssignModalOpen(false);
        setSelectedBooking(null);
      } catch (err) {
        toast.error("Failed to assign driver. Please try again.");
        console.error("Error assigning driver:", err);
      }
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.tripType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      new: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      driver_assigned: "bg-purple-100 text-purple-800",
      ongoing: "bg-orange-100 text-orange-800",
      completed: "bg-green-100 text-green-800",
    };
    return variants[status as keyof typeof variants] || variants.new;
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
    src={travelDeskBanner}
    alt="Travel Desk Banner"
    className="absolute inset-0 w-full h-full object-cover"
  />
  {/* Gradient Overlay for consistency */}
  <div className="absolute inset-0 bg-gradient-to-r from-[#000000b3] to-[#00000080]" />

  {/* Banner Text */}
  <div className="absolute inset-0 flex flex-col justify-center items-start px-8 sm:px-16">
    <h1 className="text-4xl sm:text-5xl font-bold text-[#FFD700] font-playfair drop-shadow-lg">
      Travel Desk Dashboard
    </h1>
    <p className="text-lg sm:text-xl text-white/90 mt-2 font-poppins">
      Manage guest travel requests and driver assignments
    </p>
  </div>
</motion.div>

{/* 🚗 Travel Desk Capsule Filter Bar */}
<motion.div
  initial={{ opacity: 0, y: -15 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  className="relative"
>
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 bg-white/60 backdrop-blur-xl rounded-full border border-[#FFA500]/30 shadow-[0_4px_20px_rgba(255,165,0,0.15)] px-5 sm:px-8 py-3 sm:py-4">

    {/* 🔍 Search Field */}
    <Input
      placeholder="Search bookings, guests, or trips..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="flex-1 min-w-[220px] h-10 sm:h-11 rounded-full border-none bg-gradient-to-r from-white/85 to-white/50 text-sm sm:text-base px-5 shadow-inner focus:ring-2 focus:ring-[#FFA500]/50 placeholder:text-gray-500 transition-all"
    />

    {/* 🧭 Filter Controls */}
    <div className="flex flex-wrap items-center justify-start sm:justify-end gap-3">
      {/* Status Filter */}
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-[160px] sm:w-[180px] h-10 sm:h-11 rounded-full text-sm sm:text-base bg-gradient-to-r from-[#FFE580] to-[#FFC04D] text-[#2D2D2D] font-medium border-none shadow-md hover:scale-[1.03] focus:ring-2 focus:ring-[#FFA500]/50 transition-all">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent className="rounded-xl shadow-lg border border-[#FFA500]/20 bg-white/90 backdrop-blur-sm">
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="new">New</SelectItem>
          <SelectItem value="confirmed">Confirmed</SelectItem>
          <SelectItem value="driver_assigned">Driver Assigned</SelectItem>
          <SelectItem value="ongoing">Ongoing</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
        </SelectContent>
      </Select>

      {/* ✨ Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-5 py-2 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#2D2D2D] text-sm font-semibold shadow-md hover:shadow-lg transition-all"
      >
        Refresh
      </motion.button>
    </div>
  </div>
</motion.div>



      {/* Bookings Table */}
      <Card className="border-none shadow-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading bookings...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-[#FFA500]">
                    Booking ID
                  </TableHead>
                  <TableHead className="font-semibold text-[#FFA500]">
                    Guest Name
                  </TableHead>
                  <TableHead className="font-semibold text-[#FFA500]">
                    Trip Type
                  </TableHead>
                  <TableHead className="font-semibold text-[#FFA500]">
                    Pickup → Drop
                  </TableHead>
                  <TableHead className="font-semibold text-[#FFA500]">
                    Driver
                  </TableHead>
                  <TableHead className="font-semibold text-[#FFA500]">
                    Vehicle
                  </TableHead>
                  <TableHead className="font-semibold text-[#FFA500]">
                    Status
                  </TableHead>
                  <TableHead className="font-semibold text-[#FFA500]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((booking) => (
                <TableRow key={booking.id} className="hover:bg-gray-50">
                  <TableCell className="font-semibold">
                    {booking.bookingId}
                  </TableCell>
                  <TableCell>{booking.guestName}</TableCell>
                  <TableCell>{booking.tripType}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 text-sm">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-green-600" />
                        <span>{booking.pickup}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-red-600" />
                        <span>{booking.drop}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      {booking.assignedDriver}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Car className="w-4 h-4 text-gray-400" />
                      {booking.vehicle}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge(booking.status)}>
                      {booking.status.replace("_", " ").toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleAssignDriver(booking)}
                      variant="outline"
                      size="sm"
                      className="border-[#FFA500] text-[#FFA500] hover:bg-[#FFA500] hover:text-white"
                    >
                      {booking.assignedDriver === "Unassigned"
                        ? "Assign"
                        : "Modify"}
                    </Button>
                  </TableCell>
                  </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      No bookings found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* Assign Modal */}
      <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-playfair text-2xl text-[#2D2D2D]">
              Assign Driver to {selectedBooking?.bookingId || "N/A"}
            </DialogTitle>
          </DialogHeader>
          {selectedBooking ? (
            <AssignDriverForm
              booking={selectedBooking}
              drivers={drivers}
              vehicles={vehicles}
              onSubmit={handleSubmitAssignment}
              onCancel={() => {
                setIsAssignModalOpen(false);
                setSelectedBooking(null);
              }}
            />
          ) : (
            <div className="p-8 text-center text-gray-500">
              <p>No booking selected. Please try again.</p>
              <Button
                onClick={() => {
                  setIsAssignModalOpen(false);
                  setSelectedBooking(null);
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

function AssignDriverForm({
  booking,
  drivers,
  vehicles,
  onSubmit,
  onCancel,
}: {
  booking: TravelBookingAdmin;
  drivers: Driver[];
  vehicles: string[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    driver: booking.assignedDriver === "Unassigned" ? "" : booking.assignedDriver,
    vehicle: booking.vehicle === "Not Assigned" ? "" : booking.vehicle,
    status: booking.status,
    remarks: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.driver || !formData.vehicle) {
      toast.error("Please select both driver and vehicle");
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Guest Name</Label>
          <Input value={booking.guestName} disabled />
        </div>
        <div className="space-y-2">
          <Label>Trip Type</Label>
          <Input value={booking.tripType} disabled />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Route</Label>
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-green-600" />
            <span>{booking.pickup}</span>
          </div>
          <div className="flex items-center gap-2 text-sm mt-2">
            <MapPin className="w-4 h-4 text-red-600" />
            <span>{booking.drop}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="driver">Assign Driver *</Label>
          {drivers.length > 0 ? (
            <Select
              value={formData.driver}
              onValueChange={(value) => setFormData({ ...formData, driver: value })}
            >
              <SelectTrigger id="driver">
                <SelectValue placeholder="Select driver" />
              </SelectTrigger>
              <SelectContent>
                {drivers.map((driver) => (
                  <SelectItem
                    key={driver.name}
                    value={driver.name}
                    disabled={!driver.available}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>{driver.name}</span>
                      {driver.available ? (
                        <span className="text-green-600 text-xs ml-2">
                          Available
                        </span>
                      ) : (
                        <span className="text-red-600 text-xs ml-2">Busy</span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="p-2 text-sm text-gray-500 border rounded-md">
              No drivers available
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="vehicle">Assign Vehicle *</Label>
          {vehicles.length > 0 ? (
            <Select
              value={formData.vehicle}
              onValueChange={(value) => setFormData({ ...formData, vehicle: value })}
            >
              <SelectTrigger id="vehicle">
                <SelectValue placeholder="Select vehicle" />
              </SelectTrigger>
              <SelectContent>
                {vehicles.map((vehicle) => (
                  <SelectItem key={vehicle} value={vehicle}>
                    {vehicle}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="p-2 text-sm text-gray-500 border rounded-md">
              No vehicles available
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={formData.status}
          onValueChange={(value) => setFormData({ ...formData, status: value as any })}
        >
          <SelectTrigger id="status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="driver_assigned">Driver Assigned</SelectItem>
            <SelectItem value="ongoing">Ongoing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="remarks">Remarks (Optional)</Label>
        <Textarea
          id="remarks"
          value={formData.remarks}
          onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
          placeholder="Add any special notes or instructions..."
          rows={3}
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
          Assign Driver
        </Button>
      </DialogFooter>
    </form>
  );
}
