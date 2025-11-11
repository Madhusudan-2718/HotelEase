import prisma from "../prismaClient.js";
import { generateBookingId, createNotification } from "../utils/helpers.js";

// 🚗 Get all travel bookings
export const getBookings = async (req, res) => {
  try {
    const { roomNumber, status, userId } = req.query;
    const where = {};
    if (roomNumber) where.roomNumber = roomNumber;
    if (status) where.status = status;
    if (userId) where.userId = userId;

    const bookings = await prisma.travelBooking.findMany({
      where,
      include: { user: true, assignedStaff: true },
      orderBy: { createdAt: "desc" },
    });

    res.json({ data: bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

// 📄 Get single booking by ID
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await prisma.travelBooking.findUnique({
      where: { id },
      include: { user: true, assignedStaff: true },
    });

    if (!booking) return res.status(404).json({ error: "Booking not found" });

    res.json({ data: booking });
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({ error: "Failed to fetch booking" });
  }
};

// ✈️ Create new booking
export const createBooking = async (req, res) => {
  try {
    const { userId, roomNumber, guestName, serviceType, pickupLocation, dropLocation, date, time, estimatedPrice } =
      req.body;

    if (!userId || !roomNumber || !serviceType || !pickupLocation || !dropLocation || !date || !time) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const user = await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        name: guestName || `Guest ${roomNumber}`,
        email: `guest${roomNumber}@hotelease.com`,
        role: "user",
      },
    });

    const bookingId = generateBookingId();
    const booking = await prisma.travelBooking.create({
      data: {
        bookingId,
        userId: user.id,
        roomNumber,
        guestName: guestName || user.name,
        serviceType,
        pickupLocation,
        dropLocation,
        destination: dropLocation,
        date: new Date(date),
        time,
        estimatedPrice,
        status: "pending",
      },
      include: { user: true },
    });

    await createNotification(
      prisma,
      "travel",
      `New ${serviceType} booking #${bookingId} from Room ${roomNumber}`,
      booking.id
    );

    res.status(201).json({ data: booking, message: "Booking created successfully" });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Failed to create booking" });
  }
};

// 🔄 Update booking
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assignedStaffId, vehicle, remarks } = req.body;

    const booking = await prisma.travelBooking.update({
      where: { id },
      data: { status, assignedStaffId, vehicle, remarks },
      include: { user: true, assignedStaff: true },
    });

    await createNotification(prisma, "travel", `Booking #${booking.bookingId} updated to ${status}`, booking.id);

    res.json({ data: booking, message: "Booking updated successfully" });
  } catch (error) {
    console.error("Error updating booking:", error);
    if (error.code === "P2025") return res.status(404).json({ error: "Booking not found" });
    res.status(500).json({ error: "Failed to update booking" });
  }
};

// ❌ Delete booking
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.travelBooking.delete({ where: { id } });
    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    if (error.code === "P2025") return res.status(404).json({ error: "Booking not found" });
    res.status(500).json({ error: "Failed to delete booking" });
  }
};
