import React, { useRef } from 'react';
import { Download, Upload, X, Settings2, Database, Briefcase, Calendar, Type } from 'lucide-react';
import { AppState, ShiftSystem } from '../types';
import { Share } from '@capacitor/share';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appState: AppState;
  onRestore: (data: AppState) => void;
  onSuccess: (message: string) => void;
  hijriOffset: number;
  onHijriOffsetChange: (offset: number) => void;
  shiftSystem: ShiftSystem;
  onShiftSystemChange: (system: ShiftSystem) => void;
  restDays: number[];
  onRestDaysChange: (days: number[]) => void;
  fontSize: 'small' | 'medium';
  onFontSizeChange: (size: 'small' | 'medium') => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  appState, 
  onRestore, 
  onSuccess,
  hijriOffset,
  onHijriOffsetChange,
  shiftSystem,
  onShiftSystemChange,
  restDays,
  onRestDaysChange,
  fontSize,
  onFontSizeChange
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const DAYS = [
    { id: 0, name: 'الأحد' },
    { id: 1, name: 'الإثنين' },
    { id: 2, name: 'الثلاثاء' },
    { id: 3, name: 'الأربعاء' },
    { id: 4, name: 'الخميس' },
    { id: 5, name: 'الجمعة' },
    { id: 6, name: 'السبت' },
  ];

  const toggleRestDay = (id: number) => {
    if (restDays.includes(id)) {
      onRestDaysChange(restDays.filter(d => d !== id));
    } else {
      onRestDaysChange([...restDays, id].sort());
    }
  };

  const handleExport = async () => {
    const dataStr = JSON.stringify(appState, null, 2);
    const fileName = `Shift-backup.json`;

    if (Capacitor.isNativePlatform()) {
      try {
        await Filesystem.writeFile({
          path: fileName,
          data: dataStr,
          directory: Directory.Documents,
          encoding: Encoding.UTF8,
          recursive: true
        });

        const result = await Filesystem.getUri({
          directory: Directory.Documents,
          path: fileName,
        });

        await Share.share({
          title: 'نسخة احتياطية - Shift',
          text: 'ملف النسخة الاحتياطية لتطبيق Shift',
          url: result.uri,
          dialogTitle: 'مشاركة النسخة الاحتياطية',
        });

        onSuccess('تم الحفظ في ذاكرة الهاتف ونجاح النسخ الاحتياطي✅');
        onClose();
      } catch (e) {
        console.error('Error sharing backup:', e);
        alert('حدث خطأ أثناء نسخ الملف احتياطياً');
      }
    } else {
      // Web fallback
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      onSuccess('تم بنجاح✅');
      onClose();
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target?.result as string);
          if (json.leaves && (typeof json.totalBalance === 'number' || typeof json.totalBalance === 'string')) {
            if (typeof json.totalBalance === 'string' && json.totalBalance === '') {
              json.totalBalance = 0;
            }
            onRestore(json);
            onSuccess("تم استعاده البيانات بنجاح");
            onClose();
          } else {
            alert("ملف غير صالح");
          }
        } catch (err) {
          alert("حدث خطأ أثناء قراءة الملف");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 left-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200">
          <X size={18} />
        </button>

        <div className="flex items-center justify-center gap-2 mb-6">
          <Settings2 size={24} className="text-blue-600" />
          <h3 className="text-xl font-bold text-gray-800">إعدادات التطبيق</h3>
        </div>

        <div className="space-y-6">
          {/* Section: Work System */}
          <div className="space-y-3">
            <div className="flex items-center justify-start gap-2 text-gray-700 mb-1">
              <Briefcase size={16} />
              <h4 className="text-xs font-bold">نظام العمل</h4>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => onShiftSystemChange('NAHARI')}
                className={`flex-1 p-2 rounded-xl font-bold text-xs border transition ${
                  shiftSystem === 'NAHARI' 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                النهاري
              </button>
              <button
                onClick={() => onShiftSystemChange('WARADI')}
                className={`flex-1 p-2 rounded-xl font-bold text-xs border transition ${
                  shiftSystem === 'WARADI' 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                الورادي
              </button>
            </div>

            {/* Rest Days Selection - Only for NAHARI */}
            {shiftSystem === 'NAHARI' && (
              <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-[10px] font-bold text-gray-500">اختر أيام الراحة الأسبوعية</h5>
                  <span className="text-[9px] text-blue-600 font-bold">{restDays.length} أيام</span>
                </div>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {DAYS.map(day => (
                    <button
                      key={day.id}
                      onClick={() => toggleRestDay(day.id)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition ${
                        restDays.includes(day.id)
                          ? 'bg-green-500 text-white border-green-500 shadow-sm'
                          : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {day.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section: Backup */}
          <div className="space-y-3 pt-4 border-t border-black">
            <div className="flex items-center justify-start gap-2 text-gray-700 mb-1">
              <Database size={16} />
              <h4 className="text-xs font-bold">النسخ الاحتياطي</h4>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleExport}
                className="flex-1 flex items-center justify-center gap-1.5 p-2 bg-blue-50 text-blue-700 rounded-xl font-bold text-[10px] hover:bg-blue-100 border border-blue-200 transition"
              >
                <Upload size={14} />
                تصدير البيانات
              </button>

              <button
                onClick={handleImportClick}
                className="flex-1 flex items-center justify-center gap-1.5 p-2 bg-green-50 text-green-700 rounded-xl font-bold text-[10px] hover:bg-green-100 border border-green-200 transition"
              >
                <Download size={14} />
                استيراد البيانات
              </button>
            </div>
            <p className="text-[9px] text-gray-400 text-center">
              سيتم كل اسبوع الحفظ التلقائي للبيانات علي ذاكره الهاتف..
            </p>
          </div>

          {/* Section: Hijri Adjustment */}
          <div className="pt-4 border-t border-black">
            <div className="flex items-center justify-start gap-2 text-gray-700 mb-3">
              <Calendar size={16} />
              <h4 className="text-xs font-bold">ضبط التاريخ الهجري يدوياً</h4>
            </div>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => onHijriOffsetChange(hijriOffset - 1)}
                className="w-8 h-8 flex items-center justify-center bg-red-50 text-red-600 rounded-full font-bold text-lg hover:bg-red-100 transition shadow-sm border border-red-100 active:scale-90"
              >
                -
              </button>
              <div className="flex flex-col items-center min-w-[60px]">
                <span className="text-lg font-bold text-blue-600">
                  {hijriOffset > 0 ? `+${hijriOffset}` : hijriOffset}
                </span>
                <span className="text-[9px] text-gray-400 font-bold">يوم</span>
              </div>
              <button
                onClick={() => onHijriOffsetChange(hijriOffset + 1)}
                className="w-8 h-8 flex items-center justify-center bg-green-50 text-green-600 rounded-full font-bold text-lg hover:bg-green-100 transition shadow-sm border border-green-100 active:scale-90"
              >
                +
              </button>
            </div>
          </div>

          {/* Section: Font Size */}
          <div className="pt-4 border-t border-black">
            <div className="flex items-center justify-start gap-2 text-gray-700 mb-3">
              <Type size={16} />
              <h4 className="text-xs font-bold">حجم الخط</h4>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => onFontSizeChange('small')}
                className={`flex-1 p-2 rounded-xl font-bold text-xs border transition ${
                  fontSize === 'small' 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                صغير
              </button>
              <button
                onClick={() => onFontSizeChange('medium')}
                className={`flex-1 p-2 rounded-xl font-bold text-xs border transition ${
                  fontSize === 'medium' 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                متوسط
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-gray-100 flex flex-col items-center gap-1">
          <p className="text-[10px] text-gray-400 font-bold">إصدار رسمي v1.0.0</p>
          <p className="text-[8px] text-gray-300">حقوق النشر © ٢٠٢٦ - جميع الحقوق محفوظة</p>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".json"
        />
      </div>
    </div>
  );
};

export default SettingsModal;