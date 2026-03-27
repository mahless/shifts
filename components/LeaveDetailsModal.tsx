import React, { useState } from 'react';
import { X, Calendar, List } from 'lucide-react';
import { LeaveType } from '../types';
import { format, parseISO, compareAsc } from 'date-fns';
import { arEG } from 'date-fns/locale';

interface LeaveDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    leaves: Record<string, LeaveType>;
    currentYear: number;
}

const LeaveDetailsModal: React.FC<LeaveDetailsModalProps> = ({ isOpen, onClose, leaves, currentYear }) => {
    const [showLog, setShowLog] = useState(false);

    if (!isOpen) return null;

    // Count leaves by type for current year and collect dates
    const leaveData = Object.entries(leaves).reduce((acc, [key, type]) => {
        // Key format: YYYY-MM-DD-GROUP
        const datePart = key.substring(0, 10);
        const date = parseISO(datePart);
        const year = date.getFullYear();

        if (year === currentYear) {
            if (type === LeaveType.ANNUAL) {
                acc.counts.annual += 1;
                acc.dates.push({ date, type: 'سنوي' });
            } else if (type === LeaveType.CASUAL) {
                acc.counts.casual += 1;
                acc.dates.push({ date, type: 'عارضة' });
            } else if (type === LeaveType.SICK) {
                acc.counts.sick += 1;
                acc.dates.push({ date, type: 'SN' });
            } else if (type === LeaveType.PERMISSION_1) {
                acc.counts.permissions += 1;
                acc.dates.push({ date, type: 'إذن ساعة' });
            } else if (type === LeaveType.PERMISSION_2) {
                acc.counts.permissions += 1;
                acc.dates.push({ date, type: 'إذن ساعتين' });
            } else if (type === LeaveType.PERMISSION_3) {
                acc.counts.permissions += 1;
                acc.dates.push({ date, type: 'إذن 3 ساعات' });
            }
        }
        return acc;
    }, {
        counts: { annual: 0, casual: 0, sick: 0, permissions: 0 },
        dates: [] as { date: Date, type: string }[]
    });

    const total = leaveData.counts.annual + leaveData.counts.casual + leaveData.counts.sick;

    // Sort dates
    const sortedDates = leaveData.dates.sort((a, b) => compareAsc(a.date, b.date));

    // Group by month
    const groupedByMonth: Record<string, typeof sortedDates> = {};
    sortedDates.forEach(item => {
        const month = format(item.date, 'MMMM', { locale: arEG });
        if (!groupedByMonth[month]) groupedByMonth[month] = [];
        groupedByMonth[month].push(item);
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden transform transition-all scale-100 flex flex-col max-h-[90vh]">
                <div className="bg-orange-500 p-4 flex justify-between items-center text-white shrink-0">
                    <div className="flex items-center gap-2">
                        <Calendar size={24} />
                        <h3 className="font-bold text-lg">الرصيد المستهلك {currentYear}</h3>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-orange-600 rounded-full transition">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-4 overflow-y-auto no-scrollbar">
                    {/* Leave Counters Grid - 4 in a row */}
                    <div className="grid grid-cols-4 gap-1 mb-2">
                        <div className="flex flex-col items-center justify-center p-1 bg-green-50 rounded-lg border border-green-200">
                            <span className="font-bold text-green-800 text-[9px]">سنوي</span>
                            <span className="text-green-600 font-bold text-sm tracking-tighter">{leaveData.counts.annual}</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-1 bg-blue-50 rounded-lg border border-blue-200">
                            <span className="font-bold text-blue-800 text-[9px]">عارضة</span>
                            <span className="text-blue-600 font-bold text-sm tracking-tighter">{leaveData.counts.casual}</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-1 bg-purple-50 rounded-lg border border-purple-200">
                            <span className="font-bold text-purple-800 text-[9px]">S N</span>
                            <span className="text-purple-600 font-bold text-sm tracking-tighter">{leaveData.counts.sick}</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-1 bg-amber-50 rounded-lg border border-amber-200 shadow-sm">
                            <span className="font-bold text-amber-800 text-[9px]">إذن</span>
                            <span className="text-amber-600 font-bold text-sm tracking-tighter">{leaveData.counts.permissions}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-2 bg-gray-100 rounded-xl mb-2">
                        <span className="font-bold text-gray-800 text-xs">اجمالي المستهلك</span>
                        <span className="bg-gray-700 text-white px-3 py-1 rounded-lg font-bold text-sm">{total} يوم</span>
                    </div>

                    <button
                        onClick={() => setShowLog(!showLog)}
                        className="w-full py-2 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition active:scale-95 shadow-md text-sm"
                    >
                        <List size={18} />
                        سجل الايام
                    </button>

                    {showLog && (
                        <div className="mt-2 space-y-2 animate-slide-up">
                            {Object.entries(groupedByMonth).map(([month, days], idx, arr) => (
                                <div key={month} className="space-y-1">
                                    <h4 className="font-bold text-blue-800 border-r-4 border-blue-500 pr-2 mr-1 text-[12px]">{month}</h4>
                                    <div className="grid grid-cols-1 gap-1">
                                        {days.map((d, i) => {
                                            const isPermission = d.type.startsWith('إذن');
                                            return (
                                                <div 
                                                    key={i} 
                                                    className={`flex justify-between items-center p-1.5 rounded-lg text-[13px] border-r-2 ${
                                                        isPermission 
                                                        ? 'bg-amber-50 border-amber-300' 
                                                        : 'bg-gray-50 border-gray-200'
                                                    }`}
                                                >
                                                    <span className={`font-medium ${isPermission ? 'text-amber-900' : 'text-gray-700'}`}>
                                                        {format(d.date, 'EEEE d MMMM', { locale: arEG })}
                                                    </span>
                                                    <span className={`text-[10px] px-2 py-0.5 rounded border font-bold ${
                                                        isPermission 
                                                        ? 'bg-white border-amber-200 text-amber-600' 
                                                        : 'bg-white border-gray-200 text-gray-500'
                                                    }`}>
                                                        {d.type}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {idx < arr.length - 1 && <div className="border-b border-black/10 my-1 mx-4"></div>}
                                </div>
                            ))}
                            {sortedDates.length === 0 && (
                                <p className="text-center text-gray-400 py-4 italic">لا يوجد ايام مسجلة بعد</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LeaveDetailsModal;
