export enum Role {
  ADMIN = 'ADMIN',
  STUDENT = 'STUDENT',
  KURIKULUM = 'KURIKULUM',
  KOMTI = 'KOMTI',
  WAKOMTI = 'WAKOMTI',
  IT_LOGISTIK = 'IT_LOGISTIK',
  TATA_TERTIB = 'TATA_TERTIB',
  SEKRETARIS = 'SEKRETARIS',
  BENDAHARA = 'BENDAHARA',
  MURID_BIBILUNG = 'MURID_BIBILUNG',
}

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: Role;
  password?: string; // In a real app, never store plain password
  isActive: boolean;
  seatIndex?: number | null; // For seating plan (0-34)
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  teacher?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  authorId: string;
  authorName: string;
  type: 'NORMAL' | 'IMPORTANT' | 'EMERGENCY';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  subject: string; // Should match Subject.name or ID
  deadline: string;
  isCompleted: boolean; // For student view toggling locally
  createdBy: Role;
}

export interface ScheduleItem {
  id: string;
  day: string; // "Monday", etc.
  time: string;
  subject: string;
  room: string;
}

export interface VideoMaterial {
  id: string;
  title: string;
  url: string; // YouTube or Drive link
  subject: string;
  week: number;
  uploadedBy: string;
}

export interface DocumentMaterial {
  id: string;
  title: string;
  type: 'PDF' | 'DOC';
  url: string;
  description: string;
  subject: string;
  uploadedBy: string;
}

export interface TutorEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  tutorId: string;
  tutorName: string;
  maxParticipants: number;
  participants: string[]; // List of User IDs who joined
  waitingList: string[]; // List of User IDs in waiting list
}

// Log activity
export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  timestamp: string;
}

export interface Confession {
  id: string;
  content: string;
  timestamp: string;
  likes: number;
  color: string;
}

export interface GalleryItem {
  id: string;
  url: string;
  caption: string;
  type: 'IMAGE' | 'VIDEO';
  uploadedBy: string;
  timestamp: string;
}

export interface TreasuryTransaction {
  id: string;
  date: string;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  description: string;
  category: string; // e.g., "Kas Mingguan", "Event", "Photocopy"
  recordedBy: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: string[]; // List of User IDs who voted for this option
}

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  createdBy: string;
  createdAt: string;
  deadline: string;
  isActive: boolean;
  allowMultiple: boolean;
  isAnonymous: boolean;
}