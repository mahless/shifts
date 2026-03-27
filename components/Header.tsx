import React from 'react';
import { format } from 'date-fns';
import { arEG } from 'date-fns/locale';
import { ChevronRight, ChevronLeft, Settings } from 'lucide-react';
import { Group } from '../types';

interface HeaderProps {
    currentDate: Date;
    selectedGroup: Group | 'ALL';
    onPrevMonth: () => void;
    onNextMonth: () => void;
    onOpenMonthPicker: () => void;
    onOpenSettings: () => void;
    onGroupChange: (group: Group | 'ALL') => void;
}

const Header: React.FC<HeaderProps> = ({
    currentDate,
    selectedGroup,
    onPrevMonth,
    onNextMonth,
    onOpenMonthPicker,
    onOpenSettings,
    onGroupChange
}) => {
    return (
        <>
            {/* White cover for the top area */}
            <header className="bg-white px-4 pb-1.5 pt-safe shadow-[0_2px_15px_rgba(255,140,0,0.25)] z-30 mx-2 rounded-xl mb-1 mt-1">
                <div className="flex justify-between items-center mb-4 mt-2">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden">
                            <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h1 className="text-[20px] font-bold text-gray-800 [text-shadow:0_1px_3px_rgba(0,0,0,0.2)]">جدول الـورادي</h1>
                            <p className="text-[12px] text-blue-600 font-bold [text-shadow:0_1px_2px_rgba(0,0,0,0.1)]">حــــديــــد عـــــز</p>
                        </div>
                    </div>
                    <div className="flex gap-2 relative">
                        <button
                            onClick={onOpenSettings}
                            className="w-8 h-8 bg-white text-black hover:bg-gray-100 rounded-xl transition shadow-[0_2px_10px_rgba(0,0,0,0.25)] border-[0.5px] border-black flex items-center justify-center touch-target"
                        >
                            <Settings size={20} />
                        </button>
                    </div>
                </div>

                {/* Date Navigator */}
                <div className="flex items-center justify-between bg-blue-50 rounded-2xl p-0.5 shadow-lg border border-blue-500/50">
                    <button onClick={onPrevMonth} className="p-2 hover:bg-white rounded-xl transition text-blue-600 touch-target">
                        <ChevronRight size={22} />
                    </button>

                    <button
                        onClick={onOpenMonthPicker}
                        className="font-bold text-blue-800 text-lg px-4 py-1.5 rounded-lg hover:bg-white/50 transition active:scale-95 flex-1 touch-target [text-shadow:0_1px_3px_rgba(0,0,0,0.15)]"
                    >
                        {format(currentDate, 'MMMM yyyy', { locale: arEG })}
                    </button>

                    <button onClick={onNextMonth} className="p-2 hover:bg-white rounded-xl transition text-blue-600 touch-target">
                        <ChevronLeft size={22} />
                    </button>
                </div>

                {/* Group Filter */}
                <div className="flex justify-between gap-2 mt-2 overflow-x-auto no-scrollbar py-0.5">
                    <div className="flex w-full bg-blue-50 p-1 rounded-xl shadow-md">
                        {(['ALL', 'A', 'B', 'C', 'D'] as const).map(g => (
                            <button
                                key={g}
                                onClick={() => onGroupChange(g)}
                                className={`
                   flex-1 py-1 rounded-lg font-bold text-sm transition-all
                   ${selectedGroup === g
                                        ? 'bg-white text-blue-600 shadow-md transform scale-105'
                                        : 'text-blue-800 hover:text-blue-900'}`}
                            >
                                {g === 'ALL' ? 'الكل' : g}
                            </button>
                        ))}
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header;
