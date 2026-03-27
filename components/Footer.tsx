import React from 'react';
import { Calendar as CalendarIcon, Info } from 'lucide-react';

interface FooterProps {
    remainingBalance: number | '';
    totalBalance: number | '';
    currentYear: number;
    onTotalBalanceChange: (value: number | '') => void;
    onOpenHolidays: () => void;
    onOpenLeaveDetails: () => void;
}

const Footer: React.FC<FooterProps> = ({
    remainingBalance,
    totalBalance,
    currentYear,
    onTotalBalanceChange,
    onOpenHolidays,
    onOpenLeaveDetails
}) => {
    return (
        <div className="bg-white border-t border-gray-200 p-4 pb-safe rounded-3xl shadow-[0_-4px_20px_rgba(255,140,0,0.3)] mt-6 mx-2 mb-2">
            <div className="flex items-center justify-between gap-2 mb-4">
                {/* Total Balance - Right side */}
                <div className="flex-1">
                    <label className="text-xs text-gray-500 font-bold block mb-1">إجمالي الرصيد</label>
                    <input
                        type="number"
                        value={totalBalance}
                        lang="en"
                        dir="ltr"
                        inputMode="decimal"
                        onChange={(e) => onTotalBalanceChange(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full bg-gray-50 text-blue-700 font-bold text-center py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-gray-400"
                    />
                </div>
                {/* Remaining Balance - Middle */}
                <div className="flex-1">
                    <label className="text-xs text-gray-500 font-bold block mb-1">الرصيد المتبقي</label>
                    <div className="bg-blue-50 text-blue-700 font-bold text-center py-2 rounded-xl border border-blue-200">
                        {remainingBalance} يوم
                    </div>
                </div>
                {/* Details Button - Left side */}
                <div className="flex-shrink-0">
                    <label className="text-xs text-gray-500 font-bold block mb-1 opacity-0">.</label>
                    <button
                        onClick={onOpenLeaveDetails}
                        className="bg-orange-500 text-white font-bold py-2 px-3 rounded-xl hover:bg-orange-600 transition flex items-center gap-1 text-sm"
                    >
                        <Info size={16} />
                        تفاصيل
                    </button>
                </div>
            </div>

            <button
                onClick={onOpenHolidays}
                className="w-full bg-green-600/25 text-green-700 font-bold py-3 rounded-xl mb-3 flex items-center justify-center gap-2 shadow-lg shadow-green-200 border border-green-600"
            >
                <CalendarIcon size={18} />
                أجازات {currentYear} الرسمية
            </button>

            <p className="text-center text-xs text-black mt-2">
                المطور : محمد ابراهيم محليس
            </p>

        </div >
    );
};

export default Footer;
