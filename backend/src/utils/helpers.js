// ✅ Generate unique IDs
export const generateOrderNumber = () => {
  return "ORD-" + Math.random().toString(36).substr(2, 6).toUpperCase();
};

export const generateBookingId = () => {
  return "TRV-" + Math.random().toString(36).substr(2, 6).toUpperCase();
};

// ✅ Create admin notification
export const createNotification = async (prisma, serviceType, message, relatedId) => {
  try {
    await prisma.adminNotification.create({
      data: {
        serviceType,
        message,
        relatedId,
      },
    });
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};
