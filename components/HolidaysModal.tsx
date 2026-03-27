import React from 'react';
import { X, CalendarHeart } from 'lucide-react';
import { getHolidaysForYear } from '../constants/holidays';

interface HolidaysModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentYear: number;
}

const MONTHS_AR = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
];

const HolidaysModal: React.FC<HolidaysModalProps> = ({ isOpen, onClose, currentYear }) => {
  if (!isOpen) return null;

  const allHolidays = getHolidaysForYear(currentYear);

  // Filter to show only first day of multi-day holidays (Eid al-Fitr, Eid al-Adha)
  const seenHolidays = new Set<string>();
  const holidays = allHolidays.filter(holiday => {
    // Check if this is a multi-day holiday we've already seen
    if (holiday.name === 'عيد الفطر المبارك' || holiday.name === 'عيد الأضحى المبارك') {
      if (seenHolidays.has(holiday.name)) {
        return false; // Skip subsequent days
      }
      seenHolidays.add(holiday.name);
    }
    return true;
  });

  // Format holiday date
  const formatDate = (day: number, month: number) => {
    return `${day} ${MONTHS_AR[month]}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden transform transition-all scale-100 max-h-[80vh] flex flex-col">
        <div className="bg-green-600 p-4 flex justify-between items-center text-white shrink-0">
          <div className="flex items-center gap-2">
            <CalendarHeart size={24} />
            <h3 className="font-bold text-lg">العطلات الرسمية {currentYear}</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-green-700 rounded-full transition">
            <X size={24} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto custom-scrollbar">
          {holidays.length > 0 ? (
            <div className="space-y-3">
              {holidays.map((holiday, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-100 hover:bg-green-100 transition">
                  <span className="font-bold text-green-900 text-sm">{holiday.name}</span>
                  <span className="text-xs bg-white text-green-600 px-2 py-1 rounded-lg border border-green-200 font-bold whitespace-nowrap">
                    {formatDate(holiday.day, holiday.month)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">لا توجد عطلات مسجلة لهذه السنة</p>
          )}
          <p className="text-xs text-gray-400 text-center mt-4">
            * التواريخ الإسلامية محسوبة فلكياً وقد تختلف حسب الرؤية الشرعية.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HolidaysModal;