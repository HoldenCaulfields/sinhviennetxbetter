'use client';
import { Marker } from "react-leaflet";
import { memo, useMemo } from "react";
import L from "leaflet";
import { UserProfile } from "@/types";

// Hàm tạo Icon HTML tĩnh cho Leaflet
function createMarkerIcon(marker: UserProfile) {
  const avatarUrl = marker.avatar || `/tet.jpg`;
  const latestHistory = marker.history?.[marker.history.length - 1];
  const score = latestHistory?.score || { fun: 50, study: 50 };
  const total = score.fun + score.study || 1;
  const funPercent = (score.fun / total) * 100;
  
  const size = 40; 
  const stroke = 4;
  const center = size / 2;
  const radius = center - stroke / 2;
  const circumference = radius * 2 * Math.PI;
  const funOffset = circumference - (funPercent / 100) * circumference;
  const glowColor = score.fun > score.study ? 'rgba(239, 68, 68, 0.4)' : 'rgba(59, 130, 246, 0.4)';

  return L.divIcon({
    className: "custom-marker-leaflet",
    iconSize: [size, size + 20],
    iconAnchor: [center, center + 10],
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center; width: ${size}px; height: ${size}px;">
        <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; filter: blur(10px); background: ${glowColor};"></div>
        <svg height="${size}" width="${size}" style="position: absolute; transform: rotate(-90deg); z-index: 20;">
          <circle stroke="#3B82F6" fill="white" stroke-width="${stroke}" r="${radius}" cx="${center}" cy="${center}" />
          <circle stroke="#EF4444" fill="transparent" stroke-width="${stroke}" stroke-dasharray="${circumference} ${circumference}" stroke-dashoffset="${funOffset}" stroke-linecap="round" r="${radius}" cx="${center}" cy="${center}" style="transition: stroke-dashoffset 0.5s ease;" />
        </svg>
        <div style="position: relative; width: ${size - stroke * 2}px; height: ${size - stroke * 2}px; border-radius: 50%; overflow: hidden; z-index: 30; border: 1px solid white;">
          <img src="${avatarUrl}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='/tet.jpg'" />
        </div>
        <div style="position: absolute; bottom: -18px; left: 50%; transform: translateX(-50%); z-index: 40;">
           <div class="bg-slate-800/90 text-white text-[8px] px-2 py-0.5 rounded-full whitespace-nowrap uppercase font-bold border border-white/20 shadow-sm">
             ${marker.name}
           </div>
        </div>
      </div>
    `,
  });
}

const UserMarker = memo(({ marker, onClick }: { marker: UserProfile; onClick: (marker: UserProfile) => void }) => {
  const customIcon = useMemo(() => createMarkerIcon(marker), [marker.avatar, marker.name, marker.history]);
  return (
    <Marker 
      position={marker.location} 
      icon={customIcon} 
      eventHandlers={{ click: () => onClick(marker) }} 
    />
  );
});

export default function AllMarkers({ users, onUserClick }: { users: UserProfile[], onUserClick: (u: UserProfile) => void }) {
  return (
    <>
      {users.map((user) => (
        <UserMarker key={user.id} marker={user} onClick={onUserClick} />
      ))}
    </>
  );
}