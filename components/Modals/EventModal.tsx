'use client';

import { MapEvent } from '@/types';
import { useAppState } from '@/hooks/useAppState';
import { useEffect } from 'react';

interface EventModalProps {
  event: MapEvent;
  onClose: () => void;
}

export default function EventModal({ event, onClose }: EventModalProps) {
  const { handleJoinEvent, myProfile } = useAppState();

  const isJoined = event.attendees?.includes(myProfile.id);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const formatTime = (iso: string) => {
    return new Date(iso).toLocaleString('vi-VN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const getCategoryIcon = () => {
    switch (event.category) {
      case 'party':
        return '🎉';
      case 'coffee':
        return '☕';
      case 'study':
        return '📚';
      default:
        return '📍';
    }
  };

  const getCategoryColor = () => {
    switch (event.category) {
      case 'party':
        return 'from-red-500 to-red-600';
      case 'coffee':
        return 'from-amber-500 to-orange-600';
      case 'study':
        return 'from-blue-500 to-indigo-600';
      default:
        return 'from-slate-500 to-slate-600';
    }
  };

  const handleJoin = async () => {
    if (!isJoined) {
      await handleJoinEvent(event.id);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[4000] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm px-4 sm:px-0"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-[slideUp_.3s_cubic-bezier(0.16,1,0.3,1)]"
      >
        {/* Header với gradient */}
        <div className={`bg-gradient-to-br ${getCategoryColor()} p-6 text-white relative overflow-hidden`}>
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white rounded-full" />
            <div className="absolute -left-12 -bottom-12 w-40 h-40 bg-white rounded-full" />
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors"
          >
            <span className="text-white text-lg">✕</span>
          </button>

          {/* Content */}
          <div className="relative z-10">
            <div className="text-5xl mb-3 drop-shadow-lg">{getCategoryIcon()}</div>
            <h2 className="text-2xl font-bold mb-2 leading-tight">{event.title}</h2>
            <div className="flex items-center gap-2 text-white/90">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">{formatTime(event.startTime)}</span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Description */}
          {event.description && (
            <div className="bg-slate-50 rounded-2xl p-4">
              <div className="flex items-start gap-2">
                <span className="text-lg mt-0.5">💬</span>
                <p className="text-sm text-slate-700 leading-relaxed flex-1">
                  {event.description}
                </p>
              </div>
            </div>
          )}

          {/* Info cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            {/* Attendees */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white">
                  👥
                </div>
                <span className="font-semibold text-slate-800 text-sm">Tham gia</span>
              </div>
              <p className="text-2xl font-bold text-slate-800">
                {event.attendees?.length || 0}
                <span className="text-sm font-normal text-slate-500 ml-1">người</span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0">
          {isJoined ? (
            <div className="w-full text-center py-4 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
              <div className="flex items-center justify-center gap-2">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-green-700 font-semibold">Bạn đã tham gia</span>
              </div>
            </div>
          ) : (
            <button
              onClick={handleJoin}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 active:scale-[0.98]"
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Tham gia sự kiện
              </span>
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @media (min-width: 640px) {
          @keyframes slideUp {
            from {
              transform: translateY(20px) scale(0.95);
              opacity: 0;
            }
            to {
              transform: translateY(0) scale(1);
              opacity: 1;
            }
          }
        }
      `}</style>
    </div>
  );
}