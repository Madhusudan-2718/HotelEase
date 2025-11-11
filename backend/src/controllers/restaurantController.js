import prisma from "../prismaClient.js";
import { generateOrderNumber, createNotification } from "../utils/helpers.js";

// 🧾 Get all restaurant orders
export const getOrders = async (req, res) => {
  try {
    const { roomNumber, status, userId } = req.query;
    const where = {};
    if (roomNumber) where.roomNumber = roomNumber;
    if (status) where.status = status;
    if (userId) where.userId = userId;

    const orders = await prisma.restaurantOrder.findMany({
      where,
      include: {
        user: true,
        assignedStaff: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ data: orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// 📦 Get single order by ID
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.restaurantOrder.findUnique({
      where: { id },
      include: {
        user: true,
        assignedStaff: true,
      },
    });

    if (!order) return res.status(404).json({ error: "Order not found" });

    res.json({ data: order });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: "Failed to fetch order" });
  }
};

// 🍽️ Create new order
export const createOrder = async (req, res) => {
  try {
    const { userId, roomNumber, items, total, notes } = req.body;

    if (!userId || !roomNumber || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Invalid or missing fields" });
    }

    const user = await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        name: `Guest ${roomNumber}`,
        email: `guest${roomNumber}@hotelease.com`,
        role: "user",
      },
    });

    const createdOrders = [];

    for (const item of items) {
      const orderNumber = generateOrderNumber();
      const order = await prisma.restaurantOrder.create({
        data: {
          orderNumber,
          userId: user.id,
          roomNumber,
          itemName: item.name || item.itemName,
          quantity: item.quantity,
          totalPrice: item.price * item.quantity,
          status: "pending",
          notes: notes || item.notes || null,
        },
        include: { user: true },
      });
      createdOrders.push(order);

      await createNotification(
        prisma,
        "restaurant",
        `New order #${orderNumber} from Room ${roomNumber}: ${item.name || item.itemName} x${item.quantity}`,
        order.id
      );
    }

    res.status(201).json({ data: createdOrders, message: "Order(s) created successfully" });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

// 🔄 Update order
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assignedStaffId, notes } = req.body;

    const order = await prisma.restaurantOrder.update({
      where: { id },
      data: {
        status,
        assignedStaffId: assignedStaffId || undefined,
        notes: notes || undefined,
      },
      include: { user: true, assignedStaff: true },
    });

    await createNotification(prisma, "restaurant", `Order #${order.orderNumber} updated to ${status}`, order.id);

    res.json({ data: order, message: "Order updated successfully" });
  } catch (error) {
    console.error("Error updating order:", error);
    if (error.code === "P2025") return res.status(404).json({ error: "Order not found" });
    res.status(500).json({ error: "Failed to update order" });
  }
};

// ❌ Delete order
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.restaurantOrder.delete({ where: { id } });
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    if (error.code === "P2025") return res.status(404).json({ error: "Order not found" });
    res.status(500).json({ error: "Failed to delete order" });
  }
};
