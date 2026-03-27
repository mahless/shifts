import React, { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

interface SuccessModalProps {
    isOpen: boolean;
    message: string;
    onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, message, onClose }) => {
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                onClose();
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center justify-center transform scale-100 animate-in zoom-in-95 duration-200 min-w-[280px]">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
                    <CheckCircle size={32} strokeWidth={3} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
                    {message}
                </h3>
            </div>
        </div>
    );
};

export default SuccessModal;
