import React, { useState } from 'react';
import { format, isSameDay } from 'date-fns';
import { arEG } from 'date-fns/locale';
import { Group, ShiftType, LeaveType, ShiftSystem } from '../types';
import { getShiftForGroup, getShiftLabel, getLeaveKey, getLeaveLabel } from '../utils/dateUtils';
import { isOfficialHoliday, getHolidayName, isRamadan, isHighlightHoliday, isRamadanStart } from '../constants/holidays';
import { getSalaryMessage, isSalaryDate } from '../constants/salaryDates';

// --- Constants ---
const BG_COLORS: Record<ShiftType, string> = {
    [ShiftType.FIRST]: 'bg-gray-300/65',
    [ShiftType.SECOND]: 'bg-gray-300/65',
    [ShiftType.THIRD]: 'bg-gray-300/65',
    [ShiftType.REST]: 'bg-green-200/65'
};

const TEXT_COLORS: Record<ShiftType, string> = {
    [ShiftType.FIRST]: 'text-black',
    [ShiftType.SECOND]: 'text-black',
    [ShiftType.THIRD]: 'text-black',
    [ShiftType.REST]: 'text-black'
};

interface ShiftCellProps {
    date: Date;
    group: Group;
    leaves: Record<string, LeaveType>;
    notes: Record<string, { text: string; image?: string }>;
    shiftSystem: ShiftSystem;
    restDays: number[];
    onDayClick: (date: Date, group: Group) => void;
}

export const ShiftCell: React.FC<ShiftCellProps> = ({ date, group, leaves, notes, shiftSystem, restDays, onDayClick }) => {
    const shift = getShiftForGroup(date, group, shiftSystem, restDays);
    const leaveKey = getLeaveKey(date, group);
    const leave = leaves[leaveKey];
    const note = notes[leaveKey];
    const hasNoteText = note && note.text.trim().length > 0;
    const hasImage = note && note.image;

    let bgClass = BG_COLORS[shift];
    let textClass = TEXT_COLORS[shift];
    let label = getShiftLabel(shift);

    if (leave) {
        const isPermission = leave === LeaveType.PERMISSION_1 || leave === LeaveType.PERMISSION_2 || leave === LeaveType.PERMISSION_3;
        bgClass = isPermission ? 'bg-amber-500/85' : 'bg-red-500/75';
        textClass = 'text-white font-bold';
        label = getLeaveLabel(leave);
    }

    return (
        <button
            key={`${group}-${date.getTime()}`}
            onClick={() => onDayClick(date, group)}
            className={`
        flex items-center justify-center px-1 py-0.5 rounded-lg text-xs sm:text-sm font-bold shadow-sm transition-transform active:scale-95 relative
        ${bgClass} ${textClass} min-h-[3rem] h-full w-full break-words
      `}
        >
            {label}
            {hasNoteText && (
                <div className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full border border-white shadow-sm"></div>
            )}
            {hasImage && (
                <div className="absolute bottom-1 right-1 text-[8px] text-blue-700">🖼️</div>
            )}
        </button>
    );
};

// Holiday name popup component
interface HolidayPopupProps {
    holidayName: string;
    title?: string;
    icon?: string;
    onClose: () => void;
}

const HolidayPopup: React.FC<HolidayPopupProps> = ({ holidayName, title = 'إجازة رسمية', icon = '🎉', onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-xs w-full text-center" onClick={e => e.stopPropagation()}>
                <div className="text-3xl mb-3">{icon}</div>
                {title && <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>}
                <p className="text-green-600 font-bold text-xl">{holidayName}</p>
                <button
                    onClick={onClose}
                    className="mt-4 px-6 py-2 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition"
                >
                    حسناً
                </button>
            </div>
        </div>
    );
};

interface ShiftGridProps {
    daysInMonth: Date[];
    selectedGroup: Group | 'ALL';
    leaves: Record<string, LeaveType>;
    notes: Record<string, { text: string; image?: string }>;
    onDayClick: (date: Date, group: Group) => void;
    todayRowRef: React.RefObject<HTMLDivElement | null>;
    hijriOffset?: number;
    shiftSystem: ShiftSystem;
    restDays: number[];
}

