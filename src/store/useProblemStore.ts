import { create } from "zustand";
import toast from "react-hot-toast";
import { problemAPI } from "@/lib/api";

interface Problem {
  id: string;
  title: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  tags?: string[];
  solvedBy?: Array<{ userId: string }>;
}

interface ProblemStore {
  problems: Problem[];
  isLoading: boolean;
  fetchProblems: () => Promise<void>;
  onDeleteProblem: (id: string) => Promise<any>;
}

export const useProblemStore = create<ProblemStore>((set, get) => ({
  problems: [],
  isLoading: false,

  fetchProblems: async () => {
    try {
      set({ isLoading: true });
      const response: any = await problemAPI.getAll();
      set({ problems: response.data.problems || [] });
    } catch (error) {
      console.error("Failed to fetch problems:", error);
      toast.error("Failed to load problems");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  onDeleteProblem: async (id: string) => {
    try {
      set({ isLoading: true });
      const res: any = await problemAPI.delete(id);
      toast.success(res.message || "Problem deleted successfully");
      
      // Update local state by removing the deleted problem
      set((state) => ({
        problems: state.problems.filter((p) => p.id !== id),
      }));
      
      return res;
    } catch (error) {
      console.log("Error deleting problem", error);
      toast.error(error instanceof Error ? error.message : "Error deleting problem");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));
