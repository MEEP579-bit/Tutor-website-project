export interface SubjectGroup {
  category: string;
  subjects: string[];
}

// Nhóm môn học cho bộ chọn môn (popover) — giữ nguyên tên môn cũ để không phá dữ liệu đã lưu
export const SUBJECT_GROUPS: SubjectGroup[] = [
  {
    category: "Văn hóa",
    subjects: ["Toán", "Văn", "Lý", "Hóa", "Sinh", "Sử", "Địa", "GDCD", "Tin học"],
  },
  {
    category: "Ngoại ngữ & Chứng chỉ",
    subjects: [
      "Tiếng Anh",
      "IELTS",
      "TOEIC",
      "TOEFL",
      "Tiếng Trung",
      "HSK",
      "Tiếng Nhật",
      "JLPT",
      "Tiếng Hàn",
      "TOPIK",
      "Tiếng Pháp",
    ],
  },
  {
    category: "Năng khiếu",
    subjects: ["Piano", "Guitar", "Vẽ", "Thanh nhạc", "Cờ vua", "MC - Thuyết trình"],
  },
];

// Danh sách phẳng — dùng cho nơi chưa cần phân nhóm (validate...)
export const SUBJECT_OPTIONS = SUBJECT_GROUPS.flatMap((g) => g.subjects);

// Lớp học — chọn TỪNG LỚP CỤ THỂ (không gộp khối), gom nhóm theo cấp học chỉ để hiển thị dễ nhìn
export interface ClassGroupOption {
  value: string;
  label: string;
}

export interface ClassCategory {
  category: string;
  classes: ClassGroupOption[];
}

export const CLASS_CATEGORIES: ClassCategory[] = [
  {
    category: "Tiểu học",
    classes: [1, 2, 3, 4, 5].map((n) => ({ value: `LOP_${n}`, label: `Lớp ${n}` })),
  },
  {
    category: "THCS",
    classes: [6, 7, 8, 9].map((n) => ({ value: `LOP_${n}`, label: `Lớp ${n}` })),
  },
  {
    category: "THPT",
    classes: [10, 11, 12].map((n) => ({ value: `LOP_${n}`, label: `Lớp ${n}` })),
  },
  {
    category: "Khác",
    classes: [
      { value: "SINH_VIEN", label: "Sinh viên đại học" },
      { value: "NGUOI_LON", label: "Người lớn / Đi làm" },
    ],
  },
];

// Danh sách phẳng — dùng để tra label theo value (hiển thị card, danh sách yêu cầu...)
export const CLASS_GROUPS: ClassGroupOption[] = CLASS_CATEGORIES.flatMap((c) => c.classes);
