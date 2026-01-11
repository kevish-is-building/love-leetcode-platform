"use client";

import { Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DeletePlaylistModalProps {
  isOpen: boolean;
  playlistName: string;
  onClose: () => void;
  onDelete: () => void;
  isLoading?: boolean;
}

export default function DeletePlaylistModal({
  isOpen,
  playlistName,
  onClose,
  onDelete,
  isLoading = false,
}: DeletePlaylistModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative w-full max-w-sm mx-4 bg-gray-900/95 backdrop-blur-xl border border-red-700/50 rounded-lg shadow-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-900/30 rounded-lg">
                <Trash2 className="w-6 h-6 text-red-500" />
              </div>
              <h2 className="text-lg font-bold text-red-400">
                Delete Playlist?
              </h2>
            </div>

            <p className="text-sm text-gray-300 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-white">"{playlistName}"</span>?
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm bg-gray-700/50 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onDelete}
                disabled={isLoading}
                className="px-4 py-2 text-sm bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
