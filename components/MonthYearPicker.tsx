import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { setMonth, setYear, format } from 'date-fns';
import { arEG } from 'date-fns/locale';

interface MonthYearPickerProps {
  isOpen: boolean;
  onClose: () => void;
  currentDate: Date;
  onChange: (date: Date) => void;
}

const MONTHS = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
];

const MonthYearPicker: React.FC<MonthYearPickerProps> = ({ isOpen, onClose, currentDate, onChange }) => {
  const [year, setYearState] = useState(currentDate.getFullYear());

  // Reset year to current view year when modal opens
  useEffect(() => {
    if (isOpen) {
      setYearState(currentDate.getFullYear());
    }
  }, [isOpen, currentDate]);

  if (!isOpen) return null;

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = setMonth(setYear(currentDate, year), monthIndex);
    onChange(newDate);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
        <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <Calendar size={20} />
            <h3 className="font-bold">اختر التاريخ</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-blue-700 rounded-full transition">
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          {/* Year Selector */}
          <div className="flex items-center justify-between bg-gray-50 p-2 rounded-xl mb-4 border border-gray-200">
            <button
              onClick={() => setYearState(y => y - 1)}
              className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition text-blue-600"
            >
              <ChevronRight size={20} />
            </button>
            <span className="text-xl font-bold text-gray-800">{year}</span>
            <button
              onClick={() => setYearState(y => y + 1)}
              className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition text-blue-600"
            >
              <ChevronLeft size={20} />
            </button>
          </div>

          {/* Months Grid */}
          <div className="grid grid-cols-3 gap-3">
            {MONTHS.map((month, index) => (
              <button
                key={month}
                onClick={() => handleMonthSelect(index)}
                className={`
                  p-3 rounded-xl text-sm font-bold transition-all
                  ${index === currentDate.getMonth() && year === currentDate.getFullYear()
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-100'}
                `}
              >
                {month}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthYearPicker;