import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create default admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@hotelease.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@hotelease.com',
      role: 'admin',
    },
  });

  // Create staff members
  const staffData = [
    // Housekeeping Staff
    { name: 'Sita Kumar', role: 'Housekeeping Supervisor', department: 'housekeeping', contact: '+91 98765 43220', email: 'sita.kumar@hotelease.com', rating: 4.8, shiftTiming: '6:00 AM - 2:00 PM' },
    { name: 'Priya Sharma', role: 'Housekeeping Staff', department: 'housekeeping', contact: '+91 98765 43221', email: 'priya.sharma@hotelease.com', rating: 4.6, shiftTiming: '6:00 AM - 2:00 PM' },
    { name: 'Rajesh Patel', role: 'Housekeeping Staff', department: 'housekeeping', contact: '+91 98765 43222', email: 'rajesh.patel@hotelease.com', rating: 4.7, shiftTiming: '2:00 PM - 10:00 PM' },
    { name: 'Anita Desai', role: 'Housekeeping Staff', department: 'housekeeping', contact: '+91 98765 43223', email: 'anita.desai@hotelease.com', rating: 4.9, shiftTiming: '6:00 AM - 2:00 PM' },
    { name: 'Vikram Singh', role: 'Housekeeping Staff', department: 'housekeeping', contact: '+91 98765 43224', email: 'vikram.singh@hotelease.com', rating: 4.5, shiftTiming: '2:00 PM - 10:00 PM' },
    { name: 'Meera Nair', role: 'Housekeeping Staff', department: 'housekeeping', contact: '+91 98765 43225', email: 'meera.nair@hotelease.com', rating: 4.7, shiftTiming: '6:00 AM - 2:00 PM' },
    { name: 'Sunita Reddy', role: 'Housekeeping Staff', department: 'housekeeping', contact: '+91 98765 43226', email: 'sunita.reddy@hotelease.com', rating: 4.6, shiftTiming: '2:00 PM - 10:00 PM' },
    { name: 'Kiran Verma', role: 'Housekeeping Staff', department: 'housekeeping', contact: '+91 98765 43227', email: 'kiran.verma@hotelease.com', rating: 4.4, shiftTiming: '10:00 PM - 6:00 AM' },
    
    // Restaurant Staff - Chefs
    { name: 'Chef Ramesh', role: 'Head Chef', department: 'restaurant', contact: '+91 98765 43300', email: 'chef.ramesh@hotelease.com', rating: 4.9, shiftTiming: '8:00 AM - 4:00 PM' },
    { name: 'Chef Priya', role: 'Sous Chef', department: 'restaurant', contact: '+91 98765 43301', email: 'chef.priya@hotelease.com', rating: 4.8, shiftTiming: '8:00 AM - 4:00 PM' },
    { name: 'Chef Vikram', role: 'Chef', department: 'restaurant', contact: '+91 98765 43302', email: 'chef.vikram@hotelease.com', rating: 4.7, shiftTiming: '4:00 PM - 12:00 AM' },
    { name: 'Chef Anjali', role: 'Chef', department: 'restaurant', contact: '+91 98765 43303', email: 'chef.anjali@hotelease.com', rating: 4.8, shiftTiming: '8:00 AM - 4:00 PM' },
    { name: 'Chef Arjun', role: 'Chef', department: 'restaurant', contact: '+91 98765 43304', email: 'chef.arjun@hotelease.com', rating: 4.6, shiftTiming: '4:00 PM - 12:00 AM' },
    { name: 'Chef Kavita', role: 'Chef', department: 'restaurant', contact: '+91 98765 43305', email: 'chef.kavita@hotelease.com', rating: 4.7, shiftTiming: '8:00 AM - 4:00 PM' },
    
    // Restaurant Staff - Waiters
    { name: 'Amit Kumar', role: 'Senior Waiter', department: 'restaurant', contact: '+91 98765 43400', email: 'amit.kumar@hotelease.com', rating: 4.7, shiftTiming: '7:00 AM - 3:00 PM' },
    { name: 'Sneha Patel', role: 'Waiter', department: 'restaurant', contact: '+91 98765 43401', email: 'sneha.patel@hotelease.com', rating: 4.6, shiftTiming: '7:00 AM - 3:00 PM' },
    { name: 'Rohit Sharma', role: 'Waiter', department: 'restaurant', contact: '+91 98765 43402', email: 'rohit.sharma@hotelease.com', rating: 4.8, shiftTiming: '3:00 PM - 11:00 PM' },
    { name: 'Kavita Nair', role: 'Waiter', department: 'restaurant', contact: '+91 98765 43403', email: 'kavita.nair@hotelease.com', rating: 4.7, shiftTiming: '7:00 AM - 3:00 PM' },
    { name: 'Rahul Mehta', role: 'Waiter', department: 'restaurant', contact: '+91 98765 43404', email: 'rahul.mehta@hotelease.com', rating: 4.5, shiftTiming: '3:00 PM - 11:00 PM' },
    { name: 'Pooja Singh', role: 'Waiter', department: 'restaurant', contact: '+91 98765 43405', email: 'pooja.singh@hotelease.com', rating: 4.6, shiftTiming: '7:00 AM - 3:00 PM' },
    
    // Travel Desk Staff
    { name: 'Rajesh Kumar', role: 'Senior Driver', department: 'travel', contact: '+91 98765 43210', email: 'rajesh.kumar@hotelease.com', rating: 4.8, shiftTiming: '6:00 AM - 6:00 PM' },
    { name: 'Vikram Singh', role: 'Driver', department: 'travel', contact: '+91 98765 43211', email: 'vikram.singh@hotelease.com', rating: 4.7, shiftTiming: '6:00 AM - 6:00 PM' },
    { name: 'Amit Patel', role: 'Driver', department: 'travel', contact: '+91 98765 43212', email: 'amit.patel@hotelease.com', rating: 4.6, shiftTiming: '6:00 PM - 6:00 AM' },
    { name: 'Rohit Sharma', role: 'Driver', department: 'travel', contact: '+91 98765 43213', email: 'rohit.sharma@hotelease.com', rating: 4.9, shiftTiming: '6:00 AM - 6:00 PM' },
    { name: 'Suresh Yadav', role: 'Driver', department: 'travel', contact: '+91 98765 43214', email: 'suresh.yadav@hotelease.com', rating: 4.5, shiftTiming: '6:00 PM - 6:00 AM' },
    { name: 'Manoj Gupta', role: 'Driver', department: 'travel', contact: '+91 98765 43215', email: 'manoj.gupta@hotelease.com', rating: 4.7, shiftTiming: '6:00 AM - 6:00 PM' },
  ];

  for (const staff of staffData) {
    await prisma.staff.upsert({
      where: { email: staff.email },
      update: {},
      create: {
        ...staff,
        availability: true,
      },
    });
  }

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


