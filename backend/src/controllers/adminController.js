import prisma from "../prismaClient.js";

// 📊 Dashboard Statistics
export const getDashboardStats = async (req, res) => {
  try {
    const [
      activeStaffCount,
      pendingOrders,
      pendingRequests,
      pendingBookings,
      completedTodayOrders,
      completedTodayRequests,
      completedTodayBookings,
      ongoingOrders,
      ongoingRequests,
      ongoingBookings,
    ] = await Promise.all([
      prisma.staff.count({ where: { availability: true } }),
      prisma.restaurantOrder.count({ where: { status: "pending" } }),
      prisma.housekeepingRequest.count({ where: { status: "pending" } }),
      prisma.travelBooking.count({ where: { status: "pending" } }),
      prisma.restaurantOrder.count({
        where: {
          status: "delivered",
          createdAt: { gte: new Date(new Date().setUTCHours(0, 0, 0, 0)) },
        },
      }),
      prisma.housekeepingRequest.count({
        where: {
          status: "completed",
          updatedAt: { gte: new Date(new Date().setUTCHours(0, 0, 0, 0)) },
        },
      }),
      prisma.travelBooking.count({
        where: {
          status: "completed",
          updatedAt: { gte: new Date(new Date().setUTCHours(0, 0, 0, 0)) },
        },
      }),
      prisma.restaurantOrder.count({
        where: { status: { in: ["preparing", "out_for_delivery"] } },
      }),
      prisma.housekeepingRequest.count({
        where: { status: { in: ["assigned", "in_progress"] } },
      }),
      prisma.travelBooking.count({
        where: { status: { in: ["confirmed", "driver_assigned", "ongoing"] } },
      }),
    ]);

    const stats = {
      activeStaff: activeStaffCount,
      pendingTasks: pendingOrders + pendingRequests + pendingBookings,
      completedToday:
        completedTodayOrders + completedTodayRequests + completedTodayBookings,
      ongoingRequests:
        ongoingOrders + ongoingRequests + ongoingBookings,
    };

    res.json({ data: stats });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ error: "Failed to fetch dashboard statistics" });
  }
};

// 🏢 Department Task Counts
export const getDepartmentTasks = async (req, res) => {
  try {
    const [restaurantTasks, housekeepingTasks, travelTasks] = await Promise.all([
      prisma.restaurantOrder.count({ where: { status: { not: "delivered" } } }),
      prisma.housekeepingRequest.count({ where: { status: { not: "completed" } } }),
      prisma.travelBooking.count({ where: { status: { not: "completed" } } }),
    ]);

    res.json({
      data: [
        { name: "Restaurant", tasks: restaurantTasks, color: "#FF6B6B" },
        { name: "Housekeeping", tasks: housekeepingTasks, color: "#6B8E23" },
        { name: "Travel Desk", tasks: travelTasks, color: "#4ECDC4" },
      ],
    });
  } catch (error) {
    console.error("Error fetching department tasks:", error);
    res.status(500).json({ error: "Failed to fetch department tasks" });
  }
};

// 🧠 Department Status
export const getDepartmentStatus = async (req, res) => {
  try {
    const [
      restaurantBusy,
      restaurantAvailable,
      housekeepingBusy,
      housekeepingAvailable,
      travelBusy,
      travelAvailable,
    ] = await Promise.all([
      prisma.staff.count({ where: { department: "restaurant", availability: false } }),
      prisma.staff.count({ where: { department: "restaurant", availability: true } }),
      prisma.staff.count({ where: { department: "housekeeping", availability: false } }),
      prisma.staff.count({ where: { department: "housekeeping", availability: true } }),
      prisma.staff.count({ where: { department: "travel", availability: false } }),
      prisma.staff.count({ where: { department: "travel", availability: true } }),
    ]);

    res.json({
      data: [
        { name: "Restaurant", busy: restaurantBusy, available: restaurantAvailable },
        { name: "Housekeeping", busy: housekeepingBusy, available: housekeepingAvailable },
        { name: "Travel Desk", busy: travelBusy, available: travelAvailable },
      ],
    });
  } catch (error) {
    console.error("Error fetching department status:", error);
    res.status(500).json({ error: "Failed to fetch department status" });
  }
};

// 🔄 Recent Updates
export const getRecentUpdates = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const [orders, requests, bookings] = await Promise.all([
      prisma.restaurantOrder.findMany({ take: limit, orderBy: { createdAt: "desc" }, include: { user: true } }),
      prisma.housekeepingRequest.findMany({ take: limit, orderBy: { createdAt: "desc" }, include: { user: true } }),
      prisma.travelBooking.findMany({ take: limit, orderBy: { createdAt: "desc" }, include: { user: true } }),
    ]);

    const updates = [
      ...orders.map((o) => ({
        id: o.id,
        department: "Restaurant",
        message: `Order #${o.orderNumber} from Room ${o.roomNumber}`,
        status: o.status,
        createdAt: o.createdAt,
      })),
      ...requests.map((r) => ({
        id: r.id,
        department: "Housekeeping",
        message: `${r.requestType} request from Room ${r.roomNumber}`,
        status: r.status,
        createdAt: r.createdAt,
      })),
      ...bookings.map((b) => ({
        id: b.id,
        department: "Travel Desk",
        message: `Booking #${b.bookingId} from Room ${b.roomNumber}`,
        status: b.status,
        createdAt: b.createdAt,
      })),
    ]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);

    res.json({ data: updates });
  } catch (error) {
    console.error("Error fetching recent updates:", error);
    res.status(500).json({ error: "Failed to fetch recent updates" });
  }
};

// 🧹 Housekeeping Tasks
export const getHousekeepingTasks = async (req, res) => {
  try {
    const tasks = await prisma.housekeepingRequest.findMany({
      include: { user: true, assignedStaff: true },
      orderBy: { createdAt: "desc" },
    });
    res.json({ data: tasks });
  } catch (error) {
    console.error("Error fetching housekeeping tasks:", error);
    res.status(500).json({ error: "Failed to fetch housekeeping tasks" });
  }
};

// 🍽️ Restaurant Orders
export const getRestaurantOrders = async (req, res) => {
  try {
    const orders = await prisma.restaurantOrder.findMany({
      include: { user: true, assignedStaff: true },
      orderBy: { createdAt: "desc" },
    });
    res.json({ data: orders });
  } catch (error) {
    console.error("Error fetching restaurant orders:", error);
    res.status(500).json({ error: "Failed to fetch restaurant orders" });
  }
};

// 🚗 Travel Bookings
export const getTravelBookings = async (req, res) => {
  try {
    const bookings = await prisma.travelBooking.findMany({
      include: { user: true, assignedStaff: true },
      orderBy: { createdAt: "desc" },
    });
    res.json({ data: bookings });
  } catch (error) {
    console.error("Error fetching travel bookings:", error);
    res.status(500).json({ error: "Failed to fetch travel bookings" });
  }
};

// 🔔 Notifications
export const getNotifications = async (req, res) => {
  try {
    const notifications = await prisma.adminNotification.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json({ data: notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await prisma.adminNotification.update({
      where: { id },
      data: { isRead: true },
    });
    res.json({ data: updated, message: "Notification marked as read" });
  } catch (error) {
    console.error("Error marking notification read:", error);
    res.status(500).json({ error: "Failed to update notification" });
  }
};
