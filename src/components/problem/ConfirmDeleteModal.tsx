import { motion } from "framer-motion";
import { TrashIcon } from "lucide-react";


// Types
interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onDelete,
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-zinc-900 border border-red-700 rounded-lg shadow-xl p-6 w-full max-w-xs relative"
      >
        <div className="flex items-center gap-3 mb-4">
          <TrashIcon className="w-7 h-7 text-red-500" />
          <span className="text-lg font-bold text-red-400">
            Delete Problem?
          </span>
        </div>
        <p className="text-sm text-red-300 mb-6">
          Are you sure you want to delete this problem? This action cannot be
          undone.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-1 rounded bg-zinc-800 text-zinc-300 hover:bg-zinc-700 text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-1 rounded bg-red-600 text-white font-semibold hover:bg-red-700 text-sm shadow transition-colors"
          >
            Delete Now
          </button>
        </div>
      </motion.div>
    </div>
  );
}