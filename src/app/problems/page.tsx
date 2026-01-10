"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  CheckCircle,
  ArrowUpRight,
  Bookmark,
  TrashIcon,
  PenBoxIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useAuthStore } from "@/store/useAuthStore";
import { useProblemStore } from "@/store/useProblemStore";

// Types
interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}

// Confirm Delete Modal Component
function ConfirmDeleteModal({
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

// Main Problems Page Component
export default function ProblemsPage() {
  const { user } = useAuthStore();
  const { problems, isLoading: problemsLoading, fetchProblems, onDeleteProblem } = useProblemStore();

  // State management
  const [visibleCount, setVisibleCount] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteProblemId, setDeleteProblemId] = useState<string | null>(null);

  // Fetch problems on mount
  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);

  // Infinite scroll handler - optimized with useCallback
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 300 &&
      visibleCount < problems.length &&
      !isLoading
    ) {
      setIsLoading(true);
      setTimeout(() => {
        setVisibleCount((prev) => Math.min(prev + 10, problems.length));
        setIsLoading(false);
      }, 300);
    }
  }, [visibleCount, problems.length, isLoading]);

  // Scroll event listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Auto-load more if viewport isn't filled
  useEffect(() => {
    if (
      document.body.scrollHeight <= window.innerHeight &&
      visibleCount < problems.length &&
      !isLoading
    ) {
      setIsLoading(true);
      setTimeout(() => {
        setVisibleCount((prev) => Math.min(prev + 10, problems.length));
        setIsLoading(false);
      }, 300);
    }
  }, [visibleCount, problems.length, isLoading]);

  // Delete handlers
  const handleDeleteClick = useCallback((id: string) => {
    setDeleteProblemId(id);
    setShowDeleteModal(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteProblemId) return;

    try {
      await onDeleteProblem(deleteProblemId);
      setShowDeleteModal(false);
      setDeleteProblemId(null);
    } catch (error) {
      console.error("Failed to delete problem:", error);
    }
  }, [deleteProblemId, onDeleteProblem]);

  const handleCancelDelete = useCallback(() => {
    setShowDeleteModal(false);
    setDeleteProblemId(null);
  }, []);

  // Bookmark handler
  const handleAddToPlaylist = useCallback((problemId: string) => {
    // TODO: Implement add to playlist functionality
    console.log("Add to playlist:", problemId);
  }, []);

  // Difficulty color helper - memoized
  const getDifficultyColor = useCallback((difficulty: string) => {
    switch (difficulty) {
      case "EASY":
        return "text-green-300 bg-green-900/30 border border-green-500/30";
      case "MEDIUM":
        return "text-yellow-300 bg-yellow-900/30 border border-yellow-500/30";
      case "HARD":
        return "text-red-300 bg-red-900/30 border border-red-500/30";
      default:
        return "text-gray-300 bg-gray-900/30 border border-gray-500/30";
    }
  }, []);

  const isAdmin = user?.role === "ADMIN";

  return (
    <div className="min-h-screen [background:radial-gradient(125%_125%_at_50%_10%,#000_50%,#63e_100%)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-12"
        >
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
            className="text-4xl md:text-5xl font-bold bg-linear-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-3"
          >
            Problem Set
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
            className="text-gray-300 text-lg"
          >
            Sharpen your coding skills with our curated collection of
            algorithmic challenges.
          </motion.p>
        </motion.div>

        {/* Problems Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.7 }}
          className="rounded-2xl bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 overflow-hidden shadow-2xl"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-900/50 border-b border-gray-700/50">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider">
                    Save
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider">
                    Difficulty
                  </th>
                  {isAdmin && (
                    <th className="px-6 py-4 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                  <th className="px-6 py-4 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider">
                    Tags
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/30">
                <AnimatePresence mode="popLayout">
                  {problems
                    .slice(0, visibleCount)
                    .map((problem, idx) => {
                      const isSolved = (problem?.solvedBy?.length ?? 0) > 0;

                      return (
                        <motion.tr
                          key={problem.id}
                          className="group transition-all duration-300 hover:bg-gray-700/30"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{
                            duration: 0.3,
                            delay: idx * 0.02,
                            ease: "easeOut",
                          }}
                        >
                          <td className="px-6 py-5 whitespace-nowrap">
                            {isSolved ? (
                              <CheckCircle className="h-6 w-6 text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.6)]" />
                            ) : (
                              <div className="h-6 w-6 rounded-full border-2 border-gray-500 group-hover:border-purple-400 transition-colors" />
                            )}
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <button
                              className="text-purple-400 hover:text-purple-300 hover:scale-110 transition-all duration-300 cursor-pointer"
                              onClick={() => handleAddToPlaylist(problem.id)}
                              aria-label="Add to playlist"
                            >
                              <Bookmark className="w-5 h-5" />
                            </button>
                          </td>
                          <td className="px-6 py-5">
                            <Link
                              href={`/problem/${problem.id}`}
                              className="text-blue-400 hover:text-blue-300 font-medium flex items-center group/link transition-colors"
                            >
                              <span className="group-hover/link:underline">
                                {problem.title}
                              </span>
                              <ArrowUpRight className="ml-1.5 h-4 w-4 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                            </Link>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <span
                              className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${getDifficultyColor(
                                problem.difficulty
                              )}`}
                            >
                              {problem.difficulty}
                            </span>
                          </td>
                          {isAdmin && (
                            <td className="px-6 py-5 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <Link
                                  href="/add-problem"
                                  className="text-blue-400 hover:text-blue-300 hover:scale-110 transition-all duration-300"
                                  aria-label="Edit problem"
                                >
                                  <PenBoxIcon className="w-5 h-5" />
                                </Link>
                                <button
                                  onClick={() => handleDeleteClick(problem.id)}
                                  className="text-red-400 hover:text-red-300 hover:scale-110 transition-all duration-300 cursor-pointer"
                                  aria-label="Delete problem"
                                >
                                  <TrashIcon className="w-5 h-5" />
                                </button>
                              </div>
                            </td>
                          )}
                          <td className="px-6 py-5">
                            <div className="flex flex-wrap gap-2">
                              {problem?.tags?.slice(0, 2).map((tag, index) => (
                                <span
                                  key={`${problem.id}-${tag}-${index}`}
                                  className="px-3 py-1 text-xs bg-purple-900/30 text-purple-200 rounded-lg border border-purple-500/30 font-medium"
                                >
                                  {tag}
                                </span>
                              )) || (
                                <span className="text-gray-500 text-xs">
                                  No tags
                                </span>
                              )}
                              {problem?.tags && problem.tags.length > 2 && (
                                <span className="px-3 py-1 text-xs bg-purple-900/30 text-purple-200 rounded-lg border border-purple-500/30 font-medium">
                                  +{problem.tags.length - 2}
                                </span>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Loading More Indicator */}
        {visibleCount < problems.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <div className="inline-flex items-center gap-2 text-purple-400 font-medium">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse [animation-delay:100ms]" />
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse [animation-delay:200ms]" />
              <span className="ml-2">Loading more problems...</span>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {problems.length === 0 && !problemsLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16 mt-8"
          >
            <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-12 max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-white mb-2">
                No Problems Found
              </h3>
              <p className="text-gray-400">
                No problems available at the moment.
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <ConfirmDeleteModal
            isOpen={showDeleteModal}
            onClose={handleCancelDelete}
            onDelete={handleConfirmDelete}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
