'use client';

import { useAppState } from '@/hooks/useAppState';
import UIOverlay from '@/components/UI/UIOverlay';
import PersonaDetailModal from '@/components/Modals/PersonaDetailModal';
import dynamic from "next/dynamic";
import Loading from "./Loading";
import EditProfileModal from './Modals/EditProfileModal';
import CreateEventModal from './Modals/CreateEventModal';
import EventModal from './Modals/EventModal';

const MapLayer = dynamic(() => import('@/components/Map/MapLayer'), {
  ssr: false,
  loading: () => (
    <Loading />
  ),
});

export default function App() {
  const {
    viewMode, setViewMode,
    discoveryMode, setDiscoveryMode,
    isReviewModalOpen, setIsReviewModalOpen,
    isEditProfileOpen, setIsEditProfileOpen,
    centerTrigger, activeFilter, setActiveFilter,
    myProfile, setMyProfile,
    activeCategory, setActiveCategory,
    selectedUser, setSelectedUser,
    personaScore,
    firestoreUsers, filteredUsers, handleBlastFirework, handleJoinEvent,
    handleToggleOption, handleAddCustomTag, handleRemoveCustomTag, handleUpdateProfile,
    handleOpenReview, handleConfirmSave, handleRecenter, handleResetDraft, handleUpdateAvatar,
    handleCreateEvent, isEventModalOpen, setIsEventModalOpen,
    selectedEvent, setSelectedEvent, onEventClick, events,
    sortedCategories, mapLocation,
  } = useAppState();

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#F1F5F9]">

      {/* Map Layer - Handles background and markers */}
      <MapLayer
        myProfile={myProfile}
        personaScore={personaScore}
        firestoreUsers={firestoreUsers} filteredUsers={filteredUsers}
        discoveryMode={discoveryMode}
        centerTrigger={centerTrigger}
        onUserClick={setSelectedUser}
        onOpenEdit={() => setIsEditProfileOpen(true)}
        events={events} onEventClick={onEventClick}
        mapLocation={mapLocation}
      />

      {/* UI Overlay - Handles timeline navigation, floating menus, filters, and HUD */}
      <UIOverlay
        viewMode={viewMode}
        setViewMode={setViewMode}
        discoveryMode={discoveryMode}
        setDiscoveryMode={setDiscoveryMode}
        isReviewModalOpen={isReviewModalOpen}
        setIsReviewModalOpen={setIsReviewModalOpen}
        myProfile={myProfile}
        setMyProfile={setMyProfile}
        personaScore={personaScore}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        handleToggleOption={handleToggleOption}
        handleAddCustomTag={handleAddCustomTag}
        handleRemoveCustomTag={handleRemoveCustomTag}
        handleOpenReview={handleOpenReview}
        handleConfirmSave={handleConfirmSave}
        handleRecenter={handleRecenter}
        handleResetDraft={handleResetDraft}
        setSelectedUser={setSelectedUser}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        handleBlastFirework={handleBlastFirework}
        handleJoinEvent={handleJoinEvent}
        setIsEventModalOpen={setIsEventModalOpen}
        sortedCategories={sortedCategories}
      />

      {/* Standalone Modals (outside UI hierarchy to prevent stacking context issues) */}
      {selectedUser && (
        <PersonaDetailModal
          user={selectedUser}
          myScore={personaScore}
          myLocation={myProfile.location}
          onClose={() => setSelectedUser(null)}
        />
      )}

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <EditProfileModal
          profile={myProfile}
          onSave={handleUpdateProfile}
          onClose={() => setIsEditProfileOpen(false)}
        />
      )}

      {isEventModalOpen && (
        <CreateEventModal
          userLocation={myProfile.location}
          onClose={() => setIsEventModalOpen(false)}
          onSave={handleCreateEvent}
        />
      )}

      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}

      {/* Global Style / Animations */}
      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
