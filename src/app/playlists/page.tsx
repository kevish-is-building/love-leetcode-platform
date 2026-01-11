"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Globe, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { usePlaylistStore } from "@/store/usePlaylistStore";
import { useAuthStore } from "@/store/useAuthStore";
import {
  PlaylistCard,
  CreatePlaylistModal,
  DeletePlaylistModal,
  EditPlaylistModal,
} from "@/components/playlist";
import Loader from "@/components/ui/loader";

export default function PlaylistsPage() {
  const { user } = useAuthStore();
  const {
    playlists,
    isLoading,
    getAllPlaylists,
    createPlaylist,
    deletePlaylist,
    updatePlaylist,
    removeProblemFromPlaylist,
  } = usePlaylistStore();

  // View state: "personal" or "public"
  const [viewMode, setViewMode] = useState<"personal" | "public">("personal");

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<any>(null);

  // Fetch playlists on mount
  useEffect(() => {
    getAllPlaylists();
  }, [getAllPlaylists]);

  // Handle create playlist
  const handleCreatePlaylist = useCallback(
    async (data: { name: string; description: string }) => {
      try {
        await createPlaylist(data);
        setShowCreateModal(false);
      } catch (error) {
        console.error("Failed to create playlist:", error);
      }
    },
    [createPlaylist]
  );

  // Handle delete playlist
  const handleDeleteClick = useCallback((playlist: any) => {
    setSelectedPlaylist(playlist);
    setShowDeleteModal(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!selectedPlaylist) return;
    try {
      await deletePlaylist(selectedPlaylist.id);
      setShowDeleteModal(false);
      setSelectedPlaylist(null);
    } catch (error) {
      console.error("Failed to delete playlist:", error);
    }
  }, [selectedPlaylist, deletePlaylist]);

  // Handle edit playlist
  const handleEditClick = useCallback((playlist: any) => {
    setSelectedPlaylist(playlist);
    setShowEditModal(true);
  }, []);

  const handleSaveEdit = useCallback(
    async (data: { id: string; name: string; description: string }) => {
      try {
        await updatePlaylist(data.id, {
          name: data.name,
          description: data.description,
        });
        setShowEditModal(false);
        setSelectedPlaylist(null);
      } catch (error) {
        console.error("Failed to update playlist:", error);
      }
    },
    [updatePlaylist]
  );

  // Handle remove problem from playlist
  const handleRemoveProblem = useCallback(
    async (playlistId: string, problemId: string) => {
      try {
        await removeProblemFromPlaylist(playlistId, [problemId]);
      } catch (error) {
        console.error("Failed to remove problem:", error);
      }
    },
    [removeProblemFromPlaylist]
  );

  // Filter playlists based on view mode
  const filteredPlaylists = playlists.filter((playlist) => {
    if (viewMode === "personal") {
      return playlist.userId === user?.id;
    }
    // Public playlists (for future implementation)
    return playlist.isPublic;
  });

  if (isLoading && playlists.length === 0) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
                className="text-4xl md:text-5xl font-bold bg-linear-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-3"
              >
                Your Problem Playlists
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
                className="text-gray-400 text-lg"
              >
                Organize and track your coding journey with custom problem collections.
              </motion.p>
            </div>

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex items-center gap-3"
            >
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-purple-500/20"
              >
                <Plus className="w-5 h-5" />
                Create new playlist
              </button>

              <button
                onClick={() =>
                  setViewMode(viewMode === "personal" ? "public" : "personal")
                }
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-700/50 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-600/50 rounded-lg font-medium transition-all"
              >
                {viewMode === "personal" ? (
                  <>
                    <Globe className="w-5 h-5" />
                    Switch to Public
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Switch to Personal
                  </>
                )}
              </button>
            </motion.div>
          </div>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="h-px bg-linear-to-r from-transparent via-gray-600 to-transparent mt-6"
          />
        </motion.div>

        {/* Playlists Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.7 }}
        >
          {filteredPlaylists.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredPlaylists.map((playlist, index) => (
                  <motion.div
                    key={playlist.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                  >
                    <PlaylistCard
                      id={playlist.id}
                      name={playlist.name}
                      description={playlist.description}
                      problems={playlist.problems || []}
                      onEdit={() => handleEditClick(playlist)}
                      onDelete={() => handleDeleteClick(playlist)}
                      onRemoveProblem={handleRemoveProblem}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-16"
            >
              <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-12 max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {viewMode === "personal"
                    ? "No Playlists Yet"
                    : "No Public Playlists"}
                </h3>
                <p className="text-gray-400 mb-6">
                  {viewMode === "personal"
                    ? "Create your first playlist to start organizing problems."
                    : "No public playlists are available at the moment."}
                </p>
                {viewMode === "personal" && (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    Create Playlist
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Modals */}
      <CreatePlaylistModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreatePlaylist}
        isLoading={isLoading}
      />

      <DeletePlaylistModal
        isOpen={showDeleteModal}
        playlistName={selectedPlaylist?.name || ""}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedPlaylist(null);
        }}
        onDelete={handleConfirmDelete}
        isLoading={isLoading}
      />

      <EditPlaylistModal
        isOpen={showEditModal}
        playlist={selectedPlaylist}
        onClose={() => {
          setShowEditModal(false);
          setSelectedPlaylist(null);
        }}
        onSave={handleSaveEdit}
        isLoading={isLoading}
      />
    </div>
  );
}