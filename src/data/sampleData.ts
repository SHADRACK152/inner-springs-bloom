// Sample data for the InnerSprings mock dashboard

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: "coaching" | "mental-health" | "training";
  status: "active" | "completed" | "on-hold";
  joinDate: string;
  totalSessions: number;
  completedSessions: number;
  totalCost: number;
  amountPaid: number;
}

export interface Session {
  id: string;
  clientId: string;
  title: string;
  date: string;
  time: string;
  status: "completed" | "pending" | "cancelled";
  cost: number;
  notes: string;
  achievements: string;
  sessionNumber: number;
  totalSessions: number;
}

export interface Document {
  id: string;
  clientId: string;
  title: string;
  type: "report" | "agreement" | "certificate" | "assessment";
  sessionRelated: number | null;
  dateAdded: string;
  fileSize: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: "article" | "video" | "worksheet" | "guide";
  category: string;
  dateAdded: string;
}

export interface Notification {
  id: string;
  clientId: string;
  title: string;
  message: string;
  type: "email" | "sms" | "system";
  date: string;
  read: boolean;
}

export interface Payment {
  id: string;
  clientId: string;
  sessionNumber: number;
  amount: number;
  status: "paid" | "pending";
  date: string;
  method: string;
}

export const sampleClients: Client[] = [
  {
    id: "c1",
    name: "Sarah Wanjiku",
    email: "sarah.w@email.com",
    phone: "+254712345678",
    service: "coaching",
    status: "active",
    joinDate: "2025-11-15",
    totalSessions: 12,
    completedSessions: 7,
    totalCost: 120000,
    amountPaid: 70000,
  },
  {
    id: "c2",
    name: "James Odhiambo",
    email: "james.o@email.com",
    phone: "+254723456789",
    service: "mental-health",
    status: "active",
    joinDate: "2025-12-01",
    totalSessions: 8,
    completedSessions: 4,
    totalCost: 80000,
    amountPaid: 40000,
  },
  {
    id: "c3",
    name: "Fatuma Hassan",
    email: "fatuma.h@email.com",
    phone: "+254734567890",
    service: "coaching",
    status: "completed",
    joinDate: "2025-08-10",
    totalSessions: 10,
    completedSessions: 10,
    totalCost: 100000,
    amountPaid: 100000,
  },
  {
    id: "c4",
    name: "Peter Mwangi",
    email: "peter.m@email.com",
    phone: "+254745678901",
    service: "training",
    status: "active",
    joinDate: "2026-01-05",
    totalSessions: 6,
    completedSessions: 2,
    totalCost: 60000,
    amountPaid: 20000,
  },
  {
    id: "c5",
    name: "Grace Akinyi",
    email: "grace.a@email.com",
    phone: "+254756789012",
    service: "mental-health",
    status: "on-hold",
    joinDate: "2025-10-20",
    totalSessions: 10,
    completedSessions: 5,
    totalCost: 100000,
    amountPaid: 50000,
  },
];

