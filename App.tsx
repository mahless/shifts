import React, { useState, useEffect, useMemo, useRef, useLayoutEffect } from 'react';
import {
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  getYear,
  format
} from 'date-fns';


import { Group, ShiftType, LeaveType, AppState } from './types';
import { getShiftForGroup, getLeaveKey } from './utils/dateUtils';
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

import { setOfficialHolidays } from './constants/holidays';
import { setSalaryDates } from './constants/salaryDates';

// Hooks
import { useAppState } from './hooks/useAppState';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import ShiftGrid from './components/ShiftGrid';
import LeaveModal from './components/LeaveModal';
import SettingsModal from './components/SettingsModal';
import HolidaysModal from './components/HolidaysModal';
import MonthYearPicker from './components/MonthYearPicker';
import LeaveDetailsModal from './components/LeaveDetailsModal';
import SuccessModal from './components/SuccessModal';

function App() {
  // --- Custom Hook State ---
  const {
    leaves,
    setLeaves,
    notes,
    setNotes,
    totalBalance,
    setTotalBalance,
    hijriOffset,
    setHijriOffset,
    shiftSystem,
    setShiftSystem,
    restDays,
    setRestDays,
    isOffline
  } = useAppState();

  // --- UI State ---
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedGroup, setSelectedGroup] = useState<Group | 'ALL'>('ALL');

  // Modal State
  const [isLeaveModalOpen, setLeaveModalOpen] = useState(false);
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
  const [isHolidaysModalOpen, setHolidaysModalOpen] = useState(false);
  const [isMonthPickerOpen, setMonthPickerOpen] = useState(false);
  const [isLeaveDetailsOpen, setLeaveDetailsOpen] = useState(false);
  const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [showOfflineAlert, setShowOfflineAlert] = useState(false);

  // --- Fetch Google Sheets Data ---
  useEffect(() => {
    const fetchGoogleSheetsData = async () => {
      try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbwBfq69qB4PMuJANEBifRYwwKbjVaKbzIBIDYw34eeM-3Jl6AWHnuP0JGrwqxq49uU/exec');
        const json = await response.json();
        
        if (json.status === 'success' && json.data) {
          if (json.data.holidays && json.data.holidays.length > 0) {
            setOfficialHolidays(json.data.holidays);
          }
          if (json.data.salaries && json.data.salaries.length > 0) {
            setSalaryDates(json.data.salaries);
          }
        }
      } catch (error) {
        console.error('Failed to fetch data from Google Sheets:', error);
        setShowOfflineAlert(true);
      } finally {
        setIsLoadingData(false); // Trigger re-render with new data
      }
    };

    fetchGoogleSheetsData();
  }, []);

  const [fontSize, setFontSize] = useState<'small' | 'medium'>(
    (localStorage.getItem('app_font_size') as 'small' | 'medium') || 'medium'
  );

  const [modalData, setModalData] = useState<{ date: Date, group: Group } | null>(null);

  // --- Font Size Effect ---
  useEffect(() => {
    const root = document.documentElement;
    const sizes = { small: '16px', medium: '18px' };
    root.style.fontSize = sizes[fontSize];
    root.setAttribute('data-app-font-size', fontSize);
    localStorage.setItem('app_font_size', fontSize);
  }, [fontSize]);

  // Ref for scrolling to today's row
  const todayRowRef = useRef<HTMLDivElement>(null);
  const hasScrolledToToday = useRef(false);
  const [isTodayVisible, setIsTodayVisible] = useState(true);

  // --- Computed Data ---
  const daysInMonth = useMemo(() => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  // Scroll to today's row on first render
  useLayoutEffect(() => {
    if (!hasScrolledToToday.current && todayRowRef.current) {
      setTimeout(() => {
        todayRowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        hasScrolledToToday.current = true;
      }, 100);
    }
  }, [daysInMonth]);

  // Intersection Observer to track if today's row is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsTodayVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (todayRowRef.current) {
      observer.observe(todayRowRef.current);
    }

    return () => {
      if (todayRowRef.current) {
        observer.unobserve(todayRowRef.current);
      }
    };
  }, [daysInMonth]);

  // Back Button Logic
  useEffect(() => {
    const backListener = CapacitorApp.addListener('backButton', ({ canGoBack }) => {
      if (isLeaveModalOpen) {
        setLeaveModalOpen(false);
      } else if (isSettingsModalOpen) {
        setSettingsModalOpen(false);
      } else if (isHolidaysModalOpen) {
        setHolidaysModalOpen(false);
      } else if (isMonthPickerOpen) {
        setMonthPickerOpen(false);
      } else if (isLeaveDetailsOpen) {
        setLeaveDetailsOpen(false);
      } else if (!isSameMonth(currentDate, new Date()) || !isTodayVisible) {
        handleGoToToday();
      } else {
        // Do nothing to keep user on home screen as requested
      }
    });

    return () => {
      backListener.then(handler => handler.remove());
    };
  }, [
    isLeaveModalOpen,
    isSettingsModalOpen,
    isHolidaysModalOpen,
    isMonthPickerOpen,
    isLeaveDetailsOpen,
    currentDate,
    isTodayVisible
  ]);

  // Swipe Logic
  const touchStartRef = useRef<number | null>(null);
  const touchEndRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchEndRef.current = null;
    touchStartRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartRef.current || !touchEndRef.current) return;
    const distance = touchStartRef.current - touchEndRef.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isRightSwipe) {
      handleNextMonth();
    } else if (isLeftSwipe) {
      handlePrevMonth();
    }
  };

  const currentYear = getYear(currentDate);

  const usedBalance = useMemo(() => {
    return Object.entries(leaves).reduce((acc, [key, type]) => {
      const year = parseInt(key.split('-')[0]);
      if (year === currentYear && (type === LeaveType.ANNUAL || type === LeaveType.CASUAL || type === LeaveType.SICK)) {
        return acc + 1;
      }
      return acc;
    }, 0);
  }, [leaves, currentYear]);

  const remainingBalance = (typeof totalBalance === 'number' ? totalBalance : 0) - usedBalance;

  // --- Handlers ---
  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const handleGoToToday = () => {
    setCurrentDate(new Date());
    setTimeout(() => {
      todayRowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setSuccessModalOpen(true);
  };

  const handleDayClick = (date: Date, group: Group) => {
    setModalData({ date, group });
    setLeaveModalOpen(true);
  };

  const handleLeaveSelect = (type: LeaveType | 'NOTE_ONLY' | 'DELETE_NOTE' | 'DELETE_LEAVE', note?: string, image?: string) => {
    if (modalData) {
      const key = getLeaveKey(modalData.date, modalData.group);

      setLeaves(prev => {
        const next = { ...prev };
        if (type === LeaveType.NONE || type === 'NOTE_ONLY' || type === 'DELETE_LEAVE') {
          delete next[key];
        } else if (type !== 'DELETE_NOTE') {
          next[key] = type;
        }
        return next;
      });

      setNotes(prev => {
        const next = { ...prev };
        if (type === 'DELETE_NOTE') {
          delete next[key];
        } else if (type === 'DELETE_LEAVE') {
          // Keep the note if it exists
        } else if (type === LeaveType.NONE) {
          delete next[key];
        } else if ((note && note.trim() !== "") || image) {
          next[key] = {
            text: note || "",
            image: image
          };
        } else {
          delete next[key];
        }
        return next;
      });

      setLeaveModalOpen(false);
    }
  };

  const handleRestore = (data: AppState) => {
    if (data.leaves) setLeaves(data.leaves);
    if (typeof data.totalBalance === 'number') setTotalBalance(data.totalBalance);
    if (typeof data.hijriOffset === 'number') setHijriOffset(data.hijriOffset);
    if (data.shiftSystem) setShiftSystem(data.shiftSystem);
    if (data.restDays) setRestDays(data.restDays);
    if (data.notes) setNotes(data.notes);
  };

  // Get current state for modal
  const getCurrentNote = () => {
    if (modalData) {
      const key = getLeaveKey(modalData.date, modalData.group);
      return notes[key]?.text;
    }
    return undefined;
  };

  const getCurrentImage = () => {
    if (modalData) {
      const key = getLeaveKey(modalData.date, modalData.group);
      return notes[key]?.image;
    }
    return undefined;
  };

  const getIsRestDay = (): boolean => {
    if (modalData) {
      const shift = getShiftForGroup(modalData.date, modalData.group, shiftSystem, restDays);
      return shift === ShiftType.REST;
    }
    return false;
  };

  return (
    <div
      className="h-full w-full bg-gray-50 relative flex flex-col overflow-hidden px-safe"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* --- Header --- */}
      <Header
        currentDate={currentDate}
        selectedGroup={selectedGroup}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onOpenMonthPicker={() => setMonthPickerOpen(true)}
        onOpenSettings={() => setSettingsModalOpen(true)}
        onGroupChange={setSelectedGroup}
      />

      {/* Main Content Area - Scrollable */}
      <div className="flex-grow overflow-y-auto no-scrollbar py-2">
        <ShiftGrid
          daysInMonth={daysInMonth}
          selectedGroup={selectedGroup}
          leaves={leaves}
          notes={notes}
          onDayClick={handleDayClick}
          todayRowRef={todayRowRef}
          hijriOffset={hijriOffset}
          shiftSystem={shiftSystem}
          restDays={restDays}
        />

        {/* Footer inside scrollable area */}
        <Footer
          remainingBalance={remainingBalance}
          totalBalance={totalBalance}
          currentYear={currentYear}
          onTotalBalanceChange={setTotalBalance}
          onOpenHolidays={() => setHolidaysModalOpen(true)}
          onOpenLeaveDetails={() => setLeaveDetailsOpen(true)}
        />
      </div>


      {/* Offline Banner at Bottom */}
      {isOffline && (
        <div className="bg-red-500 text-white text-center py-2 text-sm font-bold animate-pulse absolute bottom-0 left-0 right-0 z-[100] pb-safe shadow-lg">
          لا يوجد اتصال بالإنترنت - يتم حفظ البيانات محلياً
        </div>
      )}



      {/* Modals */}
      <LeaveModal
        isOpen={isLeaveModalOpen}
        onClose={() => setLeaveModalOpen(false)}
        onSelect={handleLeaveSelect}
        dateStr={modalData ? format(modalData.date, 'yyyy-MM-dd') : ''}
        group={modalData?.group || 'A'}
        initialNote={getCurrentNote()}
        initialImage={getCurrentImage()}
        isRestDay={getIsRestDay()}
        shiftSystem={shiftSystem}
      />
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        appState={{ leaves, totalBalance, notes, hijriOffset, shiftSystem, restDays }}
        onRestore={handleRestore}
        onSuccess={handleSuccess}
        hijriOffset={hijriOffset}
        onHijriOffsetChange={setHijriOffset}
        shiftSystem={shiftSystem}
        onShiftSystemChange={setShiftSystem}
        restDays={restDays}
        onRestDaysChange={setRestDays}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
      />
      <HolidaysModal
        isOpen={isHolidaysModalOpen}
        onClose={() => setHolidaysModalOpen(false)}
        currentYear={currentYear}
      />
      <MonthYearPicker
        isOpen={isMonthPickerOpen}
        onClose={() => setMonthPickerOpen(false)}
        currentDate={currentDate}
        onChange={setCurrentDate}
      />
      <LeaveDetailsModal
        isOpen={isLeaveDetailsOpen}
        onClose={() => setLeaveDetailsOpen(false)}
        leaves={leaves}
        currentYear={currentYear}
      />
      <SuccessModal
        isOpen={isSuccessModalOpen}
        message={successMessage}
        onClose={() => setSuccessModalOpen(false)}
      />

      {/* Offline Alert Modal */}
      {showOfflineAlert && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="2" y1="2" x2="22" y2="22" />
                <path d="M8.5 8.5a11 11 0 0 1 11.5 7.5" />
                <path d="M4.93 10.93A11 11 0 0 1 12 7" />
                <path d="M2.5 13.5a11 11 0 0 1 1.6-1.6" />
                <path d="M16 16a11 11 0 0 1-13.5-2.5" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">تنبيه</h3>
            <p className="text-gray-600 mb-6 font-medium">اتصل بالانترنت لعرض الاجازات ومواعيد الراتب</p>
            <button
              onClick={() => setShowOfflineAlert(false)}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors"
            >
              موافق
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;