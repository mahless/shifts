import { getMonth, getDate, getYear } from 'date-fns';

export interface SalaryDate {
    month: number; // 0-indexed
    day: number;
    year: number;
    message: string;
}

export let SALARY_DATES: SalaryDate[] = [];

export const setSalaryDates = (newData: SalaryDate[]) => {
    if (newData && newData.length > 0) {
        SALARY_DATES = newData;
    }
};

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
