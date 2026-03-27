import { useState, useEffect } from 'react';
import { LeaveType, AppState, ShiftSystem } from '../types';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

export const useAppState = () => {
    const [leaves, setLeaves] = useState<Record<string, LeaveType>>({});
    const [notes, setNotes] = useState<Record<string, { text: string; image?: string }>>({});
    const [totalBalance, setTotalBalance] = useState<number | ''>(21);
    const [hijriOffset, setHijriOffset] = useState<number>(0);
    const [shiftSystem, setShiftSystem] = useState<ShiftSystem>('WARADI');
    const [restDays, setRestDays] = useState<number[]>([5, 6]); // Default Friday, Saturday
    const [isOffline, setIsOffline] = useState(!window.navigator.onLine);
    const [isLoaded, setIsLoaded] = useState(false);

    // --- Offline Detection ---
    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // --- Persistence (Load) ---
    useEffect(() => {
        const saved = localStorage.getItem('waradi_data');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.leaves) setLeaves(parsed.leaves);
                if (parsed.totalBalance !== undefined) setTotalBalance(parsed.totalBalance);
                if (parsed.hijriOffset !== undefined) setHijriOffset(parsed.hijriOffset);
                if (parsed.shiftSystem !== undefined) setShiftSystem(parsed.shiftSystem);
                if (parsed.restDays !== undefined) setRestDays(parsed.restDays);

                if (parsed.notes) {
                    const migratedNotes: Record<string, { text: string; image?: string }> = {};
                    Object.entries(parsed.notes).forEach(([key, value]) => {
                        if (typeof value === 'string') {
                            migratedNotes[key] = { text: value };
                        } else {
                            migratedNotes[key] = value as { text: string; image?: string };
                        }
                    });
                    setNotes(migratedNotes);
                }
            } catch (e) {
                console.error("Failed to load data", e);
            }
        }
        setIsLoaded(true);
    }, []);

    // --- Sync to LocalStorage (Save) ---
    useEffect(() => {
        if (!isLoaded) return; // Prevent overwriting with defaults on mount

        const data: AppState = { 
            leaves, 
            totalBalance: typeof totalBalance === 'number' ? totalBalance : 0, 
            notes,
            hijriOffset,
            shiftSystem,
            restDays
        };
        localStorage.setItem('waradi_data', JSON.stringify(data));
    }, [leaves, totalBalance, notes, hijriOffset, shiftSystem, restDays, isLoaded]);

    // --- Auto Backup ---
    useEffect(() => {
        const checkAutoBackup = async () => {
            if (!Capacitor.isNativePlatform()) return;
            if (!isLoaded) return;

            const lastBackup = localStorage.getItem('last_backup_date');
            const now = new Date();
            const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;

            if (!lastBackup || (now.getTime() - new Date(lastBackup).getTime() > oneWeekInMs)) {
                try {
                    const data: AppState = { 
                        leaves, 
                        totalBalance: typeof totalBalance === 'number' ? totalBalance : 0, 
                        notes,
                        hijriOffset,
                        shiftSystem,
                        restDays
                    };
                    const dataStr = JSON.stringify(data, null, 2);
                    const fileName = 'Shift-backup.json';

                    await Filesystem.writeFile({
                        path: fileName,
                        data: dataStr,
                        directory: Directory.Documents,
                        encoding: Encoding.UTF8,
                        recursive: true
                    });

                    localStorage.setItem('last_backup_date', now.toISOString());
                    console.log('Auto backup completed');
                } catch (e) {
                    console.error('Auto backup failed', e);
                }
            }
        };

        if (Object.keys(leaves).length > 0) {
            checkAutoBackup();
        }
    }, [leaves, totalBalance, notes, isLoaded, hijriOffset, shiftSystem, restDays]);

    return {
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
        isOffline,
    };
};
