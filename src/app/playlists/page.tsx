"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Globe, Lock, PlusIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { usePlaylistStore } from "@/store/usePlaylistStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useProblemStore } from "@/store/useProblemStore";
import {
  PlaylistCard,
  CreatePlaylistModal,
  DeletePlaylistModal,
  EditPlaylistModal,
  AddProblemModal,
} from "@/components/playlist";
import Loader from "@/components/ui/loader";
import { Button } from "@/components/ui/button";

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
    addProblemToPlaylist,
  } = usePlaylistStore();
  const { problems: allProblems, fetchProblems, isLoading: isLoadingProblems } = useProblemStore();

  // View state: "personal" or "public"
  const [viewMode, setViewMode] = useState<"personal" | "public">("personal");

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddProblemModal, setShowAddProblemModal] = useState(false);
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

  // Handle add problem to playlist
  const handleAddProblemClick = useCallback(
    (playlist: any) => {
      setSelectedPlaylist(playlist);
      setShowAddProblemModal(true);
      // Fetch problems when modal opens
      fetchProblems();
    },
    [fetchProblems]
  );

  const handleAddProblem = useCallback(
    async (playlistId: string, problemId: string) => {
      await addProblemToPlaylist(playlistId, [problemId]);
      // Refresh playlists to get updated data
      await getAllPlaylists();
    },
    [addProblemToPlaylist, getAllPlaylists]
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
                Organize and track your coding journey with custom problem
                collections.
              </motion.p>
            </div>

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex items-center gap-3"
            >
              <Button
                className="group rounded-full border-t border-purple-400 bg-linear-to-b from-purple-700 to-slate-950/80  text-white shadow-lg shadow-purple-600/20 transition-all hover:shadow-purple-600/40 cursor-pointer"
                size="lg"
                onClick={() => setShowCreateModal(true)}
              >
                Create new playlist
                <PlusIcon className="transition-transform duration-300 group-hover:rotate-180" />
              </Button>

              <Button
                variant="outline"
                className="rounded-full border-purple-500/30 bg-transparent text-white hover:bg-purple-500/10 hover:text-white cursor-pointer"
                size="lg"
                onClick={() =>
                  setViewMode(viewMode === "personal" ? "public" : "personal")
                }
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
              </Button>
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
                      currentUserId={user?.id}
                      onEdit={() => handleEditClick(playlist)}
                      onDelete={() => handleDeleteClick(playlist)}
                      onRemoveProblem={handleRemoveProblem}
                      onAddProblem={() => handleAddProblemClick(playlist)}
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
              <div className="bg-transparent backdrop-blur-sm border border-gray-700/50 rounded-sm p-8 max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
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
                  <Button
                    className="group rounded-full border-t border-purple-400 bg-linear-to-b from-purple-700 to-slate-950/80  text-white shadow-lg shadow-purple-600/20 transition-all hover:shadow-purple-600/40 cursor-pointer"
                    size="lg"
                    onClick={() => setShowCreateModal(true)}
                  >
                    Create new playlist
                    <PlusIcon className="transition-transform duration-300 group-hover:rotate-180" />
                  </Button>
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

      <AddProblemModal
        isOpen={showAddProblemModal}
        playlistName={selectedPlaylist?.name || ""}
        playlistId={selectedPlaylist?.id || ""}
        existingProblemIds={
          selectedPlaylist?.problems?.map((p: any) => p.id) || []
        }
        allProblems={allProblems}
        currentUserId={user?.id}
        isLoadingProblems={isLoadingProblems}
        onClose={() => {
          setShowAddProblemModal(false);
          setSelectedPlaylist(null);
        }}
        onAddProblem={handleAddProblem}
      />
    </div>
  );
}
