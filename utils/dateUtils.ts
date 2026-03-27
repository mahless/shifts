import { differenceInCalendarDays, addDays, format } from 'date-fns';
import { Group, ShiftType, SHIFT_SEQUENCE, CYCLE_LENGTH, ShiftSystem } from '../types';

// Reference Date: December 11, 2025
const REF_DATE = new Date(2025, 11, 11); // Month is 0-indexed in JS Date (11 = Dec)

// Known state on Ref Date (0-based index in the sequence array)
// A: 1st day of 2nd Shift (Starts at index 7) -> Index 7
// B: 4th day of 1st Shift (Starts at index 14) -> Index 17 (14 + 3)
// C: 3rd day of 3rd Shift (Starts at index 0) -> Index 2 (0 + 2)
// D: 1st day of Rest after 2nd Shift (Starts at index 12) -> Index 12

const REF_INDICES: Record<Group, number> = {
  'A': 7,
  'B': 17,
  'C': 2,
  'D': 12
};

export const getShiftForGroup = (date: Date, group: Group, system: ShiftSystem = 'WARADI', restDays: number[] = [5, 6]): ShiftType => {
  if (system === 'NAHARI') {
    const dayOfWeek = date.getDay(); // 0 (Sun) to 6 (Sat)
    if (restDays.includes(dayOfWeek)) {
      return ShiftType.REST;
    }
    return ShiftType.FIRST;
  }
  const diffDays = differenceInCalendarDays(date, REF_DATE);

  // Calculate raw index
  let index = (REF_INDICES[group] + diffDays) % CYCLE_LENGTH;

  // Handle negative modulo for past dates
  if (index < 0) {
    index += CYCLE_LENGTH;
  }

  return SHIFT_SEQUENCE[index];
};

export const getShiftLabel = (shift: ShiftType): string => {
  switch (shift) {
    case ShiftType.FIRST: return 'أولى';
    case ShiftType.SECOND: return 'ثانيه';
    case ShiftType.THIRD: return 'ثالثة';
    case ShiftType.REST: return 'راحه';
    default: return '';
  }
};

export const getLeaveLabel = (leave: string): string => {
  switch (leave) {
    case 'ANNUAL': return 'سنوي';
    case 'CASUAL': return 'عارضة';
    case 'SICK': return 'SN';
    case 'PERMISSION_1': return 'إذن 1س';
    case 'PERMISSION_2': return 'إذن 2س';
    case 'PERMISSION_3': return 'إذن 3س';
    default: return '';
  }
}

export const formatDateKey = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

export const getLeaveKey = (date: Date, group: Group): string => {
  return `${formatDateKey(date)}-${group}`;
};