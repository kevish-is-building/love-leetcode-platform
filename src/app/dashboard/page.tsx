"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/useAuthStore";

// Placeholder data - will be replaced with API calls later
const placeholderStats = {
  totalSolved: 42,
  totalSubmissions: 156,
};

const placeholderProgress = {
  easy: { solved: 0, total: 10 },
  medium: { solved: 0, total: 10 },
  hard: { solved: 0, total: 10 },
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
      <div className="flex justify-between text-sm">
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
    <div className="min-h-screen bg-background p-6 md:p-8 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* User Details Card */}
        <Card className="border border-border bg-card">
          <CardContent className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                {user?.image ? (
                  <img 
                    src={user.image} 
                    alt={user.name || "User"} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl md:text-4xl text-muted-foreground">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                )}
              </div>
              
              {/* User Info */}
              <div className="text-center md:text-left space-y-2">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  {user?.name || "User Details"}
                </h1>
                <p className="text-muted-foreground">
                  {user?.email || "user@example.com"}
                </p>
                {user?.role && (
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                    {user.role}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Solved Problems */}
          <Card className="border border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-center">
                Total Solved
                <br />
                problems
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-3xl md:text-4xl font-bold text-center text-muted-foreground">
                {placeholderStats.totalSolved}
              </p>
            </CardContent>
          </Card>

          {/* Total Submissions */}
          <Card className="border border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-center">
                Total
                <br />
                Submissions
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-3xl md:text-4xl font-bold text-center text-muted-foreground">
                {placeholderStats.totalSubmissions}
              </p>
            </CardContent>
          </Card>

          {/* Random Developer Quote */}
          <Card className="border border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-center">
                Random Developer Quote
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground text-center italic">
                &ldquo;{randomQuote}&rdquo;
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Progress Card */}
          <Card className="border border-border bg-card lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
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
            </CardContent>
          </Card>

          {/* Solved Problems Table */}
          <Card className="border border-border bg-card lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Solved Problems ({placeholderSolvedProblems.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                        Title
                      </th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                        Difficulty
                      </th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                        Tags
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {placeholderSolvedProblems.map((problem, index) => (
                      <tr 
                        key={problem.id} 
                        className={index !== placeholderSolvedProblems.length - 1 ? "border-b border-border/50" : ""}
                      >
                        <td className="py-3 px-2 text-sm text-foreground">
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
                                className="px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded"
                              >
                                {tag}
                              </span>
                            ))}
                            {problem.tags.length > 2 && (
                              <span className="px-2 py-0.5 text-xs text-muted-foreground">
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
                  <div className="text-center py-8 text-muted-foreground">
                    No solved problems yet. Start solving!
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
