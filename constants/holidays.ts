import { getMonth, getDate, getYear, subDays } from 'date-fns';

// --- Official Holidays for Egypt (2025-2035) ---
export interface Holiday {
    month: number; // 0-indexed (0 = January)
    day: number;
    year: number;
    name: string;
}

// Egyptian Official Holidays with corrected Islamic dates
export const OFFICIAL_HOLIDAYS: Holiday[] = [
    // ==================== 2025 ====================
    { month: 0, day: 7, year: 2025, name: 'عيد الميلاد المجيد' },
    { month: 0, day: 25, year: 2025, name: 'ثورة يناير / عيد الشرطة' },
    { month: 2, day: 31, year: 2025, name: 'عيد الفطر المبارك' }, // Mar 31
    { month: 3, day: 1, year: 2025, name: 'عيد الفطر المبارك' },
    { month: 3, day: 2, year: 2025, name: 'عيد الفطر المبارك' },
    { month: 3, day: 21, year: 2025, name: 'شم النسيم' },
    { month: 3, day: 25, year: 2025, name: 'عيد تحرير سيناء' },
    { month: 4, day: 1, year: 2025, name: 'عيد العمال' },
    { month: 5, day: 6, year: 2025, name: 'عيد الأضحى المبارك' }, // Jun 6 (Approx)
    { month: 5, day: 7, year: 2025, name: 'عيد الأضحى المبارك' },
    { month: 5, day: 8, year: 2025, name: 'عيد الأضحى المبارك' },
    { month: 5, day: 9, year: 2025, name: 'عيد الأضحى المبارك' },
    { month: 5, day: 27, year: 2025, name: 'رأس السنة الهجرية' },
    { month: 5, day: 30, year: 2025, name: 'ثورة 30 يونيو' },
    { month: 6, day: 23, year: 2025, name: 'عيد الثورة' },
    { month: 8, day: 5, year: 2025, name: 'المولد النبوي الشريف' },
    { month: 9, day: 6, year: 2025, name: 'عيد القوات المسلحة' },

    // ==================== 2026 ====================
    { month: 0, day: 7, year: 2026, name: 'عيد الميلاد المجيد' },
    { month: 0, day: 25, year: 2026, name: 'ثورة يناير / عيد الشرطة' },
    { month: 2, day: 20, year: 2026, name: 'عيد الفطر المبارك' }, // Mar 20
    { month: 2, day: 21, year: 2026, name: 'عيد الفطر المبارك' },
    { month: 2, day: 22, year: 2026, name: 'عيد الفطر المبارك' },
    { month: 3, day: 13, year: 2026, name: 'شم النسيم' },
    { month: 3, day: 25, year: 2026, name: 'عيد تحرير سيناء' },
    { month: 4, day: 1, year: 2026, name: 'عيد العمال' },
    { month: 4, day: 27, year: 2026, name: 'عيد الأضحى المبارك' },
    { month: 4, day: 28, year: 2026, name: 'عيد الأضحى المبارك' },
    { month: 4, day: 29, year: 2026, name: 'عيد الأضحى المبارك' },
    { month: 4, day: 30, year: 2026, name: 'عيد الأضحى المبارك' },
    { month: 5, day: 30, year: 2026, name: 'ثورة 30 يونيو' }, // Jun 30
    { month: 6, day: 17, year: 2026, name: 'رأس السنة الهجرية' },
    { month: 6, day: 23, year: 2026, name: 'عيد الثورة' },
    { month: 8, day: 24, year: 2026, name: 'المولد النبوي الشريف' },
    { month: 9, day: 6, year: 2026, name: 'عيد القوات المسلحة' },

    // ==================== 2027 ====================
    { month: 0, day: 7, year: 2027, name: 'عيد الميلاد المجيد' },
    { month: 0, day: 25, year: 2027, name: 'ثورة يناير / عيد الشرطة' },
    { month: 2, day: 10, year: 2027, name: 'عيد الفطر المبارك' }, // Mar 10
    { month: 2, day: 11, year: 2027, name: 'عيد الفطر المبارك' },
    { month: 2, day: 12, year: 2027, name: 'عيد الفطر المبارك' },
    { month: 3, day: 5, year: 2027, name: 'شم النسيم' },
    { month: 3, day: 25, year: 2027, name: 'عيد تحرير سيناء' },
    { month: 4, day: 1, year: 2027, name: 'عيد العمال' },
    { month: 4, day: 17, year: 2027, name: 'عيد الأضحى المبارك' },
    { month: 4, day: 18, year: 2027, name: 'عيد الأضحى المبارك' },
    { month: 4, day: 19, year: 2027, name: 'عيد الأضحى المبارك' },
    { month: 4, day: 20, year: 2027, name: 'عيد الأضحى المبارك' },
    { month: 5, day: 30, year: 2027, name: 'ثورة 30 يونيو' },
    { month: 6, day: 7, year: 2027, name: 'رأس السنة الهجرية' },
    { month: 6, day: 23, year: 2027, name: 'عيد الثورة' },
    { month: 8, day: 13, year: 2027, name: 'المولد النبوي الشريف' },
    { month: 9, day: 6, year: 2027, name: 'عيد القوات المسلحة' },

    // ==================== 2028 ====================
    { month: 0, day: 7, year: 2028, name: 'عيد الميلاد المجيد' },
    { month: 0, day: 25, year: 2028, name: 'ثورة يناير / عيد الشرطة' },
    { month: 1, day: 27, year: 2028, name: 'عيد الفطر المبارك' }, // Feb 27
    { month: 1, day: 28, year: 2028, name: 'عيد الفطر المبارك' },
    { month: 1, day: 29, year: 2028, name: 'عيد الفطر المبارك' },
    { month: 3, day: 17, year: 2028, name: 'شم النسيم' },
    { month: 3, day: 25, year: 2028, name: 'عيد تحرير سيناء' },
    { month: 4, day: 1, year: 2028, name: 'عيد العمال' },
    { month: 4, day: 5, year: 2028, name: 'عيد الأضحى المبارك' },
    { month: 4, day: 6, year: 2028, name: 'عيد الأضحى المبارك' },
    { month: 4, day: 7, year: 2028, name: 'عيد الأضحى المبارك' },
    { month: 4, day: 8, year: 2028, name: 'عيد الأضحى المبارك' },
    { month: 4, day: 26, year: 2028, name: 'رأس السنة الهجرية' },
    { month: 5, day: 30, year: 2028, name: 'ثورة 30 يونيو' },
    { month: 6, day: 23, year: 2028, name: 'عيد الثورة' },
    { month: 7, day: 2, year: 2028, name: 'المولد النبوي الشريف' },
    { month: 9, day: 6, year: 2028, name: 'عيد القوات المسلحة' },

    // ==================== 2029 ====================
    { month: 0, day: 7, year: 2029, name: 'عيد الميلاد المجيد' },
    { month: 0, day: 25, year: 2029, name: 'ثورة يناير / عيد الشرطة' },
    { month: 1, day: 15, year: 2029, name: 'عيد الفطر المبارك' }, // Feb 15
    { month: 1, day: 16, year: 2029, name: 'عيد الفطر المبارك' },
    { month: 1, day: 17, year: 2029, name: 'عيد الفطر المبارك' },
    { month: 3, day: 9, year: 2029, name: 'شم النسيم' },
    { month: 3, day: 24, year: 2029, name: 'عيد الأضحى المبارك' },
    { month: 3, day: 25, year: 2029, name: 'عيد الأضحى المبارك / عيد تحرير سيناء' },
    { month: 3, day: 26, year: 2029, name: 'عيد الأضحى المبارك' },
    { month: 3, day: 27, year: 2029, name: 'عيد الأضحى المبارك' },
    { month: 4, day: 1, year: 2029, name: 'عيد العمال' },
    { month: 4, day: 16, year: 2029, name: 'رأس السنة الهجرية' },
    { month: 5, day: 30, year: 2029, name: 'ثورة 30 يونيو' },
    { month: 6, day: 22, year: 2029, name: 'المولد النبوي الشريف' }, // Jun 22 approx
    { month: 6, day: 23, year: 2029, name: 'عيد الثورة' },
    { month: 9, day: 6, year: 2029, name: 'عيد القوات المسلحة' },

    // ==================== 2030 ====================
    { month: 0, day: 7, year: 2030, name: 'عيد الميلاد المجيد' },
    { month: 0, day: 25, year: 2030, name: 'ثورة يناير / عيد الشرطة' },
    { month: 1, day: 5, year: 2030, name: 'عيد الفطر المبارك' }, // Feb 5
    { month: 1, day: 6, year: 2030, name: 'عيد الفطر المبارك' },
    { month: 1, day: 7, year: 2030, name: 'عيد الفطر المبارك' },
    { month: 3, day: 14, year: 2030, name: 'عيد الأضحى المبارك' }, // Apr 14
    { month: 3, day: 15, year: 2030, name: 'عيد الأضحى المبارك' },
    { month: 3, day: 16, year: 2030, name: 'عيد الأضحى المبارك' },
    { month: 3, day: 17, year: 2030, name: 'عيد الأضحى المبارك' },
    { month: 3, day: 28, year: 2030, name: 'شم النسيم' },
    { month: 3, day: 25, year: 2030, name: 'عيد تحرير سيناء' },
    { month: 4, day: 1, year: 2030, name: 'عيد العمال' },
    { month: 4, day: 5, year: 2030, name: 'رأس السنة الهجرية' },
    { month: 5, day: 30, year: 2030, name: 'ثورة 30 يونيو' },
    { month: 6, day: 12, year: 2030, name: 'المولد النبوي الشريف' },
    { month: 6, day: 23, year: 2030, name: 'عيد الثورة' },
    { month: 9, day: 6, year: 2030, name: 'عيد القوات المسلحة' },

    // ==================== 2031 ====================
    { month: 0, day: 7, year: 2031, name: 'عيد الميلاد المجيد' },
    { month: 0, day: 25, year: 2031, name: 'ثورة يناير / عيد الشرطة' },
    { month: 0, day: 25, year: 2031, name: 'عيد الفطر المبارك' }, // Jan 25
    { month: 0, day: 26, year: 2031, name: 'عيد الفطر المبارك' }, // Jan 26
    { month: 0, day: 27, year: 2031, name: 'عيد الفطر المبارك' },
    { month: 3, day: 3, year: 2031, name: 'عيد الأضحى المبارك' }, // Apr 3
    { month: 3, day: 4, year: 2031, name: 'عيد الأضحى المبارك' },
    { month: 3, day: 5, year: 2031, name: 'عيد الأضحى المبارك' },
    { month: 3, day: 6, year: 2031, name: 'عيد الأضحى المبارك' },
    { month: 3, day: 14, year: 2031, name: 'شم النسيم' },
    { month: 3, day: 23, year: 2031, name: 'رأس السنة الهجرية' },
    { month: 3, day: 25, year: 2031, name: 'عيد تحرير سيناء' },
    { month: 4, day: 1, year: 2031, name: 'عيد العمال' },
    { month: 5, day: 30, year: 2031, name: 'ثورة 30 يونيو' },
    { month: 6, day: 2, year: 2031, name: 'المولد النبوي الشريف' },
    { month: 6, day: 23, year: 2031, name: 'عيد الثورة' },
    { month: 9, day: 6, year: 2031, name: 'عيد القوات المسلحة' },

    // ==================== 2032 ====================
    { month: 0, day: 7, year: 2032, name: 'عيد الميلاد المجيد' },
    { month: 0, day: 14, year: 2032, name: 'عيد الفطر المبارك' }, // Jan 15
    { month: 0, day: 15, year: 2032, name: 'عيد الفطر المبارك' },
    { month: 0, day: 16, year: 2032, name: 'عيد الفطر المبارك' },
    { month: 0, day: 25, year: 2032, name: 'ثورة يناير / عيد الشرطة' },
    { month: 2, day: 22, year: 2032, name: 'عيد الأضحى المبارك' }, // Mar 22
    { month: 2, day: 23, year: 2032, name: 'عيد الأضحى المبارك' },
    { month: 2, day: 24, year: 2032, name: 'عيد الأضحى المبارك' },
    { month: 2, day: 25, year: 2032, name: 'عيد الأضحى المبارك' },
    { month: 3, day: 11, year: 2032, name: 'رأس السنة الهجرية' },
    { month: 3, day: 25, year: 2032, name: 'عيد تحرير سيناء' },
    { month: 4, day: 1, year: 2032, name: 'عيد العمال' },
    { month: 4, day: 20, year: 2032, name: 'المولد النبوي الشريف' },
    { month: 5, day: 30, year: 2032, name: 'ثورة 30 يونيو' },
    { month: 6, day: 23, year: 2032, name: 'عيد الثورة' },
    { month: 9, day: 6, year: 2032, name: 'عيد القوات المسلحة' },

    // ==================== 2033 ====================
    { month: 0, day: 4, year: 2033, name: 'عيد الفطر المبارك' }, // Jan 4
    { month: 0, day: 5, year: 2033, name: 'عيد الفطر المبارك' },
    { month: 0, day: 6, year: 2033, name: 'عيد الفطر المبارك' },
    { month: 0, day: 7, year: 2033, name: 'عيد الميلاد المجيد' },
    { month: 0, day: 25, year: 2033, name: 'ثورة يناير / عيد الشرطة' },
    { month: 2, day: 11, year: 2033, name: 'عيد الأضحى المبارك' }, // Mar 11
    { month: 2, day: 12, year: 2033, name: 'عيد الأضحى المبارك' },
    { month: 2, day: 13, year: 2033, name: 'عيد الأضحى المبارك' },
    { month: 2, day: 14, year: 2033, name: 'عيد الأضحى المبارك' },
    { month: 3, day: 1, year: 2033, name: 'رأس السنة الهجرية' },
    { month: 3, day: 25, year: 2033, name: 'شم النسيم' },
    { month: 3, day: 25, year: 2033, name: 'عيد تحرير سيناء' },
    { month: 4, day: 1, year: 2033, name: 'عيد العمال' },
    { month: 4, day: 10, year: 2033, name: 'المولد النبوي الشريف' },
    { month: 5, day: 30, year: 2033, name: 'ثورة 30 يونيو' },
    { month: 6, day: 23, year: 2033, name: 'عيد الثورة' },
    { month: 9, day: 6, year: 2033, name: 'عيد القوات المسلحة' },
    { month: 11, day: 23, year: 2033, name: 'عيد الفطر المبارك' }, // Dec 23 (Second Eid)
    { month: 11, day: 24, year: 2033, name: 'عيد الفطر المبارك' },
    { month: 11, day: 25, year: 2033, name: 'عيد الفطر المبارك' },



];

