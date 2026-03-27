import { getMonth, getDate, getYear } from 'date-fns';

export interface SalaryDate {
    month: number; // 0-indexed
    day: number;
    year: number;
    message: string;
}

export const SALARY_DATES: SalaryDate[] = [
    // Group 1: "الربع شهر" (Quarter Month)
    { month: 0, day: 15, year: 2026, message: 'الربع شهر 💵' },
    { month: 1, day: 12, year: 2026, message: 'الربع شهر 💵' },
    { month: 2, day: 16, year: 2026, message: 'الربع شهر 💵' },
    { month: 3, day: 15, year: 2026, message: 'الربع شهر 💵' },
    { month: 4, day: 14, year: 2026, message: 'الربع شهر 💵' },
    { month: 5, day: 15, year: 2026, message: 'الربع شهر 💵' },
    { month: 6, day: 15, year: 2026, message: 'الربع شهر 💵' },
    { month: 7, day: 13, year: 2026, message: 'الربع شهر 💵' },
    { month: 8, day: 15, year: 2026, message: 'الربع شهر 💵' },
    { month: 9, day: 15, year: 2026, message: 'الربع شهر 💵' },
    { month: 10, day: 12, year: 2026, message: 'الربع شهر 💵' },
    { month: 11, day: 15, year: 2026, message: 'الربع شهر 💵' },

    // Group 2: "المرتب الشهري" (Monthly Salary)
    { month: 0, day: 28, year: 2026, message: 'المرتب الشهري 💵' },
    { month: 1, day: 25, year: 2026, message: 'المرتب الشهري 💵' },
    { month: 2, day: 30, year: 2026, message: 'المرتب الشهري 💵' },
    { month: 3, day: 28, year: 2026, message: 'المرتب الشهري 💵' },
    { month: 4, day: 25, year: 2026, message: 'المرتب الشهري 💵' },
    { month: 5, day: 29, year: 2026, message: 'المرتب الشهري 💵' },
    { month: 6, day: 29, year: 2026, message: 'المرتب الشهري 💵' },
    { month: 7, day: 27, year: 2026, message: 'المرتب الشهري 💵' },
    { month: 8, day: 28, year: 2026, message: 'المرتب الشهري 💵' },
    { month: 9, day: 28, year: 2026, message: 'المرتب الشهري 💵' },
    { month: 10, day: 26, year: 2026, message: 'المرتب الشهري 💵' },
    { month: 11, day: 28, year: 2026, message: 'المرتب الشهري 💵' },
];

export const getSalaryMessage = (date: Date): string | null => {
    const month = getMonth(date);
    const day = getDate(date);
    const year = getYear(date);
    const found = SALARY_DATES.find(s => s.month === month && s.day === day && s.year === year);
    return found ? found.message : null;
};

export const isSalaryDate = (date: Date): boolean => {
    return getSalaryMessage(date) !== null;
};
