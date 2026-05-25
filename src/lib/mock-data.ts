export const currentUser = {
  name: "Alex Rivera",
  email: "alex.rivera@university.edu",
  role: "Student",
  studentId: "STU-4429",
  department: "Computer Science",
  avatar: "AR",
};

export const subjects = [
  { code: "DS402", name: "Data Science", attendance: 98, color: "bg-emerald-100 text-emerald-700" },
  { code: "AI301", name: "Artificial Intelligence", attendance: 82, color: "bg-blue-100 text-blue-700" },
  { code: "ML201", name: "Machine Learning", attendance: 88, color: "bg-violet-100 text-violet-700" },
  { code: "CC401", name: "Cloud Computing", attendance: 74, color: "bg-amber-100 text-amber-700" },
  { code: "PY101", name: "Advanced Python", attendance: 91, color: "bg-pink-100 text-pink-700" },
];

export const recentActivity = [
  { code: "DS", subject: "Data Science 402", time: "Oct 24, 09:02 AM", status: "Present", method: "Verified via GPS", color: "bg-emerald-100 text-emerald-700" },
  { code: "ML", subject: "Machine Learning Basics", time: "Oct 23, 11:15 AM", status: "Present", method: "Verified via QR", color: "bg-blue-100 text-blue-700" },
  { code: "AI", subject: "AI Foundations", time: "Oct 23, 02:00 PM", status: "Present", method: "Verified via QR", color: "bg-violet-100 text-violet-700" },
  { code: "PY", subject: "Advanced Python", time: "Oct 22, 02:00 PM", status: "Absent", method: "Notified Guardian", color: "bg-red-100 text-red-700" },
  { code: "CC", subject: "Cloud Computing", time: "Oct 22, 10:00 AM", status: "Present", method: "Verified via GPS", color: "bg-amber-100 text-amber-700" },
];

export const monthlyTrend = [
  { month: "May", attendance: 78 },
  { month: "Jun", attendance: 82 },
  { month: "Jul", attendance: 86 },
  { month: "Aug", attendance: 84 },
  { month: "Sep", attendance: 90 },
  { month: "Oct", attendance: 94 },
];

export const liveAttendance = [
  { name: "Sarah Jenkins", id: "STU-1042", time: "09:02:14", status: "Present", method: "QR" },
  { name: "Marcus Thorne", id: "STU-1187", time: "09:02:31", status: "Present", method: "QR" },
  { name: "Elena Rodriguez", id: "STU-1290", time: "09:05:18", status: "Late", method: "QR" },
  { name: "James O'Connor", id: "STU-1311", time: "09:05:45", status: "Present", method: "GPS+QR" },
  { name: "Priya Sharma", id: "STU-1402", time: "09:06:02", status: "Present", method: "QR" },
  { name: "Diego Martinez", id: "STU-1503", time: "09:08:21", status: "Late", method: "QR" },
];

export const adminStats = {
  totalStudents: 1248,
  presentToday: 1102,
  activeSessions: 12,
  flagged: 3,
};

export const departmentBreakdown = [
  { dept: "CSE", present: 96 },
  { dept: "ECE", present: 91 },
  { dept: "MECH", present: 88 },
  { dept: "CIVIL", present: 84 },
  { dept: "AI&DS", present: 94 },
];

export const todaySchedule = [
  { time: "09:00", subject: "Data Science", room: "Hall A-402", prof: "Prof. Henderson", status: "Present" as const },
  { time: "11:00", subject: "Machine Learning", room: "Lab 2", prof: "Prof. Zhang", status: "Present" as const },
  { time: "14:00", subject: "Cloud Computing", room: "Hall B-201", prof: "Dr. Patel", status: "Upcoming" as const },
  { time: "16:30", subject: "Ethics in AI", room: "Seminar Room", prof: "Dr. Sterling", status: "Upcoming" as const },
];