// Ramadan periods: Calculated to end EXACTLY 1 day before Eid al-Fitr starts
interface RamadanPeriod {
    year: number;
    startMonth: number; // 0-indexed
    startDay: number;
    endMonth: number;   // 0-indexed
    endDay: number;
}

const RAMADAN_PERIODS: RamadanPeriod[] = [
    { year: 2025, startMonth: 2, startDay: 1, endMonth: 2, endDay: 30 },     // Mar 1 - Mar 30 (Eid Mar 31)
    { year: 2026, startMonth: 1, startDay: 18, endMonth: 2, endDay: 19 },    // Feb 18 - Mar 19 (Eid Mar 20)
    { year: 2027, startMonth: 1, startDay: 8, endMonth: 2, endDay: 9 },      // Feb 8 - Mar 9 (Eid Mar 10)
    { year: 2028, startMonth: 0, startDay: 28, endMonth: 1, endDay: 26 },    // Jan 28 - Feb 26 (Eid Feb 27)
    { year: 2029, startMonth: 0, startDay: 16, endMonth: 1, endDay: 14 },    // Jan 16 - Feb 14 (Eid Feb 15)
    { year: 2030, startMonth: 0, startDay: 6, endMonth: 1, endDay: 4 },      // Jan 6 - Feb 4 (Eid Feb 5)
    // 2030 Second Ramadan starts Dec 26, 2030 -> Ends Jan 24, 2031 (Eid Jan 25)
    { year: 2030, startMonth: 11, startDay: 26, endMonth: 11, endDay: 31 },  // Dec 26 - Dec 31
    { year: 2031, startMonth: 0, startDay: 1, endMonth: 0, endDay: 24 },     // Jan 1 - Jan 24 (Eid Jan 25)
    // 2031 Ramadan starts Dec 16, 2031 -> Ends Jan 14, 2032 (Eid Jan 15)
    { year: 2031, startMonth: 11, startDay: 16, endMonth: 11, endDay: 31 },  // Dec 16 - Dec 31
    { year: 2032, startMonth: 0, startDay: 1, endMonth: 0, endDay: 14 },     // Jan 1 - Jan 14 (Eid Jan 15)
    // 2032 Ramadan starts Dec 5, 2032 -> Ends Jan 3, 2033 (Eid Jan 4)
    { year: 2032, startMonth: 11, startDay: 5, endMonth: 11, endDay: 31 },   // Dec 5 - Dec 31
    { year: 2033, startMonth: 0, startDay: 1, endMonth: 0, endDay: 3 },      // Jan 1 - Jan 3 (Eid Jan 4)
    // 2033 Second Ramadan starts Nov 23, 2033 -> Ends Dec 22, 2033 (Eid Dec 23)
    { year: 2033, startMonth: 10, startDay: 23, endMonth: 11, endDay: 22 },  // Nov 23 - Dec 22
];


