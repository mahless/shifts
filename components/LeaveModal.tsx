import React, { useState, useEffect } from 'react';
import { LeaveType, Group } from '../types';
import { X, FileText, Camera, Trash2 } from 'lucide-react';
import { Camera as CapCamera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

interface LeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: LeaveType | 'NOTE_ONLY' | 'DELETE_NOTE' | 'DELETE_LEAVE', note?: string, image?: string) => void;
  dateStr: string;
  group: Group | 'ALL';
  initialNote?: string;
  initialImage?: string;
  isRestDay?: boolean;
  shiftSystem?: string;
}

const LeaveModal: React.FC<LeaveModalProps> = ({ isOpen, onClose, onSelect, dateStr, group, initialNote, initialImage, isRestDay = false, shiftSystem = 'WARADI' }) => {
  const [note, setNote] = useState('');
  const [image, setImage] = useState<string | undefined>(undefined);
  const [selectedLeave, setSelectedLeave] = useState<LeaveType>(LeaveType.ANNUAL);
  const [selectedPermission, setSelectedPermission] = useState<LeaveType>(LeaveType.PERMISSION_1);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setNote(initialNote || '');
      setImage(initialImage);
      setSelectedLeave(LeaveType.ANNUAL);
      setSelectedPermission(LeaveType.PERMISSION_1);
    }
  }, [isOpen, initialNote, initialImage]);

  if (!isOpen) return null;

  const handlePickImage = async () => {
    if (Capacitor.isNativePlatform()) {
      try {
        const photo = await CapCamera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: CameraResultType.Uri,
          source: CameraSource.Prompt,
          promptLabelHeader: 'اختر صورة',
          promptLabelPhoto: 'من المعرض',
          promptLabelPicture: 'التقط صورة'
        });

        if (photo.path) {
          const fileName = `note_img_${Date.now()}.jpg`;
          await Filesystem.copy({
            from: photo.path,
            to: fileName,
            toDirectory: Directory.Data
          });

          const fileUri = await Filesystem.getUri({
            directory: Directory.Data,
            path: fileName
          });

          setImage(fileUri.uri);
        }
      } catch (e) {
        console.error('Camera error', e);
      }
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(undefined);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden transform transition-all scale-100">
        <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
          <h3 className="font-bold text-lg">{isRestDay ? 'تسجيل ملاحظة' : 'تسجيل أجازة / إذن'}</h3>
          <button onClick={onClose} className="p-1 hover:bg-blue-700 rounded-full transition">
            <X size={24} />
          </button>
        </div>

        <div className="p-4 pb-1 text-right space-y-1">
          <p className="text-gray-600 text-lg">
            <span className="font-bold text-gray-900">التاريخ: </span>
            <span className="font-semibold text-gray-900">{dateStr}</span>
          </p>
          {shiftSystem !== 'NAHARI' && (
            <p className="text-gray-900 text-lg font-bold">
              جروب: {group === 'ALL' ? 'الكل' : group}
            </p>
          )}
        </div>

        <div className="px-4 pb-1">
          <div className="border border-black rounded-xl bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500 transition-all shadow-sm relative group/note overflow-hidden">
            <div className="max-h-[200px] overflow-y-auto">
              <div className="relative">
                <div className="absolute top-3 right-3 text-gray-400 pointer-events-none z-10">
                  <FileText size={16} />
                </div>

                <textarea
                  className="w-full bg-transparent p-3 pr-10 text-sm outline-none resize-none min-h-[80px] text-right text-black font-medium placeholder:text-gray-400 border-none focus:ring-0"
                  placeholder="ملاحظات إضافية ..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>

              {image && (
                <div className="relative w-full border-t border-gray-200 overflow-hidden group/img bg-white">
                  <img
                    src={Capacitor.convertFileSrc(image)}
                    alt="Note"
                    className="w-full h-auto object-contain block"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition z-20 shadow-lg active:scale-90"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            <div className="absolute top-2 left-2 z-20">
              <button
                onClick={handlePickImage}
                className="p-1.5 bg-white/90 backdrop-blur-sm text-blue-600 rounded-lg border border-blue-100 flex items-center gap-1 text-[10px] font-bold shadow-sm active:scale-95 transition hover:bg-white"
              >
                <Camera size={14} />
                {image ? 'تغيير' : 'صورة'}
              </button>
            </div>
          </div>
        </div>

        <div className="px-4 pb-4 pt-2 space-y-4">
          {!isRestDay && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="flex-1 space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 mr-2">نوع الاجازة</span>
                  <select 
                    value={selectedLeave}
                    onChange={(e) => setSelectedLeave(e.target.value as LeaveType)}
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-right"
                  >
                    <option value={LeaveType.ANNUAL}>سنوي</option>
                    <option value={LeaveType.CASUAL}>عارضه</option>
                    <option value={LeaveType.SICK}>مرضي (SN)</option>
                  </select>
                </div>
                <div className="flex-1 space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 mr-2">نوع الإذن</span>
                  <select 
                    value={selectedPermission}
                    onChange={(e) => setSelectedPermission(e.target.value as LeaveType)}
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-right"
                  >
                    <option value={LeaveType.PERMISSION_1}>إذن ساعة</option>
                    <option value={LeaveType.PERMISSION_2}>إذن ساعتين</option>
                    <option value={LeaveType.PERMISSION_3}>إذن 3 ساعات</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onSelect(selectedLeave, note, image)}
                  className="flex-1 p-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition text-xs shadow-sm"
                >
                  تسجيل أجازة
                </button>
                <button
                  onClick={() => onSelect(selectedPermission, note, image)}
                  className="flex-1 p-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition text-xs shadow-sm"
                >
                  تسجيل إذن
                </button>
              </div>

              <button
                onClick={() => onSelect('DELETE_LEAVE')}
                className="w-full p-2 bg-red-50 text-red-700 border border-red-200 rounded-xl font-bold hover:bg-red-100 transition text-xs"
              >
                إلغاء الإجازة / الإذن
              </button>
            </div>
          )}

          <div className="pt-2 border-t border-gray-100 flex gap-2">
            <button
              onClick={() => onSelect('NOTE_ONLY', note, image)}
              className="flex-1 p-3 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl font-bold hover:bg-blue-100 transition text-xs"
            >
              حفظ الملاحظة فقط
            </button>
            <button
              onClick={() => onSelect('DELETE_NOTE')}
              className="flex-1 p-3 bg-gray-50 text-gray-600 border border-gray-200 rounded-xl font-bold hover:bg-gray-100 transition text-xs"
            >
              مسح الملاحظة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default LeaveModal;