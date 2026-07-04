import { getMonth, getDate, getYear, subDays } from 'date-fns';

export interface Holiday {
    month: number;
    day: number;
    year: number;
    name: string;
}

export let OFFICIAL_HOLIDAYS: Holiday[] = [];

export const setOfficialHolidays = (newData: Holiday[]) => {
    if (newData && newData.length > 0) {
        OFFICIAL_HOLIDAYS = newData;
    }
};

interface RamadanPeriod {
    year: number;
    startMonth: number;
    startDay: number;
    endMonth: number;
    endDay: number;
}

const RAMADAN_PERIODS: RamadanPeriod[] = [
    { year: 2026, startMonth: 1, startDay: 18, endMonth: 2, endDay: 19 },    // Feb 18 - Mar 19 (Eid Mar 20)
    { year: 2027, startMonth: 1, startDay: 8, endMonth: 2, endDay: 9 },      // Feb 8 - Mar 9 (Eid Mar 10)
    { year: 2028, startMonth: 0, startDay: 28, endMonth: 1, endDay: 26 },    // Jan 28 - Feb 26 (Eid Feb 27)
    { year: 2029, startMonth: 0, startDay: 16, endMonth: 1, endDay: 14 },    // Jan 16 - Feb 14 (Eid Feb 15)
    { year: 2030, startMonth: 0, startDay: 6, endMonth: 1, endDay: 4 },      // Jan 6 - Feb 4 (Eid Feb 5)
    { year: 2030, startMonth: 11, startDay: 26, endMonth: 11, endDay: 31 },  // Dec 26 - Dec 31
];

export const isOfficialHoliday = (date: Date): boolean => {
    const month = getMonth(date);
    const day = getDate(date);
    const year = getYear(date);
    return OFFICIAL_HOLIDAYS.some(h => h.month === month && h.day === day && h.year === year);
};

export const getHolidayName = (date: Date): string | null => {
    const month = getMonth(date);
    const day = getDate(date);
    const year = getYear(date);
    const holiday = OFFICIAL_HOLIDAYS.find(h => h.month === month && h.day === day && h.year === year);
    return holiday ? holiday.name : null;
};

export const isHighlightHoliday = (date: Date): boolean => {
    const name = getHolidayName(date);
    if (!name) return false;

    if (name === 'عيد الفطر المبارك' || name === 'عيد الأضحى المبارك') {
        const prevDate = subDays(date, 1);
        const prevName = getHolidayName(prevDate);
        if (prevName === name) {
            return false;
        }
    }

    return true;
};

export const getHolidaysForYear = (year: number): Holiday[] => {
    return OFFICIAL_HOLIDAYS.filter(h => h.year === year);
};

export const isRamadan = (date: Date): boolean => {
    const year = getYear(date);
    const month = getMonth(date);
    const day = getDate(date);

    return RAMADAN_PERIODS.some(period => {
        if (period.year !== year) return false;

        if (period.startMonth === period.endMonth) {
            return month === period.startMonth && day >= period.startDay && day <= period.endDay;
        }

        if (month === period.startMonth && day >= period.startDay) return true;
        if (month === period.endMonth && day <= period.endDay) return true;
        if (month > period.startMonth && month < period.endMonth) return true;

        return false;
    });
};

export const isRamadanStart = (date: Date): boolean => {
    const year = getYear(date);
    const month = getMonth(date);
    const day = getDate(date);

    return RAMADAN_PERIODS.some(period =>
        period.year === year && period.startMonth === month && period.startDay === day
    );
};
