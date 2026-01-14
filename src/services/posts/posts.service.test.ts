import { describe, it, expect, vi, beforeEach } from "vitest";
import { http } from "../http/client";
import { PostsService } from "./posts.services";

import type {
  Paginated,
  Post,
  ListPostsParams,
  CreatePostRequest,
  UpdatePostRequest,
} from "./post.types";

vi.mock("../http/client", () => ({
  http: {
      get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
},
}));

const makePost = (overrides: Partial<Post> = {}): Post =>
  ({
    id: "p1",
    title: "T",
    content: "C",
    excerpt: null,
    status: "published",
    tags: [],
    coverUrl: null,
    author: { id: "u1", name: "Test", email: "test@test.com" },
    created_at: new Date("2026-01-14T00:00:00.000Z"),
    updated_at: new Date("2026-01-14T01:00:00.000Z"),
    ...overrides,
  } as Post);

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

describe("PostsService.create", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("crea un post usando FormData y retorna data", async () => {
    const payload: CreatePostRequest = {
      title: "Nuevo post",
      content: "Contenido",
      excerpt: "Resumen",
      status: "published",
      tags: ["react", "test"],
    };

    const response: Post = {
      id: "1",
      title: "Nuevo post",
      content: "Contenido",
      excerpt: "Resumen",
      status: "published",
      tags: ["react", "test"],
      coverUrl: null,
      author: {
        id: "u1",
        name: "Test",
        email: "test@test.com",
      },
      created_at: new Date(),
      updated_at: new Date(),
    } as Post;

    vi.mocked(http.post).mockResolvedValue({ data: response });

    const res = await PostsService.create(payload);

    expect(http.post).toHaveBeenCalledWith("/posts", expect.any(FormData), {
      headers: { "Content-Type": "multipart/form-data" },
    });

    expect(res).toBe(response);
  });
});


describe("PostsService.update", () => {
  beforeEach(() => vi.clearAllMocks());

  it("llama PATCH /posts/:id con FormData y retorna data", async () => {
    const payload: UpdatePostRequest = {
      title: "Nuevo",
      content: "Nuevo contenido",
      tags: ["react", "vitest"],
      removeCover: true,
    };

    const response = makePost({ id: "p9", title: "Nuevo" });

    vi.mocked(http.patch).mockResolvedValue({ data: response });

    const res = await PostsService.update("p9", payload);

    expect(http.patch).toHaveBeenCalledWith("/posts/p9", expect.any(FormData), {
      headers: { "Content-Type": "multipart/form-data" },
    });

    expect(res).toBe(response);
  });
});

describe("PostsService.remove", () => {
  beforeEach(() => vi.clearAllMocks());

  it("llama DELETE /posts/:id y retorna data", async () => {
    vi.mocked(http.delete).mockResolvedValue({ data: { ok: true } });

    const res = await PostsService.remove("p1");

    expect(http.delete).toHaveBeenCalledWith("/posts/p1");
    expect(res).toEqual({ ok: true });
  });
});

describe("PostsService.getById", () => {
  beforeEach(() => vi.clearAllMocks());

  it("llama GET /posts/:id y retorna data", async () => {
    const response = makePost({ id: "p2" });
    vi.mocked(http.get).mockResolvedValue({ data: response });

    const res = await PostsService.getById("p2");

    expect(http.get).toHaveBeenCalledWith("/posts/p2");
    expect(res).toBe(response);
  });
});
