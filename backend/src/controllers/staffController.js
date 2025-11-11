import prisma from "../prismaClient.js";

// 👥 Get all staff members
export const getStaffMembers = async (req, res) => {
  try {
    const { department, status, rating, search } = req.query;
    const where = {};
    if (department) where.department = department.toLowerCase();
    if (status === "available") where.availability = true;
    if (status === "busy") where.availability = false;
    if (rating) where.rating = { gte: parseFloat(rating) };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { role: { contains: search, mode: "insensitive" } },
        { contact: { contains: search, mode: "insensitive" } },
      ];
    }

    const staff = await prisma.staff.findMany({
      where,
      include: {
        _count: {
          select: {
            restaurantOrders: true,
            housekeepingRequests: true,
            travelBookings: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    const formattedStaff = staff.map((s) => ({
      id: s.id,
      name: s.name,
      role: s.role,
      department: s.department.charAt(0).toUpperCase() + s.department.slice(1),
      status: s.availability ? "available" : "busy",
      phone: s.contact,
      email: s.email || `${s.name.toLowerCase().replace(/\s+/g, ".")}@hotelease.com`,
      rating: s.rating || 0,
      recentTasks:
        (s._count.restaurantOrders || 0) +
        (s._count.housekeepingRequests || 0) +
        (s._count.travelBookings || 0),
      shiftTiming: s.shiftTiming || "N/A",
    }));

    res.json({ data: formattedStaff });
  } catch (error) {
    console.error("Error fetching staff:", error);
    res.status(500).json({ error: "Failed to fetch staff members" });
  }
};

// 👤 Get single staff member
export const getStaffById = async (req, res) => {
  try {
    const { id } = req.params;

    const staff = await prisma.staff.findUnique({
      where: { id },
      include: {
        restaurantOrders: true,
        housekeepingRequests: true,
        travelBookings: true,
      },
    });

    if (!staff) return res.status(404).json({ error: "Staff not found" });

    res.json({ data: staff });
  } catch (error) {
    console.error("Error fetching staff:", error);
    res.status(500).json({ error: "Failed to fetch staff" });
  }
};

// ➕ Create staff
export const createStaff = async (req, res) => {
  try {
    const { name, role, department, contact, email, shiftTiming, rating } = req.body;
    if (!name || !role || !department || !contact) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const staff = await prisma.staff.create({
      data: {
        name,
        role,
        department: department.toLowerCase(),
        contact,
        email: email || null,
        shiftTiming: shiftTiming || null,
        rating: rating || 0,
        availability: true,
      },
    });

    res.status(201).json({ data: staff, message: "Staff member created successfully" });
  } catch (error) {
    console.error("Error creating staff:", error);
    res.status(500).json({ error: "Failed to create staff member" });
  }
};

// ✏️ Update staff
export const updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, department, contact, email, shiftTiming, rating, availability } = req.body;

    const staff = await prisma.staff.update({
      where: { id },
      data: {
        name,
        role,
        department: department?.toLowerCase(),
        contact,
        email,
        shiftTiming,
        rating,
        availability,
      },
    });

    res.json({ data: staff, message: "Staff member updated successfully" });
  } catch (error) {
    console.error("Error updating staff:", error);
    if (error.code === "P2025") return res.status(404).json({ error: "Staff member not found" });
    res.status(500).json({ error: "Failed to update staff member" });
  }
};

// ❌ Delete staff
export const deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.staff.delete({ where: { id } });
    res.json({ message: "Staff member deleted successfully" });
  } catch (error) {
    console.error("Error deleting staff:", error);
    if (error.code === "P2025") return res.status(404).json({ error: "Staff member not found" });
    res.status(500).json({ error: "Failed to delete staff member" });
  }
};
