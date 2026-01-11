"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { ArrowUpRight, X, Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

interface Problem {
  id: string;
  title: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  tags?: string[];
}

interface PlaylistCardProps {
  id: string;
  name: string;
  description?: string;
  problems: Problem[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onRemoveProblem?: (playlistId: string, problemId: string) => void;
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

// Progress bar component
const ProgressBar = ({ solved, total }: { solved: number; total: number }) => {
  const percentage = total > 0 ? (solved / total) * 100 : 0;

  return (
    <div className="w-full">
      <div className="flex justify-end mb-1">
        <span className="text-xs text-gray-400">progress</span>
      </div>
      <div className="w-full h-2 bg-gray-700/50 rounded-full overflow-hidden border border-gray-600/50">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full bg-linear-to-r from-purple-500 to-blue-500"
        />
      </div>
    </div>
  );
};

// Problem item component
const ProblemItem = ({
  problem,
  onRemove,
}: {
  problem: Problem;
  onRemove?: () => void;
}) => {
  return (
    <div className="flex items-center justify-between py-2 group">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Link
          href={`/problem/${problem.id}`}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors min-w-0"
        >
          <ArrowUpRight className="w-4 h-4 shrink-0" />
          <span className="font-medium truncate hover:underline">
            {problem.title}
          </span>
        </Link>
        <span className={`text-xs ${getDifficultyColor(problem.difficulty)}`}>
          {problem.difficulty.charAt(0) + problem.difficulty.slice(1).toLowerCase()}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {/* Tags */}
        <div className="hidden sm:flex items-center gap-1.5">
          {problem.tags?.slice(0, 3).map((tag, index) => (
            <span
              key={`${problem.id}-${tag}-${index}`}
              className="px-2 py-0.5 text-xs bg-gray-800/80 text-gray-300 rounded border border-gray-600/50"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Remove button */}
        {onRemove && (
          <button
            onClick={onRemove}
            className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded transition-all opacity-0 group-hover:opacity-100"
            aria-label="Remove problem from playlist"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default function PlaylistCard({
  id,
  name,
  description,
  problems,
  onEdit,
  onDelete,
  onRemoveProblem,
}: PlaylistCardProps) {
  const [expanded, setExpanded] = useState(true);
  const solvedCount = 0; // TODO: Calculate based on user's solved problems

  const handleRemoveProblem = useCallback(
    (problemId: string) => {
      onRemoveProblem?.(id, problemId);
    },
    [id, onRemoveProblem]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-lg overflow-hidden shadow-xl"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-700/50">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-semibold text-white truncate">
              {name}
            </h3>
            {description && (
              <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                {description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onEdit && (
              <button
                onClick={() => onEdit(id)}
                className="px-3 py-1.5 text-sm bg-gray-700/50 hover:bg-gray-700 text-gray-300 hover:text-white rounded border border-gray-600/50 transition-all"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(id)}
                className="px-3 py-1.5 text-sm bg-gray-700/50 hover:bg-red-900/30 text-gray-300 hover:text-red-400 rounded border border-gray-600/50 hover:border-red-500/30 transition-all"
              >
                Delete
              </button>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-2">
          <span className="text-sm text-gray-400">
            {problems.length} problem{problems.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Problems list */}
      <div className="p-4">
        {problems.length > 0 ? (
          <div className="space-y-1 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
            {problems.map((problem) => (
              <ProblemItem
                key={problem.id}
                problem={problem}
                onRemove={
                  onRemoveProblem
                    ? () => handleRemoveProblem(problem.id)
                    : undefined
                }
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <p>No problems in this playlist yet.</p>
            <p className="text-sm mt-1">Add problems from the Problems page.</p>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="px-4 pb-4">
        <ProgressBar solved={solvedCount} total={problems.length} />
      </div>
    </motion.div>
  );
}
