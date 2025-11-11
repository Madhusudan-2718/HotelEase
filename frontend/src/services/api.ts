// ============================================
// API Service Layer - Backend Integration Ready
// ============================================
// This file provides a centralized API service layer
// Replace the base URL and implement actual API calls when backend is ready

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

// ========== Generic API Client ==========
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        let errorMessage = `API Error: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
          // If response is not JSON, use status text
        }
        const error: any = new Error(errorMessage);
        error.status = response.status;
        throw error;
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error(`API request failed: ${endpoint}`, error);
      // If it's a network error, provide a helpful message
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please ensure the backend is running.');
      }
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

// ========== Restaurant API ==========
export const restaurantApi = {
  // Get all menu items (static for now, can be moved to backend later)
  getMenuItems: () => Promise.resolve({ data: [] }),
  
  // Create a new order
  createOrder: async (orderData: {
    userId: string;
    roomNumber: string;
    items: Array<{ name: string; quantity: number; price: number; notes?: string }>;
    total: number;
    notes?: string;
  }) => {
    const response = await apiClient.post<{ data: any[]; message: string }>("/orders", orderData);
    return response;
  },
  
  // Get orders for a room
  getOrders: (roomNumber: string) => 
    apiClient.get<{ data: any[] }>(`/orders?roomNumber=${roomNumber}`),
  
  // Get order by ID
  getOrder: (orderId: string) => 
    apiClient.get<{ data: any }>(`/orders/${orderId}`),
  
  // Update order status
  updateOrderStatus: (orderId: string, status: string, assignedStaffId?: string) =>
    apiClient.patch(`/orders/${orderId}`, { status, assignedStaffId }),
};

// ========== Housekeeping API ==========
export const housekeepingApi = {
  // Get available services (static for now, can be moved to backend later)
  getServices: () => Promise.resolve({ data: [] }),
  
  // Create a new request
  createRequest: (requestData: {
    userId: string;
    roomNumber: string;
    serviceType: string;
    notes?: string;
    scheduledTime?: string;
    priority?: "low" | "medium" | "high";
  }) => apiClient.post<{ data: any; message: string }>("/housekeeping", requestData),
  
  // Get requests for a room
  getRequests: (roomNumber: string) =>
    apiClient.get<{ data: any[] }>(`/housekeeping?roomNumber=${roomNumber}`),
  
  // Get request by ID
  getRequest: (requestId: string) =>
    apiClient.get<{ data: any }>(`/housekeeping/${requestId}`),
  
  // Update request status
  updateRequestStatus: (requestId: string, status: string, assignedStaffId?: string) =>
    apiClient.patch(`/housekeeping/${requestId}`, { status, assignedStaffId }),
};

// ========== Travel Desk API ==========
export const travelDeskApi = {
  // Get available services (static for now, can be moved to backend later)
  getServices: () => Promise.resolve({ data: [] }),
  
  // Create a new booking
  createBooking: (bookingData: {
    userId: string;
    roomNumber: string;
    guestName?: string;
    serviceType: string;
    pickupLocation: string;
    dropLocation: string;
    date: string;
    time: string;
    estimatedPrice: number;
  }) => apiClient.post<{ data: any; message: string }>("/travel", bookingData),
  
  // Get bookings for a room
  getBookings: (roomNumber: string) =>
    apiClient.get<{ data: any[] }>(`/travel?roomNumber=${roomNumber}`),
  
  // Get booking by ID
  getBooking: (bookingId: string) =>
    apiClient.get<{ data: any }>(`/travel/${bookingId}`),
  
  // Update booking status
  updateBookingStatus: (bookingId: string, status: string, assignedStaffId?: string, vehicle?: string) =>
    apiClient.patch(`/travel/${bookingId}`, { status, assignedStaffId, vehicle }),
};

// ========== Admin API ==========
export const adminApi = {
  // Get dashboard statistics
  getDashboardStats: () => apiClient.get("/admin/dashboard/stats"),
  
  // Get department task counts
  getDepartmentTasks: () => apiClient.get("/admin/dashboard/department-tasks"),
  
  // Get recent updates
  getRecentUpdates: () => apiClient.get("/admin/dashboard/recent-updates"),
  
  // Get department status
  getDepartmentStatus: () => apiClient.get("/admin/dashboard/department-status"),
  
  // Get all housekeeping tasks
  getHousekeepingTasks: (filters?: {
    status?: string;
    search?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.search) params.append("search", filters.search);
    return apiClient.get(`/admin/housekeeping/tasks?${params.toString()}`);
  },
  
  // Assign staff to housekeeping task
  assignHousekeepingTask: (taskId: string, data: {
    assignedStaffId: string;
    status: string;
    priority?: string;
    deadline?: string;
    notes?: string;
  }) => apiClient.patch(`/housekeeping/${taskId}`, data),
  
  // Get all restaurant orders
  getRestaurantOrders: (filters?: {
    status?: string;
    search?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.search) params.append("search", filters.search);
    return apiClient.get(`/admin/restaurant/orders?${params.toString()}`);
  },
  
  // Assign staff to restaurant order
  assignRestaurantOrder: (orderId: string, data: {
    assignedStaffId: string;
    status: string;
  }) => apiClient.patch(`/orders/${orderId}`, data),
  
  // Get all travel bookings
  getTravelBookings: (filters?: {
    status?: string;
    search?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.search) params.append("search", filters.search);
    return apiClient.get(`/admin/travel/bookings?${params.toString()}`);
  },
  
  // Assign driver to travel booking
  assignTravelBooking: (bookingId: string, data: {
    assignedStaffId: string;
    vehicle: string;
    status: string;
    remarks?: string;
  }) => apiClient.patch(`/travel/${bookingId}`, data),
  
  // Get notifications
  getNotifications: (isRead?: boolean) => {
    const params = new URLSearchParams();
    if (isRead !== undefined) params.append("isRead", isRead.toString());
    return apiClient.get(`/admin/notifications?${params.toString()}`);
  },
  
  // Mark notification as read
  markNotificationRead: (notificationId: string) =>
    apiClient.patch(`/admin/notifications/${notificationId}/read`),
};

// ========== Staff API ==========
export const staffApi = {
  // Get all staff members
  getStaffMembers: (filters?: {
    department?: string;
    status?: string;
    rating?: string;
    search?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters?.department) params.append("department", filters.department);
    if (filters?.status) params.append("status", filters.status);
    if (filters?.rating) params.append("rating", filters.rating);
    if (filters?.search) params.append("search", filters.search);
    return apiClient.get<{ data: any[] }>(`/staff?${params.toString()}`);
  },
  
  // Get staff by ID
  getStaffById: (staffId: string) =>
    apiClient.get<{ data: any }>(`/staff/${staffId}`),
  
  // Create staff member
  createStaff: (staffData: {
    name: string;
    role: string;
    department: string;
    contact: string;
    email?: string;
    shiftTiming?: string;
    rating?: number;
  }) => apiClient.post<{ data: any; message: string }>("/staff", staffData),
  
  // Update staff member
  updateStaff: (staffId: string, staffData: {
    name?: string;
    role?: string;
    department?: string;
    contact?: string;
    email?: string;
    shiftTiming?: string;
    rating?: number;
    availability?: boolean;
  }) => apiClient.patch(`/staff/${staffId}`, staffData),
  
  // Delete staff member
  deleteStaff: (staffId: string) =>
    apiClient.delete(`/staff/${staffId}`),
};

