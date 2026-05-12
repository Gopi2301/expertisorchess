// ── Enums ────────────────────────────────────────────────────────────────────

export type Status = 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'REJECTED';
export type ClassStatus = 'DRAFT' | 'PUBLISHED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
export type EnrollmentStatus = 'PENDING' | 'CONFIRMED' | 'DECLINED';
export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
export type ChessLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
export type PlanType = 'INDIVIDUAL' | 'GROUP';
export type StudentRelation = 'PARENT' | 'GUARDIAN' | 'SELF' | 'OTHER';

// ── Entities ─────────────────────────────────────────────────────────────────

export interface Coach {
  id: string;
  keycloak_user_id: string;
  name: string;
  email: string;
  phone?: string;
  fide_rating?: number;
  rapid_rating?: number;
  blitz_rating?: number;
  experience_years?: number;
  bio?: string;
  hourly_rate?: number;
  current_syllabus?: string;
  availability_json?: AvailabilityJson;
  status: Status;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface Client {
  id: string;
  keycloak_user_id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  students?: Student[];
  _count?: {
    students: number;
  };
}

export interface Student {
  id: string;
  client_id: string;
  name: string;
  age?: number;
  chess_level: ChessLevel;
  current_rating?: number;
  goals?: string;
  email?: string;
  phone?: string;
  status: Status;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  created_by?: string;
  relation_to_client: StudentRelation;
  client?: Client;
}

export interface Plan {
  id: string;
  name: string;
  type: PlanType;
  classes_per_month: number;
  duration_minutes: number;
  min_students: number;
  max_students: number;
  price: string;
  status: Status;
  created_at: string;
  updated_at: string;
}

export interface Syllabus {
  id: string;
  title: string;
  description?: string;
  created_at: string;
  updated_at: string;
  classes?: Class[];
}

export interface Class {
  id: string;
  coach_id: string;
  plan_id: string;
  batch_id?: string;
  syllabus_id?: string;
  title: string;
  class_type: PlanType;
  meeting_link?: string;
  scheduled_start: string;
  scheduled_end: string;
  max_students: number;
  status: ClassStatus;
  is_recorded: boolean;
  recording_url?: string;
  created_at: string;
  updated_at: string;
  coach?: Coach;
  plan?: Plan;
  batch?: Batch;
  syllabus?: Syllabus;
  students?: StudentClass[];
  _count?: {
    students: number;
  };
}

export interface StudentClass {
  id: string;
  student_id: string;
  class_id: string;
  enrolled_at: string;
  status: Status;
  enrollment_status: EnrollmentStatus;
  student?: Student;
  class?: Class;
}

export interface Batch {
  id: string;
  title: string;
  coach_id: string;
  plan_id: string;
  syllabus_id?: string;
  status: Status;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  coach?: Coach;
  plan?: Plan;
  syllabus?: Syllabus;
  classes?: Class[];
  students?: BatchStudent[];
  _count?: {
    students: number;
    classes: number;
  };
}

export interface BatchStudent {
  id: string;
  batch_id: string;
  student_id: string;
  enrolled_at: string;
  status: Status;
  batch?: Batch;
  student?: Student;
}

export interface Attendance {
  id: string;
  student_id?: string;
  coach_id?: string;
  class_id: string;
  attendance_status: AttendanceStatus;
  remarks?: string;
  marked_by: string;
  created_at: string;
  updated_at: string;
  student?: Student;
  coach?: Coach;
}

// ── Availability ──────────────────────────────────────────────────────────────

export interface TimeSlot {
  start: string;
  end: string;
}

export interface AvailabilityJson {
  monday: TimeSlot[];
  tuesday: TimeSlot[];
  wednesday: TimeSlot[];
  thursday: TimeSlot[];
  friday: TimeSlot[];
  saturday: TimeSlot[];
  sunday: TimeSlot[];
}

// ── API Response Envelopes ────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
  path: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: PaginationMeta;
  timestamp: string;
  path: string;
}

export interface ApiError {
  success: false;
  statusCode: number;
  error: string;
  message: string;
  timestamp: string;
  path: string;
}

// ── Filters ───────────────────────────────────────────────────────────────────

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

export interface DashboardSummary {
  totalCoaches: number;
  totalClients: number;
  totalStudents: number;
  totalClasses: number;
  activeClasses: number;
  revenueEstimate?: string;
  attendancePercentage?: number;
}
