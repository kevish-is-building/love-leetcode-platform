"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface EditPlaylistModalProps {
  isOpen: boolean;
  playlist: { id: string; name: string; description?: string } | null;
  onClose: () => void;
  onSave: (data: { id: string; name: string; description: string }) => void;
  isLoading?: boolean;
}

export default function EditPlaylistModal({
  isOpen,
  playlist,
  onClose,
  onSave,
  isLoading = false,
}: EditPlaylistModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (playlist) {
      setName(playlist.name);
      setDescription(playlist.description || "");
    }
  }, [playlist]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !playlist) return;
    onSave({
      id: playlist.id,
      name: name.trim(),
      description: description.trim(),
    });
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && playlist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md mx-4 bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-lg shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
              <h2 className="text-xl font-semibold text-white">Edit Playlist</h2>
              <button
                onClick={handleClose}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label
                  htmlFor="edit-playlist-name"
                  className="block text-sm font-medium text-gray-300 mb-1.5"
                >
                  Playlist Name <span className="text-red-400">*</span>
                </label>
                <input
                  id="edit-playlist-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter playlist name"
                  className="w-full px-3 py-2.5 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label
                  htmlFor="edit-playlist-description"
                  className="block text-sm font-medium text-gray-300 mb-1.5"
                >
                  Description
                </label>
                <textarea
                  id="edit-playlist-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter playlist description (optional)"
                  rows={3}
                  className="w-full px-3 py-2.5 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!name.trim() || isLoading}
                  className="px-4 py-2 text-sm bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
