"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { X, Plus, ArrowUpRight, Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Problem {
  id: string;
  title: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  tags?: string[];
  solvedBy?: Array<{ userId: string }>;
}

interface AddProblemModalProps {
  isOpen: boolean;
  playlistName: string;
  playlistId: string;
  existingProblemIds: string[];
  allProblems: Problem[];
  currentUserId?: string;
  isLoadingProblems?: boolean;
  onClose: () => void;
  onAddProblem: (playlistId: string, problemId: string) => Promise<void>;
}

// Difficulty color helper
const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "EASY":
      return "text-green-400";
    case "MEDIUM":
      return "text-yellow-400";
    case "HARD":
      return "text-red-400";
    default:
      return "text-gray-400";
  }
};

// Problem row component
const ProblemRow = ({
  problem,
  isSolved,
  isAdding,
  onAdd,
}: {
  problem: Problem;
  isSolved: boolean;
  isAdding: boolean;
  onAdd: () => void;
}) => {
  const visibleTags = problem.tags?.slice(0, 2) || [];
  const remainingCount = (problem.tags?.length || 0) - 2;

  return (
    <div className="flex items-center justify-between py-3 px-1">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Link
          href={`/problem/${problem.id}`}
          className={`flex items-center gap-2 transition-colors min-w-0 ${
            isSolved
              ? "text-green-400 hover:text-green-300"
              : "text-blue-400 hover:text-blue-300"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <ArrowUpRight className="w-4 h-4 shrink-0" />
          <span className="font-medium truncate hover:underline">
            {problem.title}
          </span>
        </Link>
        <span className={`text-xs shrink-0 ${getDifficultyColor(problem.difficulty)}`}>
          {problem.difficulty.charAt(0) + problem.difficulty.slice(1).toLowerCase()}
        </span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {/* Tags - show max 2 */}
        <div className="hidden sm:flex items-center gap-1">
          {visibleTags.map((tag, idx) => (
            <span
              key={`${problem.id}-${tag}-${idx}`}
              className="px-2 py-0.5 text-xs bg-gray-800 text-gray-400 rounded"
            >
              {tag}
            </span>
          ))}
          {remainingCount > 0 && (
            <span className="px-2 py-0.5 text-xs bg-gray-800 text-gray-500 rounded">
              +{remainingCount}
            </span>
          )}
        </div>

        {/* Add button */}
        <button
          onClick={onAdd}
          disabled={isAdding}
          className="p-1.5 rounded border bg-gray-800 border-gray-700 text-gray-300 hover:bg-purple-600 hover:border-purple-500 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Add to playlist"
        >
          {isAdding ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
};

export default function AddProblemModal({
  isOpen,
  playlistName,
  playlistId,
  existingProblemIds,
  allProblems,
  currentUserId,
  isLoadingProblems = false,
  onClose,
  onAddProblem,
}: AddProblemModalProps) {
  const [addingProblemId, setAddingProblemId] = useState<string | null>(null);
  const [addedProblems, setAddedProblems] = useState<Set<string>>(new Set());

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setAddingProblemId(null);
      setAddedProblems(new Set());
    }
  }, [isOpen]);

  // Filter out problems already in the playlist
  const availableProblems = useMemo(() => {
    const existingSet = new Set(existingProblemIds);
    return allProblems.filter(
      (problem) => !existingSet.has(problem.id) && !addedProblems.has(problem.id)
    );
  }, [allProblems, existingProblemIds, addedProblems]);

  // Check if problem is solved by current user
  const isProblemSolved = (problem: Problem) => {
    if (!currentUserId || !problem.solvedBy) return false;
    return problem.solvedBy.some((solver) => solver.userId === currentUserId);
  };

  // Handle adding a single problem
  const handleAddProblem = async (problemId: string) => {
    setAddingProblemId(problemId);
    try {
      await onAddProblem(playlistId, problemId);
      setAddedProblems((prev) => new Set(prev).add(problemId));
    } catch (error) {
      console.error("Failed to add problem:", error);
    } finally {
      setAddingProblemId(null);
    }
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
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md mx-4 bg-gray-900 border border-gray-800 rounded-lg shadow-2xl max-h-[70vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <h2 className="text-lg font-medium text-white">
                Add problem to {playlistName}
              </h2>
              <button
                onClick={onClose}
                className="p-1 text-gray-500 hover:text-white rounded transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Problems list */}
            <div className="flex-1 overflow-y-auto">
              {isLoadingProblems ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                </div>
              ) : availableProblems.length > 0 ? (
                <div className="divide-y divide-gray-800">
                  {availableProblems.map((problem) => (
                    <ProblemRow
                      key={problem.id}
                      problem={problem}
                      isSolved={isProblemSolved(problem)}
                      isAdding={addingProblemId === problem.id}
                      onAdd={() => handleAddProblem(problem.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>No more problems to add.</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-4 border-t border-gray-800">
              <span className="text-sm text-gray-500">
                {isLoadingProblems
                  ? "Loading problems..."
                  : availableProblems.length > 0
                  ? `${availableProblems.length} available`
                  : "All problems added"}
              </span>
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 text-white rounded transition-colors"
              >
                Done
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
