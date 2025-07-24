// MindMark Bookmark Hooks Tests
// Test bookmark CRUD operations and real-time functionality

import { describe, it, expect, beforeEach, mock } from "bun:test";
import { useBookmarks } from "./useBookmarks";

// Mock fetch
global.fetch = mock(() => Promise.resolve(new Response()));

// Mock Supabase client
const mockChannel = {
  on: mock(() => mockChannel),
  subscribe: mock(() => {}),
};

const mockSupabase = {
  channel: mock(() => mockChannel),
  removeChannel: mock(() => {}),
};

// Simple mock for testing
const mockCreateSupabaseClient = mock(() => mockSupabase);

describe("useBookmarks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (fetch as any).mockClear();
  });

  it("should fetch bookmarks on mount", async () => {
    const mockBookmarks = [
      {
        id: "1",
        title: "Test Bookmark",
        url: "https://example.com",
        user_id: "user1",
        created_at: "2024-01-01T00:00:00Z",
      },
    ];

    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        bookmarks: mockBookmarks,
        pagination: { hasMore: false },
      }),
    });

    const { result } = renderHook(() => useBookmarks());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.bookmarks).toEqual(mockBookmarks);
    expect(result.current.error).toBe(null);
  });

  it("should handle fetch errors", async () => {
    (fetch as any).mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useBookmarks());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("Network error");
    expect(result.current.bookmarks).toEqual([]);
  });

  it("should create bookmark", async () => {
    const newBookmark = {
      id: "2",
      title: "New Bookmark",
      url: "https://new.example.com",
      user_id: "user1",
      created_at: "2024-01-02T00:00:00Z",
    };

    // Mock initial fetch
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        bookmarks: [],
        pagination: { hasMore: false },
      }),
    });

    // Mock create bookmark
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ bookmark: newBookmark }),
    });

    const { result } = renderHook(() => useBookmarks());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const createdBookmark = await result.current.createBookmark({
      title: "New Bookmark",
      url: "https://new.example.com",
    });

    expect(createdBookmark).toEqual(newBookmark);
    expect(fetch).toHaveBeenCalledWith("/api/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "New Bookmark",
        url: "https://new.example.com",
      }),
    });
  });

  it("should update bookmark", async () => {
    const updatedBookmark = {
      id: "1",
      title: "Updated Bookmark",
      url: "https://example.com",
      user_id: "user1",
      created_at: "2024-01-01T00:00:00Z",
    };

    // Mock initial fetch
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        bookmarks: [],
        pagination: { hasMore: false },
      }),
    });

    // Mock update bookmark
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ bookmark: updatedBookmark }),
    });

    const { result } = renderHook(() => useBookmarks());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const updated = await result.current.updateBookmark("1", {
      title: "Updated Bookmark",
    });

    expect(updated).toEqual(updatedBookmark);
    expect(fetch).toHaveBeenCalledWith("/api/bookmarks/1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Updated Bookmark",
      }),
    });
  });

  it("should delete bookmark", async () => {
    // Mock initial fetch
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        bookmarks: [],
        pagination: { hasMore: false },
      }),
    });

    // Mock delete bookmark
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const { result } = renderHook(() => useBookmarks());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await result.current.deleteBookmark("1");

    expect(fetch).toHaveBeenCalledWith("/api/bookmarks/1", {
      method: "DELETE",
    });
  });

  it("should set up real-time subscription", () => {
    renderHook(() => useBookmarks({ realtime: true }));

    expect(mockSupabase.channel).toHaveBeenCalledWith("bookmarks_changes");
    expect(mockChannel.on).toHaveBeenCalledWith(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "bookmarks",
      },
      expect.any(Function)
    );
    expect(mockChannel.subscribe).toHaveBeenCalled();
  });

  it("should not set up real-time subscription when disabled", () => {
    renderHook(() => useBookmarks({ realtime: false }));

    expect(mockSupabase.channel).not.toHaveBeenCalled();
  });
});
