"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Play,
  Send,
  RotateCcw,
  FileText,
  BookOpen,
  History,
  Lightbulb,
  MessageSquare,
  Check,
  X,
} from "lucide-react";
import Editor from "@monaco-editor/react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { problemAPI, executeAPI, submissionAPI } from "@/lib/api";
import Loader from "@/components/ui/loader";
import FuzzyText from "@/components/layout/FuzzyText";
import { Button } from "@/components/ui/button";

// Types
interface TestCase {
  input: string;
  output: string;
}

interface Example {
  input: string;
  output: string;
  explanation?: string;
}

interface Problem {
  id: string;
  title: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  description?: string;
  tags?: string[];
  examples?: Record<string, Example> | Example[];
  constraints?: string;
  testCases?: TestCase[];
  codeSnippets?: Record<string, string>;
  editorial?: string;
  hints?: string;
}

interface TestResult {
  testCaseNumber: number;
  isTestPassed: boolean;
  stdout: string | null;
  expected_output: string;
  stderr: string | null;
  compile_output: string | null;
  status: string;
  memory?: number;
  time?: number;
}

interface Submission {
  id: string;
  userId: string;
  problemId: string;
  language: string;
  sourceCode: any;
  stdin?: string;
  stdout?: string;
  stderr?: string;
  compileOutput?: string;
  status?: string;
  memory?: string;
  time?: string;
  problemTitle?: string;
  createdAt: string;
  updatedAt: string;
}

type TabType =
  | "description"
  | "editorial"
  | "submissions"
  | "solutions"
  | "discussions";

const LANG_MAP: Record<string, string> = {
  javascript: "javascript",
  python: "python",
  java: "java",
  cpp: "cpp",
  c: "c",
};

// Language ID mapping for Judge0 API
const getLanguageId = (language: string): number => {
  const languageIds: Record<string, number> = {
    javascript: 63, // Node.js
    python: 71, // Python 3
    java: 62, // Java
    cpp: 54, // C++ (GCC 9.2.0)
    c: 50, // C (GCC 9.2.0)
  };
  return languageIds[language.toLowerCase()] || 63;
};

