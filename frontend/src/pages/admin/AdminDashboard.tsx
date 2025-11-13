import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  LayoutDashboard,
  Sparkles,
  UtensilsCrossed,
  Plane,
  Users,
  LogOut,
  Bell,
  Menu,
  X,
  User,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import DashboardOverview from "../../components/admin/DashboardOverview";
import HousekeepingManagement from "../../components/admin/HousekeepingManagement";
import RestaurantManagement from "../../components/admin/RestaurantManagement";
import TravelDeskManagement from "../../components/admin/TravelDeskManagement";
import StaffDirectory from "../../components/admin/StaffDirectory";
import AdminSettings from "../../components/admin/AdminSettings";


type AdminPage = "overview" | "housekeeping" | "restaurant" | "travel" | "staff" | "settings";

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [currentPage, setCurrentPage] = useState<AdminPage>("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsHeaderVisible(false); // hide when scrolling down
      } else {
        setIsHeaderVisible(true); // show when scrolling up
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const menuItems = [
    { id: "overview" as AdminPage, label: "Dashboard Overview", icon: LayoutDashboard },
    { id: "housekeeping" as AdminPage, label: "Housekeeping Tasks", icon: Sparkles },
    { id: "restaurant" as AdminPage, label: "Restaurant Tasks", icon: UtensilsCrossed },
    { id: "travel" as AdminPage, label: "Travel Desk Requests", icon: Plane },
    { id: "staff" as AdminPage, label: "Staff Directory", icon: Users },
    { id: "settings" as AdminPage, label: "Profile & Settings", icon: User },

  ];

  const renderPage = () => {
    switch (currentPage) {
      case "overview":
        return <DashboardOverview />;
      case "housekeeping":
        return <HousekeepingManagement />;
      case "restaurant":
        return <RestaurantManagement />;
      case "travel":
        return <TravelDeskManagement />;
      case "staff":
        return <StaffDirectory />;
      case "settings":
        return <AdminSettings />;

      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isSidebarOpen ? 0 : -300 }}
        transition={{ duration: 0.3 }}
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-[#6B8E23] to-[#556B2F] shadow-2xl ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-playfair text-white text-xl font-bold">HotelEase</h2>
                <p className="text-white/70 text-xs font-poppins">Admin Panel</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#2D2D2D] shadow-lg"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-poppins font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-poppins font-medium">Logout</span>
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Animated Header */}
        <motion.header
          initial={{ y: 0, opacity: 1 }}
          animate={{ y: isHeaderVisible ? 0 : -100, opacity: isHeaderVisible ? 1 : 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30"
        >
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {isSidebarOpen ? (
                  <X className="w-6 h-6 text-[#6B8E23]" />
                ) : (
                  <Menu className="w-6 h-6 text-[#6B8E23]" />
                )}
              </button>

              {/* Search Bar
              <div className="flex-1 max-w-md mx-4">
                <Input
                  type="text"
                  placeholder="Search staff, room number, or task..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-11 bg-gray-50 border-2 border-gray-200 rounded-xl text-[#2D2D2D] placeholder:text-gray-400 focus:border-[#6B8E23] focus:ring-2 focus:ring-[#6B8E23]/20 focus:bg-white transition-all duration-200 shadow-sm hover:shadow-md hover:border-gray-300 font-medium"
                />
              </div> */}

              {/* Right Side Actions */}
              <div className="flex items-center gap-4">
                {/* Notifications */}
                <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <Bell className="w-6 h-6 text-gray-600" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#FFD700] rounded-full"></span>
                </button>

                {/* User Profile
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-gradient-to-br from-[#FFD700] to-[#FFA500] text-[#2D2D2D] font-semibold">
                          AM
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden sm:block text-left">
                        <p className="text-sm font-semibold text-[#2D2D2D]">Admin Manager</p>
                        <p className="text-xs text-gray-500">admin@hotelease.com</p>
                      </div>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                    <DropdownMenuItem>Account Settings</DropdownMenuItem>
                    <DropdownMenuItem onClick={onLogout}>Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu> */}
              </div>
            </div>
          </div>
        </motion.header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">{renderPage()}</main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