export const sampleSessions: Session[] = [
  { id: "s1", clientId: "c1", title: "Discovery & Goal Setting", date: "2025-11-20", time: "10:00 AM", status: "completed", cost: 10000, notes: "Identified core goals and values", achievements: "Established coaching agreement and 3 primary goals", sessionNumber: 1, totalSessions: 12 },
  { id: "s2", clientId: "c1", title: "Values Alignment", date: "2025-12-04", time: "10:00 AM", status: "completed", cost: 10000, notes: "Deep dive into personal values", achievements: "Created personal values hierarchy", sessionNumber: 2, totalSessions: 12 },
  { id: "s3", clientId: "c1", title: "Strengths Assessment", date: "2025-12-18", time: "10:00 AM", status: "completed", cost: 10000, notes: "StrengthsFinder assessment review", achievements: "Identified top 5 strengths and application plan", sessionNumber: 3, totalSessions: 12 },
  { id: "s4", clientId: "c1", title: "Leadership Development", date: "2026-01-08", time: "10:00 AM", status: "completed", cost: 10000, notes: "Leadership style exploration", achievements: "Developed situational leadership framework", sessionNumber: 4, totalSessions: 12 },
  { id: "s5", clientId: "c1", title: "Communication Mastery", date: "2026-01-22", time: "10:00 AM", status: "completed", cost: 10000, notes: "Active listening and feedback skills", achievements: "Practiced difficult conversation framework", sessionNumber: 5, totalSessions: 12 },
  { id: "s6", clientId: "c1", title: "Emotional Intelligence", date: "2026-02-05", time: "10:00 AM", status: "completed", cost: 10000, notes: "EQ assessment and development", achievements: "Improved self-awareness score by 20%", sessionNumber: 6, totalSessions: 12 },
  { id: "s7", clientId: "c1", title: "Strategic Planning", date: "2026-02-19", time: "10:00 AM", status: "completed", cost: 10000, notes: "Personal strategic plan creation", achievements: "Completed 90-day action plan", sessionNumber: 7, totalSessions: 12 },
  { id: "s8", clientId: "c1", title: "Resilience Building", date: "2026-03-25", time: "10:00 AM", status: "pending", cost: 10000, notes: "", achievements: "", sessionNumber: 8, totalSessions: 12 },
  { id: "s9", clientId: "c1", title: "Conflict Resolution", date: "2026-04-08", time: "10:00 AM", status: "pending", cost: 10000, notes: "", achievements: "", sessionNumber: 9, totalSessions: 12 },
  { id: "s10", clientId: "c1", title: "Team Dynamics", date: "2026-04-22", time: "10:00 AM", status: "pending", cost: 10000, notes: "", achievements: "", sessionNumber: 10, totalSessions: 12 },
  { id: "s11", clientId: "c1", title: "Growth Mindset", date: "2026-05-06", time: "10:00 AM", status: "pending", cost: 10000, notes: "", achievements: "", sessionNumber: 11, totalSessions: 12 },
  { id: "s12", clientId: "c1", title: "Integration & Next Steps", date: "2026-05-20", time: "10:00 AM", status: "pending", cost: 10000, notes: "", achievements: "", sessionNumber: 12, totalSessions: 12 },
];

export const sampleDocuments: Document[] = [
  { id: "d1", clientId: "c1", title: "Coaching Agreement", type: "agreement", sessionRelated: null, dateAdded: "2025-11-15", fileSize: "245 KB" },
  { id: "d2", clientId: "c1", title: "ICF Code of Ethics", type: "agreement", sessionRelated: null, dateAdded: "2025-11-15", fileSize: "180 KB" },
  { id: "d3", clientId: "c1", title: "Session 1 - Coaching Log", type: "report", sessionRelated: 1, dateAdded: "2025-11-21", fileSize: "120 KB" },
  { id: "d4", clientId: "c1", title: "Session 2 - Coaching Log", type: "report", sessionRelated: 2, dateAdded: "2025-12-05", fileSize: "115 KB" },
  { id: "d5", clientId: "c1", title: "Session 3 - Assessment Report", type: "assessment", sessionRelated: 3, dateAdded: "2025-12-19", fileSize: "340 KB" },
  { id: "d6", clientId: "c1", title: "Session 4 - Coaching Log", type: "report", sessionRelated: 4, dateAdded: "2026-01-09", fileSize: "128 KB" },
  { id: "d7", clientId: "c1", title: "Session 5 - Coaching Log", type: "report", sessionRelated: 5, dateAdded: "2026-01-23", fileSize: "135 KB" },
  { id: "d8", clientId: "c1", title: "Mid-Program Review", type: "report", sessionRelated: 6, dateAdded: "2026-02-06", fileSize: "450 KB" },
  { id: "d9", clientId: "c1", title: "Session 7 - Coaching Log", type: "report", sessionRelated: 7, dateAdded: "2026-02-20", fileSize: "142 KB" },
];

