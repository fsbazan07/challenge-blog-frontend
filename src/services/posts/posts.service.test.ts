import { describe, it, expect, vi, beforeEach } from "vitest";

import type { Paginated, Post, ListPostsParams } from "./post.types";

// OJO: el mock path debe coincidir con el import del service
vi.mock("../http/client", () => ({
  http: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

import { http } from "../http/client";
import { PostsService } from "./posts.services";

describe("PostsService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("listFeed", () => {
    it("llama GET /posts con params y retorna data", async () => {
      const params: ListPostsParams = { page: 1, limit: 10, q: "hola" };

      const payload: Paginated<Post> = {
        items: [] as Post[],
        meta: { page: 1, limit: 10, total: 0 },
      } as unknown as Paginated<Post>;

      vi.mocked(http.get).mockResolvedValue({ data: payload });

      const res = await PostsService.listFeed(params);

      expect(http.get).toHaveBeenCalledWith("/posts", { params });
      expect(res).toBe(payload);
    });

    it("si params es undefined, igual llama GET /posts y retorna data", async () => {
      const payload: Paginated<Post> = {
        items: [] as Post[],
        meta: { page: 1, limit: 10, total: 0 },
      } as unknown as Paginated<Post>;

      vi.mocked(http.get).mockResolvedValue({ data: payload });

      const res = await PostsService.listFeed();

      expect(http.get).toHaveBeenCalledWith("/posts", { params: undefined });
      expect(res).toBe(payload);
    });
  });

  describe("listMine", () => {
    it("llama GET /posts/me con params y retorna data", async () => {
      const params: ListPostsParams = { page: 2, limit: 5, tag: "react" };

      const payload: Paginated<Post> = {
        items: [] as Post[],
        meta: { page: 2, limit: 5, total: 0 },
      } as unknown as Paginated<Post>;

      vi.mocked(http.get).mockResolvedValue({ data: payload });

      const res = await PostsService.listMine(params);

      expect(http.get).toHaveBeenCalledWith("/posts/me", { params });
      expect(res).toBe(payload);
    });
  });
});
