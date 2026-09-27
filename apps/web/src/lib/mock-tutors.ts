// Dữ liệu mẫu để phát triển & xem trước giao diện.
// Khi API thật (apps/api) sẵn sàng, thay các hàm bên dưới bằng gọi apiFetch("/api/tutors").

export interface MockTutor {
  id: string;
  fullName: string;
  initials: string;
  subjects: string[];
  region: string;
  teachingMode: "ONLINE" | "OFFLINE" | "BOTH";
  hourlyRate: number;
  experienceYears: number;
  educationLevel: string;
  ratingAvg: number;
  ratingCount: number;
  studentsAccepted: number;
  badges: Array<"IDENTITY" | "STUDENT" | "DEGREE" | "EXPERIENCE">;
  bio: string;
}

export const MOCK_TUTORS: MockTutor[] = [
  {
    id: "1",
    fullName: "Nguyễn Minh Anh",
    initials: "MA",
    subjects: ["Toán", "Lý"],
    region: "Quận 1, TP.HCM",
    teachingMode: "BOTH",
    hourlyRate: 180000,
    experienceYears: 4,
    educationLevel: "SV năm 4 - ĐH Bách Khoa",
    ratingAvg: 4.9,
    ratingCount: 62,
    studentsAccepted: 38,
    badges: ["IDENTITY", "STUDENT", "DEGREE"],
    bio: "Chuyên luyện thi vào 10 & học sinh giỏi cấp 2-3, phương pháp bám sát đề thi thật.",
  },
  {
    id: "2",
    fullName: "Trần Thị Bích Ngọc",
    initials: "BN",
    subjects: ["Tiếng Anh"],
    region: "Cầu Giấy, Hà Nội",
    teachingMode: "ONLINE",
    hourlyRate: 220000,
    experienceYears: 6,
    educationLevel: "Cử nhân Ngôn ngữ Anh",
    ratingAvg: 5.0,
    ratingCount: 91,
    studentsAccepted: 54,
    badges: ["IDENTITY", "DEGREE", "EXPERIENCE"],
    bio: "IELTS 8.0, chuyên luyện giao tiếp & IELTS cho học sinh cấp 3 và người đi làm.",
  },
  {
    id: "3",
    fullName: "Phạm Quốc Huy",
    initials: "QH",
    subjects: ["Hóa", "Sinh"],
    region: "Quận 3, TP.HCM",
    teachingMode: "OFFLINE",
    hourlyRate: 150000,
    experienceYears: 2,
    educationLevel: "SV năm 3 - ĐH Y Dược",
    ratingAvg: 4.7,
    ratingCount: 24,
    studentsAccepted: 15,
    badges: ["IDENTITY", "STUDENT"],
    bio: "Dạy dễ hiểu, có giáo trình riêng bám sát sách giáo khoa hiện hành.",
  },
  {
    id: "4",
    fullName: "Lê Thu Hà",
    initials: "TH",
    subjects: ["Văn"],
    region: "Đống Đa, Hà Nội",
    teachingMode: "BOTH",
    hourlyRate: 170000,
    experienceYears: 8,
    educationLevel: "Thạc sĩ Ngữ Văn",
    ratingAvg: 4.8,
    ratingCount: 130,
    studentsAccepted: 80,
    badges: ["IDENTITY", "DEGREE", "EXPERIENCE"],
    bio: "Giáo viên trường chuyên, luyện viết nghị luận văn học & thi vào 10 chuyên Văn.",
  },
  {
    id: "5",
    fullName: "Đỗ Anh Tuấn",
    initials: "AT",
    subjects: ["Toán", "Tin học"],
    region: "Hải Châu, Đà Nẵng",
    teachingMode: "ONLINE",
    hourlyRate: 200000,
    experienceYears: 3,
    educationLevel: "SV năm 4 - ĐH Bách Khoa Đà Nẵng",
    ratingAvg: 4.6,
    ratingCount: 18,
    studentsAccepted: 12,
    badges: ["IDENTITY", "STUDENT"],
    bio: "Dạy Toán tư duy & lập trình cơ bản cho học sinh cấp 2, học online tương tác qua bảng vẽ.",
  },
  {
    id: "6",
    fullName: "Vũ Khánh Linh",
    initials: "KL",
    subjects: ["Tiếng Anh", "Toán"],
    region: "Quận 7, TP.HCM",
    teachingMode: "OFFLINE",
    hourlyRate: 160000,
    experienceYears: 5,
    educationLevel: "Cử nhân Sư phạm",
    ratingAvg: 4.9,
    ratingCount: 77,
    studentsAccepted: 45,
    badges: ["IDENTITY", "DEGREE", "EXPERIENCE"],
    bio: "Từng dạy tại trung tâm 5 năm, quen làm việc với học sinh mất gốc, kiên nhẫn và tận tâm.",
  },
];

export const SUBJECT_OPTIONS = ["Toán", "Tiếng Anh", "Văn", "Lý", "Hóa", "Sinh", "Tin học"];
export const REGION_OPTIONS = ["TP.HCM", "Hà Nội", "Đà Nẵng"];