export const sampleResources: Resource[] = [
  { id: "r1", title: "Building Emotional Resilience", description: "A comprehensive guide to developing emotional strength in challenging times.", type: "guide", category: "Mental Health", dateAdded: "2025-10-01" },
  { id: "r2", title: "Goal Setting Framework", description: "SMART goals template and planning workbook for coaching clients.", type: "worksheet", category: "Coaching", dateAdded: "2025-09-15" },
  { id: "r3", title: "Mindfulness Meditation Basics", description: "Introduction to mindfulness practices for stress management.", type: "video", category: "Wellness", dateAdded: "2025-11-01" },
  { id: "r4", title: "Leadership Styles Assessment", description: "Self-assessment tool for identifying your leadership approach.", type: "worksheet", category: "Leadership", dateAdded: "2025-08-20" },
  { id: "r5", title: "Stress Management Techniques", description: "Evidence-based strategies for managing workplace stress.", type: "article", category: "Mental Health", dateAdded: "2025-12-01" },
  { id: "r6", title: "Communication Skills Workshop", description: "Video workshop on effective communication in professional settings.", type: "video", category: "Training", dateAdded: "2026-01-10" },
];

export const sampleNotifications: Notification[] = [
  { id: "n1", clientId: "c1", title: "Session Reminder", message: "Your coaching session 'Resilience Building' is scheduled for March 25, 2026 at 10:00 AM. Please prepare your reflection journal.", type: "email", date: "2026-03-24", read: false },
  { id: "n2", clientId: "c1", title: "New Document Available", message: "Your Session 7 coaching log has been uploaded to your portal.", type: "email", date: "2026-02-20", read: true },
  { id: "n3", clientId: "c1", title: "Payment Received", message: "Payment of KES 10,000 for Session 7 has been confirmed. Thank you!", type: "sms", date: "2026-02-19", read: true },
  { id: "n4", clientId: "c1", title: "Mid-Program Review", message: "Your mid-program review report is now available for download.", type: "email", date: "2026-02-06", read: true },
  { id: "n5", clientId: "c1", title: "Session Reminder", message: "Reminder: Your session 'Strategic Planning' is tomorrow at 10:00 AM.", type: "sms", date: "2026-02-18", read: true },
  { id: "n6", clientId: "c1", title: "New Resource Added", message: "A new resource 'Communication Skills Workshop' has been added to your library.", type: "system", date: "2026-01-10", read: true },
];

export const samplePayments: Payment[] = [
  { id: "p1", clientId: "c1", sessionNumber: 1, amount: 10000, status: "paid", date: "2025-11-20", method: "M-Pesa" },
  { id: "p2", clientId: "c1", sessionNumber: 2, amount: 10000, status: "paid", date: "2025-12-04", method: "M-Pesa" },
  { id: "p3", clientId: "c1", sessionNumber: 3, amount: 10000, status: "paid", date: "2025-12-18", method: "M-Pesa" },
  { id: "p4", clientId: "c1", sessionNumber: 4, amount: 10000, status: "paid", date: "2026-01-08", method: "Bank Transfer" },
  { id: "p5", clientId: "c1", sessionNumber: 5, amount: 10000, status: "paid", date: "2026-01-22", method: "M-Pesa" },
  { id: "p6", clientId: "c1", sessionNumber: 6, amount: 10000, status: "paid", date: "2026-02-05", method: "M-Pesa" },
  { id: "p7", clientId: "c1", sessionNumber: 7, amount: 10000, status: "paid", date: "2026-02-19", method: "M-Pesa" },
  { id: "p8", clientId: "c1", sessionNumber: 8, amount: 10000, status: "pending", date: "2026-03-25", method: "" },
  { id: "p9", clientId: "c1", sessionNumber: 9, amount: 10000, status: "pending", date: "2026-04-08", method: "" },
  { id: "p10", clientId: "c1", sessionNumber: 10, amount: 10000, status: "pending", date: "2026-04-22", method: "" },
  { id: "p11", clientId: "c1", sessionNumber: 11, amount: 10000, status: "pending", date: "2026-05-06", method: "" },
  { id: "p12", clientId: "c1", sessionNumber: 12, amount: 10000, status: "pending", date: "2026-05-20", method: "" },
];