export const ShiftGrid: React.FC<ShiftGridProps> = ({
    daysInMonth,
    selectedGroup,
    leaves,
    notes,
    onDayClick,
    todayRowRef,
    hijriOffset = 0,
    shiftSystem,
    restDays
}) => {
    const [popupData, setPopupData] = useState<{ name: string, title?: string, icon?: string } | null>(null);

    const handleDateClick = (date: Date) => {
        const salaryMsg = getSalaryMessage(date);
        if (salaryMsg) {
            setPopupData({ name: salaryMsg, title: '', icon: '💲💲' });
            return;
        }

        if (isRamadanStart(date)) {
            setPopupData({ name: "بدايه شهر رمضان الكريم", title: '', icon: '🌙' });
            return;
        }

        const holidayName = getHolidayName(date);
        if (holidayName) {
            setPopupData({ name: holidayName });
        }
    };

    return (
        <>
            <div className="px-4 space-y-0.5 flex-grow shift-grid-content">
                {daysInMonth.map(date => {
                    const isTodayDate = isSameDay(date, new Date());
                    const dayName = format(date, 'EEEE', { locale: arEG });
                    const dayNum = format(date, 'd', { locale: arEG });
                    const isHoliday = isHighlightHoliday(date);
                    const salaryMessage = getSalaryMessage(date);
                    const isRamadanDay = isRamadan(date);

                    // Apply manual Hijri offset
                    const adjustedDate = new Date(date);
                    adjustedDate.setDate(adjustedDate.getDate() + hijriOffset);
                    const hijriDate = new Intl.DateTimeFormat('ar-EG-u-ca-islamic', { month: 'long', day: 'numeric' }).format(adjustedDate);

                    return (
                        <div
                            key={date.toISOString()}
                            ref={isTodayDate ? todayRowRef : null}
                            className={`grid ${shiftSystem === 'NAHARI' ? 'grid-cols-[minmax(0,1.35fr)_minmax(0,4fr)]' : (selectedGroup === 'ALL' ? 'grid-cols-[minmax(0,1.35fr)_repeat(4,minmax(0,1fr))]' : 'grid-cols-[minmax(0,1.35fr)_minmax(0,4fr)]')} gap-0.5 items-stretch ${isTodayDate ? 'ring-1 ring-blue-400 rounded-lg p-0.5 bg-blue-50/50 -ml-1 pl-1 -mr-1 pr-1' : ''}`}
                        >
                            {/* Date Column - Clickable for holidays and salary dates */}
                            <button
                                onClick={() => handleDateClick(date)}
                                className={`flex flex-col items-center justify-center rounded-lg shadow-sm min-h-[3rem] py-0.5 px-1 h-full relative transition-transform active:scale-95 date-column
                                    ${isTodayDate ? 'bg-blue-600 text-white' :
                                        isHoliday ? 'bg-green-500 text-white' :
                                            salaryMessage ? 'bg-blue-500/20 text-blue-900 border border-blue-200' :
                                                'bg-white text-black'}`}
                            >
                                <div className="flex flex-row items-baseline justify-center gap-1 w-full flex-nowrap whitespace-nowrap">
                                    <span className="text-xs leading-tight text-center day-name">{dayName}</span>
                                    <span className="font-bold text-lg leading-none">{dayNum}</span>
                                </div>
                                <span className={`text-[11px] leading-tight text-center break-words w-full mt-0.5 ${isTodayDate || isHoliday ? 'text-white/90' : 'text-black'}`}>( {hijriDate} )</span>
                                {/* Ramadan crescent mark */}
                                {isRamadanDay && (
                                    <span className="absolute top-0.5 left-0.5 text-[10px] text-blue-500">🌙</span>
                                )}
                            </button>

                            {/* Shifts */}
                            {shiftSystem === 'NAHARI' ? (
                                <ShiftCell date={date} group={selectedGroup === 'ALL' ? 'A' : selectedGroup} leaves={leaves} notes={notes} onDayClick={onDayClick} shiftSystem={shiftSystem} restDays={restDays} />
                            ) : (
                                selectedGroup === 'ALL' ? (
                                    <>
                                        <ShiftCell date={date} group="A" leaves={leaves} notes={notes} onDayClick={onDayClick} shiftSystem={shiftSystem} restDays={restDays} />
                                        <ShiftCell date={date} group="B" leaves={leaves} notes={notes} onDayClick={onDayClick} shiftSystem={shiftSystem} restDays={restDays} />
                                        <ShiftCell date={date} group="C" leaves={leaves} notes={notes} onDayClick={onDayClick} shiftSystem={shiftSystem} restDays={restDays} />
                                        <ShiftCell date={date} group="D" leaves={leaves} notes={notes} onDayClick={onDayClick} shiftSystem={shiftSystem} restDays={restDays} />
                                    </>
                                ) : (
                                    <ShiftCell date={date} group={selectedGroup} leaves={leaves} notes={notes} onDayClick={onDayClick} shiftSystem={shiftSystem} restDays={restDays} />
                                )
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Holiday Name Popup */}
            {popupData && (
                <HolidayPopup
                    holidayName={popupData.name}
                    title={popupData.title}
                    icon={popupData.icon}
                    onClose={() => setPopupData(null)}
                />
            )}
        </>
    );
};

export default ShiftGrid;