export default function ProblemSolverPage() {
  const params = useParams();
  const router = useRouter();
  const problemId = params.problemId as string;

  const [problem, setProblem] = useState<Problem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [activeTab, setActiveTab] = useState<TabType>("description");
  const [activeCase, setActiveCase] = useState(0);
  const [results, setResults] = useState<TestResult[] | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);
  const [showCodeModal, setShowCodeModal] = useState(false);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setIsLoading(true);
        const res: any = await problemAPI.getById(problemId);
        const data = res.data || res;
        setProblem(data);
        if (data.codeSnippets) {
          const langs = Object.keys(data.codeSnippets);
          if (langs.length > 0) {
            setLanguage(langs[0]);
            setCode(data.codeSnippets[langs[0]] || "");
          }
        }
      } catch {
        setError("Failed to load problem");
      } finally {
        setIsLoading(false);
      }
    };
    if (problemId) fetchProblem();
  }, [problemId]);

  useEffect(() => {
    if (problem?.codeSnippets?.[language]) {
      setCode(problem.codeSnippets[language]);
    }
  }, [language, problem]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (activeTab === "submissions" && problemId) {
        setIsLoadingSubmissions(true);
        try {
          const res: any = await submissionAPI.getByProblemId(problemId);
          setSubmissions(res.data || res || []);
        } catch (error) {
          console.error("Failed to fetch submissions:", error);
          setSubmissions([]);
        } finally {
          setIsLoadingSubmissions(false);
        }
      }
    };
    fetchSubmissions();
  }, [activeTab, problemId]);

  const handleReset = useCallback(() => {
    if (problem?.codeSnippets?.[language]) {
      setCode(problem.codeSnippets[language]);
    }
  }, [problem, language]);

  const handleRun = useCallback(async () => {
    if (!problem || !problem.testCases || problem.testCases.length === 0) {
      return;
    }

    setIsRunning(true);
    setShowResults(true);
    setResults(null);

    try {
      const language_id = getLanguageId(language);
      const stdin = problem.testCases.map((tc) => tc.input);
      const expected_outputs = problem.testCases.map((tc) => tc.output);

      const response: any = await executeAPI.run({
        code,
        language_id,
        stdin,
        expected_outputs,
        id: problemId,
        title: problem.title,
      });

      setResults(response.data || response);
    } catch (error) {
      console.error("Error running code:", error);
      setResults([]);
    } finally {
      setIsRunning(false);
    }
  }, [problem, code, language, problemId]);

  const handleSubmit = useCallback(async () => {
    if (!problem || !problem.testCases || problem.testCases.length === 0) {
      return;
    }

    setIsSubmitting(true);
    setShowResults(true);
    setResults(null);

    try {
      const language_id = getLanguageId(language);
      const stdin = problem.testCases.map((tc) => tc.input);
      const expected_outputs = problem.testCases.map((tc) => tc.output);

      const response: any = await executeAPI.submit({
        code,
        language_id,
        stdin,
        expected_outputs,
        id: problemId,
        title: problem.title,
      });

      setResults(response.data || response);
    } catch (error) {
      console.error("Error submitting code:", error);
      setResults([]);
    } finally {
      setIsSubmitting(false);
    }
  }, [problem, code, language, problemId]);

  const diffStyle = (d: string) => {
    if (d === "EASY") return "text-green-400 border-green-500/30";
    if (d === "MEDIUM") return "text-yellow-400 border-yellow-500/30";
    if (d === "HARD") return "text-red-400 border-red-500/30";
    return "text-zinc-400 border-zinc-500/30";
  };

  const getExamples = (ex: Problem["examples"]): Example[] => {
    if (!ex) return [];
    if (Array.isArray(ex)) return ex;
    return Object.values(ex).filter((e) => e.input);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    } else if (diffInDays < 30) {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  const getStatusStyle = (status?: string) => {
    if (status?.toLowerCase().includes("accept")) {
      return "text-green-400 border border-green-500/30";
    }
    return "text-red-400 border border-red-500/30";
  };

  const handleViewCode = (submission: Submission) => {
    setSelectedSubmission(submission);
    setShowCodeModal(true);
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-transparent flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="h-screen bg-transparent flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-400 mb-4">
            {error || "Problem not found"}
          </h2>
          <Button
            className="group rounded-full border-t border-purple-400 bg-linear-to-b from-purple-700 to-slate-950/80 px-6 py-6 text-white shadow-lg shadow-purple-600/20 transition-all hover:shadow-purple-600/40 cursor-pointer"
            size="lg"
            onClick={() => router.push("/problems")}
          >
            Back to Problems
          </Button>
        </div>
      </div>
    );
  }

  const testCases = problem.testCases || [];
  const examples = getExamples(problem.examples);
  const tabs = [
    { id: "description", icon: FileText, label: "Description" },
    { id: "editorial", icon: BookOpen, label: "Editorial" },
    { id: "submissions", icon: History, label: "Submissions" },
    { id: "solutions", icon: Lightbulb, label: "Solutions" },
    { id: "discussions", icon: MessageSquare, label: "AI Discussions" },
  ];

  return (
    <div className="h-screen bg-transparent flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-11 bg-transparent border-b border-zinc-700 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-zinc-400 hover:text-white text-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Problem :</span>
            <span className="truncate max-w-40">{problem.title}</span>
          </button>
        </div>
      </header>

      {/* Main */}
      <div className="flex-1 overflow-hidden">
        <PanelGroup direction="horizontal">
          {/* Left Panel */}
          <Panel defaultSize={40} minSize={20}>
            <div className="h-full flex flex-col bg-transparent">
              <div className="flex border-b border-zinc-800 overflow-x-auto shrink-0">
                {tabs.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id as TabType)}
                    className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium whitespace-nowrap border-b-2 cursor-pointer ${
                      activeTab === t.id
                        ? "border-lime-600 text-lime-400 bg-zinc-800/50"
                        : "border-transparent text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    <t.icon className="w-3.5 h-3.5" />
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {activeTab === "description" && (
                  <div className="space-y-5">
                    <div>
                      <h1 className="text-lg font-bold text-white mb-2">
                        {problem.title}
                      </h1>
                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-semibold border ${diffStyle(
                            problem.difficulty
                          )}`}
                        >
                          {problem.difficulty}
                        </span>
                      </div>
                      {problem.tags
                        ?.slice(0, problem.tags.length - 1)
                        .map((tag, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 border border-zinc-600 text-zinc-400 text-xs rounded mr-1"
                          >
                            {tag}
                          </span>
                        ))}
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-white mb-2">
                        Description
                      </h3>
                      <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                        {problem.description}
                      </p>
                    </div>

                    {examples.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-white mb-2">
                          Example
                        </h3>
                        {examples.map((ex, i) => (
                          <div
                            key={i}
                            className="mb-3 border border-zinc-700 rounded-sm p-3 space-y-2"
                          >
                            <div className="">
                              <span className="text-xs text-zinc-400">
                                Input:
                              </span>
                              <code className="block mt-0.5 text-sm text-zinc-300 font-mono">
                                {ex.input}
                              </code>
                            </div>
                            <div>
                              <span className="text-xs text-zinc-500">
                                Output:
                              </span>
                              <code className="block mt-0.5 text-sm text-zinc-300 font-mono">
                                {ex.output}
                              </code>
                            </div>
                            {ex.explanation && (
                              <div>
                                <span className="text-xs text-zinc-500">
                                  Explanation:
                                </span>
                                <p className="mt-0.5 text-sm text-zinc-400">
                                  {ex.explanation}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {problem.constraints && (
                      <div>
                        <h3 className="text-sm font-semibold text-zinc-300 mb-2">
                          Constraints
                        </h3>
                        <ul className="space-y-1">
                          {problem.constraints.split("\n").map((c, i) => (
                            <li
                              key={i}
                              className="text-sm text-zinc-400 flex gap-2"
                            >
                              <span className="text-lime-400">•</span>
                              <code className="text-zinc-300">{c}</code>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "editorial" && (
                  <div className="text-sm text-zinc-400">
                    {problem.editorial ? (
                      <div className="whitespace-pre-line">
                        {problem.editorial}
                      </div>
                    ) : (
                      <p className="text-center py-8">
                        No editorial available.
                      </p>
                    )}
                  </div>
                )}

                {activeTab === "submissions" && (
                  <div>
                    {isLoadingSubmissions ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader />
                      </div>
                    ) : submissions.length > 0 ? (
                      <div className="space-y-2">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-zinc-700">
                                <th className="text-left py-3 px-4 text-xs font-semibold text-white uppercase tracking-wider">
                                  Status
                                </th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-white uppercase tracking-wider">
                                  Language
                                </th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-white uppercase tracking-wider">
                                  Runtime
                                </th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-white uppercase tracking-wider">
                                  Memory
                                </th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-white uppercase tracking-wider">
                                  Submitted At
                                </th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-white uppercase tracking-wider">
                                  View Code
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {submissions.map((submission) => (
                                <tr
                                  key={submission.id}
                                  className="border-b border-zinc-800 hover:bg-zinc-800/30 transition-colors"
                                >
                                  <td className="py-3 px-4">
                                    <div className="flex items-center gap-2">
                                      {/* {submission.status?.toLowerCase().includes('accept') ? (
                                        <Check className="w-4 h-4 text-green-400" />
                                      ) : (
                                        <X className="w-4 h-4 text-red-400" />
                                      )} */}
                                      <span
                                        className={`text-sm px-2 py-1 rounded ${getStatusStyle(
                                          submission.status
                                        )}`}
                                      >
                                        {submission.status || "Unknown"}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="py-3 px-4">
                                    <span className="text-sm text-white px-2 py-1 rounded border border-zinc-700">
                                      {submission.language}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4">
                                    <span className="text-sm text-zinc-300">
                                      {submission.time
                                        ? `${(
                                            JSON.parse(submission.time).reduce(
                                              (a: string, b: string) =>
                                                Number(a) + Number(b),
                                              0
                                            ) /
                                            JSON.parse(submission.time).length
                                          ).toFixed(2)} KB`
                                        : "-"}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4">
                                    <span className="text-sm text-zinc-300">
                                      {submission.memory
                                        ? `${(
                                            JSON.parse(
                                              submission.memory
                                            ).reduce(
                                              (a: number, b: number) => a + b,
                                              0
                                            ) /
                                            JSON.parse(submission.memory).length
                                          ).toFixed(2)} KB`
                                        : "-"}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4">
                                    <span className="text-xs text-zinc-500">
                                      {formatDate(submission.createdAt)}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleViewCode(submission)}
                                      className="rounded-full border-purple-500/30 bg-transparent text-zinc-200 hover:bg-purple-500/20 hover:text-white cursor-pointer"
                                    >
                                      <FileText className="w-3.5 h-3.5 mr-1" />
                                      View
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-zinc-500 text-center py-8">
                        No submissions yet.
                      </p>
                    )}
                  </div>
                )}

                {activeTab === "solutions" && (
                  <div className="flex items-center justify-center">
                    <FuzzyText
                      fontSize="clamp(1rem, 4vw, 4rem)"
                      fontWeight={800}
                      color="#fff"
                      baseIntensity={0.2}
                      hoverIntensity={0.6}
                      glitchMode={true}
                      glitchInterval={2000}
                      glitchDuration={200}
                      // gradient={['#8B5CF6', '#3B82F6', '#06B6D4']}
                      className="mb-4"
                    >
                      Coming Soon
                    </FuzzyText>
                  </div>
                )}

                {activeTab === "discussions" && (
                  <div className="flex items-center justify-center">
                    <FuzzyText
                      fontSize="clamp(1rem, 4vw, 4rem)"
                      fontWeight={800}
                      color="#fff"
                      baseIntensity={0.2}
                      hoverIntensity={0.6}
                      glitchMode={true}
                      glitchInterval={2000}
                      glitchDuration={200}
                      // gradient={['#8B5CF6', '#3B82F6', '#06B6D4']}
                      className="mb-4"
                    >
                      Coming Soon
                    </FuzzyText>
                  </div>
                )}
              </div>
            </div>
          </Panel>

          <PanelResizeHandle className="w-1 bg-zinc-800 hover:bg-zinc-500 transition-colors" />

          {/* Right Panel */}
          <Panel defaultSize={70} minSize={40}>
            <PanelGroup direction="vertical">
              {/* Editor */}
              <Panel defaultSize={60} minSize={30}>
                <div className="h-full flex flex-col bg-transparent">
                  <div className="h-10 px-3 flex items-center justify-between border-b border-zinc-800 shrink-0">
                    <span className="text-xs text-zinc-400">Code Editor</span>
                    <div className="flex items-center gap-2">
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="bg-transparent text-zinc-300 text-xs px-2 py-1 rounded border border-zinc-700 focus:outline-none"
                      >
                        {Object.keys(
                          problem.codeSnippets || { javascript: "" }
                        ).map((l) => (
                          <option key={l} value={l}>
                            {l.charAt(0).toUpperCase() + l.slice(1)}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={handleReset}
                        className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded"
                        title="Reset"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1">
                    <Editor
                      height="100%"
                      language={language?.toLowerCase() || "javascript"}
                      theme="vs-dark"
                      value={code}
                      onChange={(v) => setCode(v || "")}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: "on",
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        tabSize: 2,
                        wordWrap: "on",
                        roundedSelection: false,
                      }}
                    />
                  </div>

                  <div className="h-14 px-3 flex items-center justify-start gap-2 border-t border-zinc-800 shrink-0">
                    <Button
                      variant="outline"
                      className="rounded-full border-purple-500/30 bg-transparent text-white hover:bg-purple-500/40 hover:text-white cursor-pointer"
                      size="sm"
                      onClick={handleRun}
                    >
                      {isRunning ? (
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Play className="w-3.5 h-3.5" />
                      )}
                      Run
                    </Button>

                    <Button
                      className="group rounded-full border-t border-purple-400 bg-linear-to-b from-purple-700 to-slate-950/80  text-white shadow-lg shadow-purple-600/20 transition-all hover:shadow-purple-600/40 cursor-pointer"
                      size="sm"
                      disabled={isRunning || isSubmitting}
                      onClick={handleSubmit}
                    >
                      {isSubmitting ? (
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Send className="w-3.5 h-3.5" />
                      )}
                      Submit
                    </Button>
                  </div>
                </div>
              </Panel>

              <PanelResizeHandle className="h-1 bg-zinc-800 hover:bg-zinc-500 transition-colors" />

              {/* Test Cases */}
              <Panel defaultSize={30} minSize={20}>
                <div className="h-full flex flex-col bg-transparent">
                  <div className="h-10 px-3 flex items-center gap-2 border-b border-zinc-800 shrink-0">
                    <button
                      onClick={() => setShowResults(false)}
                      className={`px-2 py-1 text-xs rounded ${
                        !showResults
                          ? " text-lime-400 border border-lime-500/30"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      Test Cases
                    </button>
                    <button
                      onClick={() => setShowResults(true)}
                      className={`px-2 py-1 text-xs rounded ${
                        showResults
                          ? " text-lime-400 border border-lime-500/30"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      Test Results
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-3">
                    {!showResults ? (
                      <div>
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          {testCases.slice(0, 2).map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setActiveCase(i)}
                              className={`px-3 py-1 text-xs rounded cursor-pointer ${
                                activeCase === i
                                  ? "border border-purple-500/30 text-white bg-purple-700/40"
                                  : "border border-purple-500/30  text-white hover:bg-purple-700/20"
                              }`}
                            >
                              Case {i + 1}
                            </button>
                          ))}
                        </div>
                        {testCases[activeCase] && (
                          <div className="space-y-3">
                            <div>
                              <label className="text-xs text-white block mb-1">
                                Input
                              </label>
                              <div className="bg-transparent border border-zinc-400/40 rounded p-2">
                                <code className="text-sm text-zinc-300 font-mono">
                                  {testCases[activeCase].input}
                                </code>
                              </div>
                            </div>
                            <div>
                              <label className="text-xs text-white block mb-1">
                                Expected Output
                              </label>
                              <div className="bg-transparent border border-zinc-400/40 rounded p-2">
                                <code className="text-sm text-zinc-300 font-mono">
                                  {testCases[activeCase].output}
                                </code>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        {results ? (
                          <div className="space-y-2">
                            {results.map((r, i) => (
                              <div
                                key={i}
                                className={`p-3 rounded-lg border ${
                                  r.isTestPassed
                                    ? "bg-green-500/10 border-green-500/30"
                                    : "bg-red-500/10 border-red-500/30"
                                }`}
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  {r.isTestPassed ? (
                                    <Check className="w-4 h-4 text-green-400" />
                                  ) : (
                                    <X className="w-4 h-4 text-red-400" />
                                  )}
                                  <span
                                    className={`text-sm font-medium ${
                                      r.isTestPassed
                                        ? "text-green-400"
                                        : "text-red-400"
                                    }`}
                                  >
                                    Case {r.testCaseNumber}{" "}
                                    {r.isTestPassed ? "Passed" : "Failed"}
                                  </span>
                                  <span className="text-xs text-zinc-500 ml-auto">
                                    {r.status}
                                  </span>
                                </div>
                                <div className="text-xs space-y-1">
                                  {testCases[i] && (
                                    <p className="text-zinc-500">
                                      Input:{" "}
                                      <code className="text-zinc-300">
                                        {testCases[i].input}
                                      </code>
                                    </p>
                                  )}
                                  <p className="text-zinc-500">
                                    Expected:{" "}
                                    <code className="text-zinc-300">
                                      {r.expected_output}
                                    </code>
                                  </p>
                                  {r.stdout !== null && (
                                    <p className="text-zinc-500">
                                      Output:{" "}
                                      <code
                                        className={
                                          r.isTestPassed
                                            ? "text-zinc-300"
                                            : "text-red-300"
                                        }
                                      >
                                        {r.stdout}
                                      </code>
                                    </p>
                                  )}
                                  {r.stderr && (
                                    <p className="text-zinc-500">
                                      Error:{" "}
                                      <code className="text-red-300">
                                        {r.stderr}
                                      </code>
                                    </p>
                                  )}
                                  {r.compile_output && (
                                    <p className="text-zinc-500">
                                      Compile Error:{" "}
                                      <code className="text-red-300">
                                        {r.compile_output}
                                      </code>
                                    </p>
                                  )}
                                  {(r.time !== undefined ||
                                    r.memory !== undefined) && (
                                    <div className="flex gap-4 mt-2 pt-2 border-t border-zinc-700">
                                      {r.time !== undefined && (
                                        <span className="text-zinc-400">
                                          Time:{" "}
                                          <span className="text-lime-400">
                                            {r.time}s
                                          </span>
                                        </span>
                                      )}
                                      {r.memory !== undefined && (
                                        <span className="text-zinc-400">
                                          Memory:{" "}
                                          <span className="text-lime-400">
                                            {r.memory} KB
                                          </span>
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-zinc-500 text-center py-4">
                            Run your code to see results
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>

      {/* Code View Modal */}
      {showCodeModal && selectedSubmission && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-transparent border border-zinc-700 rounded-sm w-full max-w-4xl max-h-[90vh] h-[85vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-zinc-700 shrink-0">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Submission Code
                </h2>
                <div className="flex items-center gap-4 mt-2">
                  <span
                    className={`text-sm px-2 py-1 rounded ${getStatusStyle(
                      selectedSubmission.status
                    )}`}
                  >
                    {selectedSubmission.status || "Unknown"}
                  </span>
                  <span className="text-sm text-zinc-400">
                    Language:{" "}
                    <span className="text-white">
                      {selectedSubmission.language}
                    </span>
                  </span>
                  {selectedSubmission.time && (
                    <span className="text-sm text-zinc-400">
                      Runtime:{" "}
                      <span className="text-lime-400">
                        {selectedSubmission.time}
                      </span>
                    </span>
                  )}
                  {selectedSubmission.memory && (
                    <span className="text-sm text-zinc-400">
                      Memory:{" "}
                      <span className="text-lime-400">
                        {selectedSubmission.memory}
                      </span>
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setShowCodeModal(false)}
                className="text-zinc-400 hover:text-white p-2 hover:bg-zinc-800 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-hidden">
              <Editor
                height="100%"
                language={
                  selectedSubmission.language?.toLowerCase() || "javascript"
                }
                theme="vs-dark"
                value={
                  typeof selectedSubmission.sourceCode === "string"
                    ? selectedSubmission.sourceCode
                    : JSON.stringify(selectedSubmission.sourceCode, null, 2)
                }
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: "on",
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  wordWrap: "on",
                  roundedSelection: false,
                }}
              />
            </div>

            <div className="p-4 border-t border-zinc-700 flex justify-end gap-2 shrink-0">
              <Button
                variant="outline"
                onClick={() => setShowCodeModal(false)}
                className="rounded-full border-purple-500/30 bg-transparent text-white hover:bg-purple-500/20 hover:text-white cursor-pointer"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// export default function Page() {
//   return (
//     <ProtectedRoute>
//       <ProblemSolverPage />
//     </ProtectedRoute>
//   );
// }
