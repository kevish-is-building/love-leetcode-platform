"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";

interface CreatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: { name: string; description: string }) => void;
  isLoading?: boolean;
}

export default function CreatePlaylistModal({
  isOpen,
  onClose,
  onCreate,
  isLoading = false,
}: CreatePlaylistModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate({ name: name.trim(), description: description.trim() });
    setName("");
    setDescription("");
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
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
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md mx-4 bg-transparent backdrop-blur-xl border border-gray-700/50 rounded-sm shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
              <h2 className="text-xl font-semibold text-white">
                Create New Playlist
              </h2>
              <button
                onClick={handleClose}
                className="group p-1.5 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-sm transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 group-hover:text-rose-700 transition-all group-hover:rotate-90" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label
                  htmlFor="playlist-name"
                  className="block text-sm font-medium text-gray-300 mb-1.5"
                >
                  Playlist Name <span className="text-red-400">*</span>
                </label>
                <input
                  id="playlist-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter playlist name"
                  className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-0 focus:ring-purple-500/50 transition-all"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label
                  htmlFor="playlist-description"
                  className="block text-sm font-medium text-gray-300 mb-1.5"
                >
                  Description
                </label>
                <textarea
                  id="playlist-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter playlist description (optional)"
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring focus:ring-purple-500/50 transition-all resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
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
                  disabled={!name.trim() || isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Creating...
                    </span>
                  ) : (
                    "Create Playlist"
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
