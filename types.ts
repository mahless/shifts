export type Group = 'A' | 'B' | 'C' | 'D';
export type ShiftSystem = 'WARADI' | 'NAHARI';

export enum ShiftType {
  FIRST = 'FIRST',   // اولى
  SECOND = 'SECOND', // ثانية
  THIRD = 'THIRD',   // ثالثة
  REST = 'REST'      // راحة
}

export enum LeaveType {
  ANNUAL = 'ANNUAL', // سنوي
  CASUAL = 'CASUAL', // عارضة
  SICK = 'SICK',     // SN
  PERMISSION_1 = 'PERMISSION_1', // إذن 1س
  PERMISSION_2 = 'PERMISSION_2', // إذن 2س
  PERMISSION_3 = 'PERMISSION_3', // إذن 3س
  NONE = 'NONE'      // لا يوجد
}

export interface DayShift {
  date: Date;
  shifts: Record<Group, ShiftType>;
}

export interface Note {
  text: string;
  image?: string; // Base64 or local file path
}

export interface AppState {
  leaves: Record<string, LeaveType>; // Key: "YYYY-MM-DD-GROUP"
  notes: Record<string, Note>;       // Key: "YYYY-MM-DD-GROUP"
  totalBalance: number;
  hijriOffset?: number;
  shiftSystem?: ShiftSystem;
  restDays?: number[]; // 0-6 (Sunday to Saturday)
}

export const CYCLE_LENGTH = 20;

// Shift Cycle: 5 days 3rd, 2 days Rest, 5 days 2nd, 2 days Rest, 5 days 1st, 1 day Rest
export const SHIFT_SEQUENCE: ShiftType[] = [
  // 5 days 3rd (Third)
  ShiftType.THIRD, ShiftType.THIRD, ShiftType.THIRD, ShiftType.THIRD, ShiftType.THIRD,
  // 2 days Rest
  ShiftType.REST, ShiftType.REST,
  // 5 days 2nd (Second)
  ShiftType.SECOND, ShiftType.SECOND, ShiftType.SECOND, ShiftType.SECOND, ShiftType.SECOND,
  // 2 days Rest
  ShiftType.REST, ShiftType.REST,
  // 5 days 1st (First)
  ShiftType.FIRST, ShiftType.FIRST, ShiftType.FIRST, ShiftType.FIRST, ShiftType.FIRST,
  // 1 day Rest
  ShiftType.REST
];