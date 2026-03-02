import bcrypt from 'bcryptjs';
import { Role, User, Announcement, Task, ScheduleItem, VideoMaterial, Subject, DocumentMaterial, TutorEvent, Confession, GalleryItem, TreasuryTransaction, Poll } from '../types';

// Pre-hash the password 'password' for performance
const hash = bcrypt.hashSync('password', 10);

export const generateUsers = (): User[] => {
  const users: User[] = [];

  // 1 Admin
  users.push({ id: 'admin', username: 'admin', fullName: 'Super Administrator', role: Role.ADMIN, isActive: true, password: hash });
  // 1 Kurikulum
  users.push({ id: 'kuri', username: 'kurikulum', fullName: 'Staff Kurikulum', role: Role.KURIKULUM, isActive: true, password: hash });
  // 1 Komti
  users.push({ id: 'komti', username: 'komti', fullName: 'Ketua Tingkat', role: Role.KOMTI, isActive: true, password: hash });
  // 1 Wakomti
  users.push({ id: 'wakomti', username: 'wakomti', fullName: 'Wakil Ketua', role: Role.WAKOMTI, isActive: true, password: hash });
  // 1 IT
  users.push({ id: 'it', username: 'it', fullName: 'IT Support', role: Role.IT_LOGISTIK, isActive: true, password: hash });
  // 1 Tatib
  users.push({ id: 'tatib', username: 'tatib', fullName: 'Tata Tertib', role: Role.TATA_TERTIB, isActive: true, password: hash });
  // 1 Sekretaris
  users.push({ id: 'sekre', username: 'sekretaris', fullName: 'Sekretaris Kelas', role: Role.SEKRETARIS, isActive: true, password: hash });
  // 1 Bendahara
  users.push({ id: 'bendahara', username: 'bendahara', fullName: 'Bendahara Kelas', role: Role.BENDAHARA, isActive: true, password: hash });
  
  // 1 Murid Bibilung (Tutor)
  users.push({ id: 'bibilung1', username: 'bibilung', fullName: 'Master Bibilung', role: Role.MURID_BIBILUNG, isActive: true, password: hash });

  // 35 Students
  for (let i = 1; i <= 35; i++) {
    users.push({
      id: `s${i}`,
      username: `student${i}`,
      fullName: `Student Name ${i}`,
      role: Role.STUDENT,
      isActive: true,
      password: hash,
      seatIndex: i - 1 // Initial seating 0-34
    });
  }

  return users;
};

export const initialSubjects: Subject[] = [
  { id: '1', name: 'Web Development', code: 'WEB101', teacher: 'Mr. Smith' },
  { id: '2', name: 'Database Systems', code: 'DB201', teacher: 'Mrs. Jones' },
  { id: '3', name: 'Calculus', code: 'MAT301', teacher: 'Dr. Brown' },
  { id: '4', name: 'English', code: 'ENG101', teacher: 'Ms. Wilson' },
];

export const initialAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'Welcome to the New Semester!',
    content: 'Please check your schedule and seating arrangement.',
    date: new Date().toISOString(),
    authorId: 'komti',
    authorName: 'Ketua Tingkat',
    type: 'IMPORTANT'
  }
];

export const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Calculus Homework Chapter 1',
    description: 'Solve problems 1-10 on page 24.',
    subject: 'Calculus',
    deadline: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days later
    isCompleted: false,
    createdBy: Role.KURIKULUM
  }
];

export const initialSchedule: ScheduleItem[] = [
  { id: '1', day: 'Monday', time: '08:00 - 10:00', subject: 'Web Development', room: 'Lab 1' },
  { id: '2', day: 'Monday', time: '10:00 - 12:00', subject: 'Database Systems', room: 'Lab 2' },
  { id: '3', day: 'Tuesday', time: '08:00 - 10:00', subject: 'English', room: 'Class A' },
];

export const initialVideos: VideoMaterial[] = [
  {
    id: '1',
    title: 'Intro to React',
    url: 'https://www.youtube.com/embed/SqcY0GlETPk', 
    subject: 'Web Development',
    week: 1,
    uploadedBy: 'Kurikulum'
  }
];

export const initialMaterials: DocumentMaterial[] = [
  {
    id: '1',
    title: 'Database Normalization Guide',
    type: 'PDF',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    description: 'Comprehensive guide to 1NF, 2NF, 3NF',
    subject: 'Database Systems',
    uploadedBy: 'Sekretaris'
  }
];

export const initialTutorEvents: TutorEvent[] = [
  {
    id: '1',
    title: 'React Hooks Deep Dive',
    description: 'Extra class to understand useEffect and useState deeply.',
    date: new Date(Date.now() + 86400000 * 3).toISOString(),
    tutorId: 'bibilung1',
    tutorName: 'Master Bibilung',
    maxParticipants: 5,
    participants: ['s1', 's2'],
    waitingList: []
  }
];

export const initialConfessions: Confession[] = [
  {
    id: '1',
    content: 'I actually really like the new seating plan!',
    timestamp: new Date().toISOString(),
    likes: 5,
    color: 'bg-yellow-200'
  },
  {
    id: '2',
    content: 'Who ate my sandwich from the fridge? >:(',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    likes: 12,
    color: 'bg-pink-200'
  }
];

export const initialGalleryItems: GalleryItem[] = [
  {
    id: '1',
    url: 'https://picsum.photos/seed/class1/800/600',
    caption: 'Class Trip 2024',
    type: 'IMAGE',
    uploadedBy: 'admin',
    timestamp: new Date().toISOString()
  },
  {
    id: '2',
    url: 'https://picsum.photos/seed/class2/800/600',
    caption: 'Sports Day Victory',
    type: 'IMAGE',
    uploadedBy: 's1',
    timestamp: new Date(Date.now() - 86400000).toISOString()
  }
];

export const initialTreasuryTransactions: TreasuryTransaction[] = [
  {
    id: '1',
    date: new Date(Date.now() - 86400000 * 10).toISOString(),
    type: 'INCOME',
    amount: 500000,
    description: 'Uang Kas Minggu 1',
    category: 'Kas Mingguan',
    recordedBy: 'bendahara'
  },
  {
    id: '2',
    date: new Date(Date.now() - 86400000 * 5).toISOString(),
    type: 'EXPENSE',
    amount: 150000,
    description: 'Beli Spidol & Penghapus',
    category: 'Perlengkapan',
    recordedBy: 'bendahara'
  }
];

export const initialPolls: Poll[] = [
  {
    id: '1',
    question: 'Where should we go for the class trip?',
    options: [
      { id: 'opt1', text: 'Beach', votes: ['s1', 's2', 's3'] },
      { id: 'opt2', text: 'Mountain', votes: ['s4', 's5'] },
      { id: 'opt3', text: 'Museum', votes: ['s6'] }
    ],
    createdBy: 'komti',
    createdAt: new Date().toISOString(),
    deadline: new Date(Date.now() + 86400000 * 7).toISOString(),
    isActive: true,
    allowMultiple: false,
    isAnonymous: false
  }
];