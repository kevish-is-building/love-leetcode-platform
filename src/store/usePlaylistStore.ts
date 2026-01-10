import { create } from "zustand";
import { playlistAPI } from "@/lib/api";
import toast from "react-hot-toast";

interface PlaylistState {
  playlists: any[];
  currentPlaylist: any;
  isLoading: boolean;
  error: any;
  createPlaylist: (playlistData: any) => Promise<any>;
  getAllPlaylists: () => Promise<void>;
  getPlaylistDetails: (playlistId: string) => Promise<void>;
  addProblemToPlaylist: (playlistId: string, problemIds: string[]) => Promise<void>;
  removeProblemFromPlaylist: (playlistId: string, problemIds: string[]) => Promise<void>;
  deletePlaylist: (playlistId: string) => Promise<void>;
}

export const usePlaylistStore = create<PlaylistState>((set, get) => ({
  playlists: [],
  currentPlaylist: null,
  isLoading: false,
  error: null,

  createPlaylist: async (playlistData: any) => {
    try {
      set({ isLoading: true });
      const response: any = await playlistAPI.create(playlistData);

      set((state: any) => ({
        playlists: [...state.playlists, response.data],
      }));

      toast.success("Playlist created successfully");
      return response.data;
    } catch (error: any) {
      console.error("Error creating playlist:", error);
      toast.error(error.message || "Failed to create playlist");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  getAllPlaylists: async () => {
    try {
      set({ isLoading: true });
      const response: any = await playlistAPI.getAll();
      set({ playlists: response.data });
    } catch (error: any) {
      console.error("Error fetching playlists:", error);
      toast.error(error.message || "Failed to fetch playlists");
    } finally {
      set({ isLoading: false });
    }
  },

  getPlaylistDetails: async (playlistId: string) => {
    try {
      set({ isLoading: true });
      const response: any = await playlistAPI.getById(playlistId);
      set({ currentPlaylist: response.data });
    } catch (error: any) {
      console.error("Error fetching playlist details:", error);
      toast.error(
        error.message || "Failed to fetch playlist details",
      );
    } finally {
      set({ isLoading: false });
    }
  },

  addProblemToPlaylist: async (playlistId: string, problemIds: string[]) => {
    try {
      set({ isLoading: true });
      await playlistAPI.addProblem(playlistId, problemIds);

      toast.success("Problem added to playlist");

      // Refresh the playlist details
      if (get().currentPlaylist?.id === playlistId) {
        await get().getPlaylistDetails(playlistId);
      }
    } catch (error: any) {
      console.error("Error adding problem to playlist:", error);
      toast.error(
        error.message || "Failed to add problem to playlist",
      );
    } finally {
      set({ isLoading: false });
    }
  },

  removeProblemFromPlaylist: async (playlistId: string, problemIds: string[]) => {
    try {
      set({ isLoading: true });
      
      await playlistAPI.removeProblem(playlistId, problemIds);

      toast.success("Problem removed from playlist");

      // Refresh the playlist details
      if (get().currentPlaylist?.id === playlistId) {
        await get().getPlaylistDetails(playlistId);
      }
    } catch (error: any) {
      console.error("Error removing problem from playlist:", error);
      toast.error(
        error.message ||
          "Failed to remove problem from playlist",
      );
    } finally {
      set({ isLoading: false });
    }
  },

  deletePlaylist: async (playlistId: string) => {
    try {
      set({ isLoading: true });
      await playlistAPI.delete(playlistId);

      set((state: any) => ({
        playlists: state.playlists.filter((p: any) => p.id !== playlistId),
      }));

      toast.success("Playlist deleted successfully");
    } catch (error: any) {
      console.error("Error deleting playlist:", error);
      toast.error(error.message || "Failed to delete playlist");
    } finally {
      set({ isLoading: false });
    }
  },
}));