/**
 * Check if a date is an official holiday
 */
export const isOfficialHoliday = (date: Date): boolean => {
    const month = getMonth(date);
    const day = getDate(date);
    const year = getYear(date);
    return OFFICIAL_HOLIDAYS.some(h => h.month === month && h.day === day && h.year === year);
};

/**
 * Get the holiday name for a specific date
 */
export const getHolidayName = (date: Date): string | null => {
    const month = getMonth(date);
    const day = getDate(date);
    const year = getYear(date);
    const holiday = OFFICIAL_HOLIDAYS.find(h => h.month === month && h.day === day && h.year === year);
    return holiday ? holiday.name : null;
};

/**
 * Check if a holiday should be highlighted (first day only for Eids)
 */
export const isHighlightHoliday = (date: Date): boolean => {
    const name = getHolidayName(date);
    if (!name) return false;

    // For Eids, only highlight the first day
    if (name === 'عيد الفطر المبارك' || name === 'عيد الأضحى المبارك') {
        const prevDate = subDays(date, 1);
        const prevName = getHolidayName(prevDate);
        if (prevName === name) {
            return false;
        }
    }

    return true;
};

/**
 * Get holidays for a specific year
 */
export const getHolidaysForYear = (year: number): Holiday[] => {
    return OFFICIAL_HOLIDAYS.filter(h => h.year === year);
};

/**
 * Check if a date is during Ramadan
 */
export const isRamadan = (date: Date): boolean => {
    const year = getYear(date);
    const month = getMonth(date);
    const day = getDate(date);

    return RAMADAN_PERIODS.some(period => {
        if (period.year !== year) return false;

        // Same month range
        if (period.startMonth === period.endMonth) {
            return month === period.startMonth && day >= period.startDay && day <= period.endDay;
        }

        // Cross-month range
        if (month === period.startMonth && day >= period.startDay) return true;
        if (month === period.endMonth && day <= period.endDay) return true;
        if (month > period.startMonth && month < period.endMonth) return true;

        return false;
    });
};

/**
 * Check if a date is the first day of Ramadan
 */
export const isRamadanStart = (date: Date): boolean => {
    const year = getYear(date);
    const month = getMonth(date);
    const day = getDate(date);

    return RAMADAN_PERIODS.some(period =>
        period.year === year && period.startMonth === month && period.startDay === day
    );
};
