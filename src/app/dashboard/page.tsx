"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/useAuthStore";
import { Target, TrendingUp, Code2, BookOpen } from "lucide-react";

// Placeholder data - will be replaced with API calls later
const placeholderStats = {
  totalSolved: 42,
  totalSubmissions: 156,
};

const placeholderProgress = {
  easy: { solved: 5, total: 10 },
  medium: { solved: 2, total: 10 },
  hard: { solved: 9, total: 10 },
};

const placeholderSolvedProblems = [
  {
    id: 1,
    title: "Longest valid Parenthesis",
    difficulty: "Hard",
    tags: ["Dynamic Programming", "Math"],
  },
  {
    id: 2,
    title: "Longest valid Parenthesis",
    difficulty: "Hard",
    tags: ["Dynamic Programming", "Math"],
  },
  {
    id: 3,
    title: "Longest valid Parenthesis",
    difficulty: "Hard",
    tags: ["Dynamic Programming", "Math"],
  },
];

const developerQuotes = [
  "Code is like humor. When you have to explain it, it's bad. – Cory House",
  "First, solve the problem. Then, write the code. – John Johnson",
  "Experience is the name everyone gives to their mistakes. – Oscar Wilde",
  "The best error message is the one that never shows up. – Thomas Fuchs",
  "Simplicity is the soul of efficiency. – Austin Freeman",
];

function getRandomQuote() {
  return developerQuotes[Math.floor(Math.random() * developerQuotes.length)];
}

function getDifficultyColor(difficulty: string) {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return "text-green-500";
    case "medium":
      return "text-yellow-500";
    case "hard":
      return "text-red-500";
    default:
      return "text-muted-foreground";
  }
}

