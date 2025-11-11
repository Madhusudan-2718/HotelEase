import prisma from "../prismaClient.js";
import { createNotification } from "../utils/helpers.js";

// 🧾 Get all housekeeping requests
export const getRequests = async (req, res) => {
  try {
    const { roomNumber, status, userId } = req.query;
    const where = {};
    if (roomNumber) where.roomNumber = roomNumber;
    if (status) where.status = status;
    if (userId) where.userId = userId;

    const requests = await prisma.housekeepingRequest.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        assignedStaff: { select: { id: true, name: true, role: true, contact: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ data: requests });
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ error: "Failed to fetch requests" });
  }
};

// 🧾 Get single housekeeping request by ID
export const getRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await prisma.housekeepingRequest.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        assignedStaff: { select: { id: true, name: true, role: true, contact: true } },
      },
    });

    if (!request) return res.status(404).json({ error: "Request not found" });

    res.json({ data: request });
  } catch (error) {
    console.error("Error fetching request:", error);
    res.status(500).json({ error: "Failed to fetch request" });
  }
};

// 🧹 Create new housekeeping request
export const createRequest = async (req, res) => {
  try {
    const { userId, roomNumber, requestType, notes, scheduledTime, priority } = req.body;

    if (!userId || !roomNumber || !requestType) {
      return res.status(400).json({ error: "Missing required fields: userId, roomNumber, requestType" });
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

    const request = await prisma.housekeepingRequest.create({
      data: {
        userId: user.id,
        roomNumber,
        requestType,
        status: "pending",
        notes: notes || null,
        scheduledTime: scheduledTime ? new Date(scheduledTime) : null,
        priority: priority || "medium",
      },
      include: { user: true },
    });

    await createNotification(prisma, "housekeeping", `New ${requestType} request from Room ${roomNumber}`, request.id);

    res.status(201).json({ data: request, message: "Request created successfully" });
  } catch (error) {
    console.error("Error creating request:", error);
    res.status(500).json({ error: "Failed to create request" });
  }
};

// 🧼 Update housekeeping request
export const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assignedStaffId, notes, priority, deadline } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (assignedStaffId) updateData.assignedStaffId = assignedStaffId;
    if (notes !== undefined) updateData.notes = notes;
    if (priority) updateData.priority = priority;
    if (deadline) updateData.deadline = new Date(deadline);

    const request = await prisma.housekeepingRequest.update({
      where: { id },
      data: updateData,
      include: {
        user: { select: { id: true, name: true, email: true } },
        assignedStaff: { select: { id: true, name: true, role: true, contact: true } },
      },
    });

    await createNotification(
      prisma,
      "housekeeping",
      `Housekeeping request from Room ${request.roomNumber} updated to ${status}`,
      request.id
    );

    res.json({ data: request, message: "Request updated successfully" });
  } catch (error) {
    console.error("Error updating request:", error);
    if (error.code === "P2025") return res.status(404).json({ error: "Request not found" });
    res.status(500).json({ error: "Failed to update request" });
  }
};

// ❌ Delete housekeeping request
export const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.housekeepingRequest.delete({
      where: { id },
    });

    res.json({ message: "Request deleted successfully" });
  } catch (error) {
    console.error("Error deleting request:", error);
    if (error.code === "P2025") return res.status(404).json({ error: "Request not found" });
    res.status(500).json({ error: "Failed to delete request" });
  }
};
