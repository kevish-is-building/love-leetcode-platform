"use client";

import { useState, useEffect } from "react";
import { X, Bookmark, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import { usePlaylistStore } from "@/store/usePlaylistStore";

interface AddProblemToPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  problemId: string;
  problemTitle?: string;
}

export default function AddProblemToPlaylistModal({
  isOpen,
  onClose,
  problemId,
  problemTitle = "this problem",
}: AddProblemToPlaylistModalProps) {
  const { playlists, isLoading, getAllPlaylists, addProblemToPlaylist } =
    usePlaylistStore();
  const [selectedPlaylistIds, setSelectedPlaylistIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch playlists when modal opens
  useEffect(() => {
    if (isOpen) {
      getAllPlaylists();
    }
  }, [isOpen, getAllPlaylists]);

  // Reset selections when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedPlaylistIds([]);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleTogglePlaylist = (playlistId: string) => {
    setSelectedPlaylistIds((prev) =>
      prev.includes(playlistId)
        ? prev.filter((id) => id !== playlistId)
        : [...prev, playlistId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPlaylistIds.length === 0) return;

    setIsSubmitting(true);
    try {
      // Add problem to all selected playlists
      await Promise.all(
        selectedPlaylistIds.map((playlistId) =>
          addProblemToPlaylist(playlistId, [problemId])
        )
      );
      onClose();
    } catch (error) {
      console.error("Error adding problem to playlists:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-transparent backdrop-blur-xs"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-md bg-transparent backdrop-blur-xl border border-gray-700/50 rounded-sm shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded">
                  <Bookmark className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Add to Playlist
                  </h2>
                  <p className="text-sm text-gray-400 mt-0.5">
                    Save {problemTitle} to your playlists
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="p-2 text-gray-400 hover:text-rose-600 hover:bg-gray-800 rounded-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <form onSubmit={handleSubmit} className="p-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                </div>
              ) : playlists.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800/50 flex items-center justify-center">
                    <Bookmark className="w-8 h-8 text-gray-600" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">
                    No Playlists Yet
                  </h3>
                  <p className="text-sm text-gray-400 mb-6">
                    Create a playlist first to start organizing your problems
                  </p>
                  <Button
                    type="button"
                    onClick={handleClose}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Got it
                  </Button>
                </div>
              ) : (
                <>
                  {/* Playlists List */}
                  <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
                    {playlists.map((playlist) => {
                      const isSelected = selectedPlaylistIds.includes(
                        playlist.id
                      );
                      const problemCount = playlist.problems?.length || 0;

                      return (
                        <motion.label
                          key={playlist.id}
                          htmlFor={`playlist-${playlist.id}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            isSelected
                              ? "border-purple-500 bg-purple-500/10"
                              : "border-gray-700/50 bg-gray-800/30 hover:border-gray-600 hover:bg-gray-800/50"
                          }`}
                        >
                          {/* Checkbox */}
                          <input
                            type="checkbox"
                            id={`playlist-${playlist.id}`}
                            checked={isSelected}
                            onChange={() => handleTogglePlaylist(playlist.id)}
                            disabled={isSubmitting}
                            className="mt-1 w-4 h-4 rounded border-gray-600 text-purple-600 focus:ring-purple-500 focus:ring-offset-0 bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          />

                          {/* Playlist Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-white mb-1 truncate">
                              {playlist.name}
                            </h3>
                            {playlist.description && (
                              <p className="text-xs text-gray-400 line-clamp-2 mb-1">
                                {playlist.description}
                              </p>
                            )}
                            <p className="text-xs text-gray-500">
                              {problemCount}{" "}
                              {problemCount === 1 ? "problem" : "problems"}
                            </p>
                          </div>
                        </motion.label>
                      );
                    })}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-700/50">
                    <p className="text-sm text-gray-400">
                      {selectedPlaylistIds.length} selected
                    </p>
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-full border-purple-500/30 bg-transparent text-white hover:bg-purple-500/40 hover:text-white cursor-pointer"
                        size="lg"
                        onClick={handleClose}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="group rounded-full border-t border-purple-400 bg-linear-to-b from-purple-700 to-slate-950/80  text-white shadow-lg shadow-purple-600/20 transition-all hover:shadow-purple-600/40 cursor-pointer"
                        size="lg"
                        disabled={
                          selectedPlaylistIds.length === 0 || isSubmitting
                        }
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          <>
                            Add to Playlist
                            {selectedPlaylistIds.length > 1 ? "s" : ""}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
