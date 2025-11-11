import express from "express";
import {
  getDashboardStats,
  getDepartmentTasks,
  getRecentUpdates,
  getDepartmentStatus,
  getHousekeepingTasks,
  getRestaurantOrders,
  getTravelBookings,
  getNotifications,
  markNotificationRead,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/dashboard/stats", getDashboardStats);
router.get("/dashboard/department-tasks", getDepartmentTasks);
router.get("/dashboard/recent-updates", getRecentUpdates);
router.get("/dashboard/department-status", getDepartmentStatus);

router.get("/housekeeping/tasks", getHousekeepingTasks);
router.get("/restaurant/orders", getRestaurantOrders);
router.get("/travel/bookings", getTravelBookings);

router.get("/notifications", getNotifications);
router.patch("/notifications/:id/read", markNotificationRead);

// ✅ Default export required for server.js
export default router;
