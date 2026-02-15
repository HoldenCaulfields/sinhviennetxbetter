'use client';
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import CustomMarker from './CustomMarker';
import { UserProfile, PersonaScore, DiscoveryMode } from '@/types';
import AllMarkers from './AllMarkers';

interface MapLayerProps {
  myProfile: UserProfile;
  personaScore: PersonaScore;
  firestoreUsers: UserProfile[];
  discoveryMode: DiscoveryMode;
  centerTrigger: number;
  onUserClick: (user: UserProfile) => void;
  onOpenEdit: () => void;
}

const MapController: React.FC<{ location: [number, number], trigger: number }> = ({ location, trigger }) => {
  const map = useMap();
  useEffect(() => {
    if (trigger > 0) {
      map.flyTo(location as any, 14, { duration: 1.5 });
    }
  }, [trigger, location, map]);
  return null;
};

const INITIAL_LOCATION: [number, number] = [16, 107];

const MapLayer: React.FC<MapLayerProps> = ({
  myProfile,
  personaScore,
  firestoreUsers,
  discoveryMode,
  centerTrigger,
  onUserClick, onOpenEdit,
}) => {
  const isSelfMode = discoveryMode === 'self';

  return (
    <div className="absolute inset-0">
      <MapContainer
        center={INITIAL_LOCATION}
        zoom={6} // Tăng zoom mặc định để thấy rõ khu vực hơn
        zoomControl={false}
        minZoom={3}
        style={{ height: "100%", width: "100%" }}
        maxBounds={[[-85, -180], [85, 180]]}
        maxBoundsViscosity={1.0}
        preferCanvas={true} // TỐI ƯU: Vẽ markers bằng Canvas giúp mượt hơn trên mobile
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution=' &copy; <a href="https://carto.com/">CARTO</a>'
        />
        <MapController location={myProfile.location} trigger={centerTrigger} />
        
        <AllMarkers users={firestoreUsers} onUserClick={onUserClick} />
      </MapContainer>

      {/* Ghost Marker Centerpiece - Tinh hoa thiết kế */}
        <div className={`absolute inset-0 z-[3000] flex items-center justify-center pointer-events-none overflow-hidden ${isSelfMode ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>

          {/* Lớp phủ khí quyển */}
          <div className="absolute inset-0 bg-slate-900/[0.02]" />

          {/* Radar Sóng Nước & Lửa */}
          <div className="absolute w-[220px] h-[220px] sm:w-[320px] sm:h-[320px] rounded-full border-2 border-blue-400/20 animate-ping opacity-20" />
          <div className="absolute w-[440px] h-[440px] sm:w-[640px] sm:h-[640px] rounded-full border-2 border-red-400/10 animate-ping opacity-10" style={{ animationDelay: '1s' }} />

          {/* Tâm điểm ngắm (Crosshair) */}
          <div className="absolute w-[1px] h-32 sm:h-48 bg-gradient-to-b from-transparent via-slate-400/30 to-transparent" />
          <div className="absolute h-[1px] w-32 sm:w-48 bg-gradient-to-r from-transparent via-slate-400/30 to-transparent" />

          {/* Các vòng quay cơ khí nghệ thuật */}
          <div className="absolute w-40 h-40 sm:w-56 sm:h-56 border border-dashed border-red-500/40 rounded-full animate-[spin_10s_linear_infinite]" />
          <div className="absolute w-48 h-48 sm:w-64 sm:h-64 border border-dashed border-blue-500/30 rounded-full animate-[spin_15s_linear_infinite_reverse]" />

          {/* Marker Trung Tâm - Với ID 'persona-center' cho connection lines */}
          <div id="persona-center" className="transform scale-125 sm:scale-150 transition-all duration-700 hover:scale-110">
            <CustomMarker user={myProfile}  myScore={personaScore} onOpenEdit={onOpenEdit} />
          </div>

          {/* Khung góc phong cách Sci-Fi */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 sm:w-64 sm:h-64 pointer-events-none">
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-red-500/50 rounded-tl-xl" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-blue-500/50 rounded-tr-xl" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-red-500/50 rounded-bl-xl" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-blue-500/50 rounded-br-xl" />
          </div>

        </div>
    </div>
  );
};

export default MapLayer;
