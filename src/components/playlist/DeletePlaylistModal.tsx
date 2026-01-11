"use client";

import { Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";

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
            className="absolute inset-0 bg-transparent backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative w-full max-w-sm mx-4 bg-transparent backdrop-blur-lg border border-red-700/50 rounded-sm shadow-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg">
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
              <Button
                  type="button"
                  variant="outline"
                  className="rounded-full border-purple-500/30 bg-transparent text-white hover:bg-purple-500/40 hover:text-white cursor-pointer"
                  size="lg"
                  onClick={onClose}
                >
                  Cancel
                </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={onDelete}
                disabled={isLoading}
                className="rounded-full border-purple-500/30 bg-transparent text-white hover:bg-rose-600 hover:text-white cursor-pointer"
              >
                {isLoading ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