function ProgressBar({ 
  label, 
  solved, 
  total, 
  colorClass 
}: { 
  label: string; 
  solved: number; 
  total: number; 
  colorClass: string;
}) {
  const percentage = total > 0 ? (solved / total) * 100 : 0;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-zinc-200">
        <span>{label}</span>
        <span>{solved}/{total}</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className={`h-full ${colorClass} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const randomQuote = getRandomQuote();

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden p-6 md:p-8 lg:p-10 pt-20!">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1000ms' }} />
        <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2000ms' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        {/* User Details Card */}
        <div className="p-8 md:p-12 transition-all duration-500 group relative overflow-hidden rounded-xl bg-transparent backdrop-blur-md border border-white/10 shadow-xl">
          <div className="absolute inset-0 bg-linear-to-br from-purple-400 to-pink-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            {/* Avatar with glow effect */}
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-br from-purple-400 to-pink-600 rounded-full blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-800/50 backdrop-blur-md border-2 border-white/20 flex items-center justify-center overflow-hidden  transition-all duration-500">
                {user?.image ? (
                  <img 
                    src={user.image} 
                    alt={user.name || "User"} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl md:text-4xl text-white font-bold">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                )}
              </div>
            </div>
            
            {/* User Info */}
            <div className="text-center md:text-left space-y-2 flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-white group-hover:text-transparent group-hover:bg-linear-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
                {user?.name || "User Details"}
              </h1>
              <p className="text-gray-300">
                {user?.email || "user@example.com"}
              </p>
              {user?.role && (
                <span className="inline-block px-3 py-1 text-xs font-medium bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-full">
                  {user.role}
                </span>
              )}
            </div>
            
            {/* Hover indicator */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-linear-to-r from-purple-400 to-pink-600" />
                <span className="text-xs text-gray-400">Welcome back!</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Solved Problems */}
          <div className="h-full p-6 transition-all duration-500 cursor-pointer group relative overflow-hidden rounded-xl bg-transparent backdrop-blur-md border border-white/10 shadow-xl">
            <div className="absolute inset-0 bg-linear-to-br from-green-400 to-emerald-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
            
            <div className="relative z-10">
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-linear-to-br from-green-400 to-emerald-600 rounded-lg blur-lg opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative w-14 h-14 rounded-lg bg-linear-to-br from-green-400 to-emerald-600 p-3  transition-all duration-500">
                  <Target className="w-full h-full text-white" />
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-linear-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
                Total Solved
              </h3>
              <p className="text-4xl md:text-5xl font-bold text-white mb-2">
                {placeholderStats.totalSolved}
              </p>
              <p className="text-gray-400 text-sm">Problems Completed</p>
              
              <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-2 h-2 rounded-full bg-linear-to-r from-green-400 to-emerald-600" />
                <span className="text-xs text-gray-400">Keep it up!</span>
              </div>
            </div>
          </div>

          {/* Total Submissions */}
          <div className="h-full p-6  transition-all duration-500 cursor-pointer group relative overflow-hidden rounded-xl bg-transparent backdrop-blur-md border border-white/10 shadow-xl">
            <div className="absolute inset-0 bg-linear-to-br from-blue-400 to-cyan-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
            
            <div className="relative z-10">
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-linear-to-br from-blue-400 to-cyan-600 rounded-lg blur-lg opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative w-14 h-14 rounded-lg bg-linear-to-br from-blue-400 to-cyan-600 p-3  transition-all duration-500">
                  <TrendingUp className="w-full h-full text-white" />
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-linear-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
                Total Submissions
              </h3>
              <p className="text-4xl md:text-5xl font-bold text-white mb-2">
                {placeholderStats.totalSubmissions}
              </p>
              <p className="text-gray-400 text-sm">Code Attempts</p>
              
              <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-2 h-2 rounded-full bg-linear-to-r from-blue-400 to-cyan-600" />
                <span className="text-xs text-gray-400">Trending up</span>
              </div>
            </div>
          </div>

          {/* Random Developer Quote */}
          <div className="h-full p-6  transition-all duration-500 cursor-pointer group relative overflow-hidden rounded-xl bg-transparent backdrop-blur-md border border-white/10 shadow-xl">
            <div className="absolute inset-0 bg-linear-to-br from-purple-400 to-pink-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
            
            <div className="relative z-10">
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-linear-to-br from-purple-400 to-pink-600 rounded-lg blur-lg opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative w-14 h-14 rounded-lg bg-linear-to-br from-purple-400 to-pink-600 p-3  transition-all duration-500">
                  <BookOpen className="w-full h-full text-white" />
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-linear-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
                Developer Quote
              </h3>
              <p className="text-sm text-gray-300 italic leading-relaxed">
                &ldquo;{randomQuote}&rdquo;
              </p>
              
              <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-2 h-2 rounded-full bg-linear-to-r from-purple-400 to-pink-600" />
                <span className="text-xs text-gray-400">Daily wisdom</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Progress Card */}
          <div className="h-full p-6  transition-all duration-500 group relative overflow-hidden rounded-xl bg-transparent backdrop-blur-md border border-white/10 shadow-xl lg:col-span-1">
            <div className="absolute inset-0 bg-linear-to-br from-orange-400 to-red-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
            
            <div className="relative z-10">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-linear-to-br from-orange-400 to-red-600 rounded-lg blur-lg opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative w-14 h-14 rounded-lg bg-linear-to-br from-orange-400 to-red-600 p-3  transition-all duration-500">
                  <Code2 className="w-full h-full text-white" />
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-6 group-hover:text-transparent group-hover:bg-linear-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
                Progress Tracker
              </h3>
              
              <div className="space-y-6">
                <ProgressBar 
                  label="Easy" 
                  solved={placeholderProgress.easy.solved} 
                  total={placeholderProgress.easy.total}
                  colorClass="bg-green-500"
                />
                <ProgressBar 
                  label="Medium" 
                  solved={placeholderProgress.medium.solved} 
                  total={placeholderProgress.medium.total}
                  colorClass="bg-yellow-500"
                />
                <ProgressBar 
                  label="Hard" 
                  solved={placeholderProgress.hard.solved} 
                  total={placeholderProgress.hard.total}
                  colorClass="bg-red-500"
                />
              </div>
              
              <div className="mt-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-2 h-2 rounded-full bg-linear-to-r from-orange-400 to-red-600" />
                <span className="text-xs text-gray-400">Your journey</span>
              </div>
            </div>
          </div>

          {/* Solved Problems Table */}
          <div className="h-full p-6 transition-all duration-500 group relative overflow-hidden rounded-xl bg-transparent backdrop-blur-md border border-white/10 shadow-xl lg:col-span-2">
            <div className="absolute inset-0 bg-linear-to-br from-purple-400 to-pink-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
            
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-white mb-6 group-hover:text-transparent group-hover:bg-linear-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
                Solved Problems ({placeholderSolvedProblems.length})
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">
                        Title
                      </th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">
                        Difficulty
                      </th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">
                        Tags
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {placeholderSolvedProblems.map((problem, index) => (
                      <tr 
                        key={problem.id} 
                        className={`hover:bg-white/5 transition-colors ${index !== placeholderSolvedProblems.length - 1 ? "border-b border-white/5" : ""}`}
                      >
                        <td className="py-3 px-2 text-sm text-white">
                          {problem.title}
                        </td>
                        <td className={`py-3 px-2 text-sm font-medium ${getDifficultyColor(problem.difficulty)}`}>
                          {problem.difficulty}
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex flex-wrap gap-1">
                            {problem.tags.slice(0, 2).map((tag, tagIndex) => (
                              <span 
                                key={tagIndex}
                                className="px-2 py-0.5 text-xs bg-white/10 text-gray-300 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                            {problem.tags.length > 2 && (
                              <span className="px-2 py-0.5 text-xs text-gray-400">
                                +{problem.tags.length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {placeholderSolvedProblems.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    No solved problems yet. Start solving!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
