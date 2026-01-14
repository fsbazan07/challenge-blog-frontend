import { describe, it, expect, vi, beforeEach } from "vitest";
import { http } from "../http/client";
import { PostsService } from "./posts.services";

import type {
  Paginated,
  PostApi,
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

const makePostApi = (overrides: Partial<PostApi> = {}): PostApi => ({
  id: "p1",
  title: "T",
  excerpt: null,
  content: "C",
  coverUrl: null,
  tags: [],
  status: "published",
  author: { id: "u1", name: "Test", email: "test@test.com" },
  created_at: "2026-01-14T00:00:00.000Z",
  updated_at: "2026-01-14T01:00:00.000Z",
  ...overrides,
});

describe("PostsService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("listFeed", () => {
    it("llama GET /posts con params y mapea fechas a Date", async () => {
      const params: ListPostsParams = { page: 1, limit: 10, q: "hola" };

      const apiPayload: Paginated<PostApi> = {
        items: [makePostApi()],
        page: 1,
        limit: 10,
        total: 1,
      };

      vi.mocked(http.get).mockResolvedValue({ data: apiPayload });

      const res = await PostsService.listFeed(params);

      expect(http.get).toHaveBeenCalledWith("/posts", { params });

      expect(res.page).toBe(1);
      expect(res.items).toHaveLength(1);
      expect(res.items[0].created_at).toBeInstanceOf(Date);
      expect(res.items[0].updated_at).toBeInstanceOf(Date);
      expect(res.items[0].created_at.toISOString()).toBe(
        "2026-01-14T00:00:00.000Z"
      );
    });

    it("si params es undefined, igual llama GET /posts", async () => {
      const apiPayload: Paginated<PostApi> = {
        items: [],
        page: 1,
        limit: 10,
        total: 0,
      };

      vi.mocked(http.get).mockResolvedValue({ data: apiPayload });

      const res = await PostsService.listFeed();

      expect(http.get).toHaveBeenCalledWith("/posts", { params: undefined });
      expect(res).toStrictEqual({ ...apiPayload, items: [] });
    });
  });

  describe("listMine", () => {
    it("llama GET /posts/me con params y mapea fechas a Date", async () => {
      const params: ListPostsParams = { page: 2, limit: 5, tag: "react" };

      const apiPayload: Paginated<PostApi> = {
        items: [makePostApi({ id: "p2" })],
        page: 2,
        limit: 5,
        total: 1,
      };

      vi.mocked(http.get).mockResolvedValue({ data: apiPayload });

      const res = await PostsService.listMine(params);

      expect(http.get).toHaveBeenCalledWith("/posts/me", { params });
      expect(res.items[0].created_at).toBeInstanceOf(Date);
    });
  });
});

describe("PostsService.create", () => {
  beforeEach(() => vi.clearAllMocks());

  it("crea un post usando FormData y retorna Post con fechas Date", async () => {
    const payload: CreatePostRequest = {
      title: "Nuevo post",
      content: "Contenido",
      excerpt: "Resumen",
      status: "published",
      tags: ["react", "test"],
    };

    const apiResponse: PostApi = makePostApi({
      id: "1",
      title: "Nuevo post",
      excerpt: "Resumen",
      tags: ["react", "test"],
    });

    vi.mocked(http.post).mockResolvedValue({ data: apiResponse });

    const res = await PostsService.create(payload);

    expect(http.post).toHaveBeenCalledWith("/posts", expect.any(FormData), {
      headers: { "Content-Type": "multipart/form-data" },
    });

    expect(res.created_at).toBeInstanceOf(Date);
    expect(res.updated_at).toBeInstanceOf(Date);
    expect(res.id).toBe("1");
  });
});

describe("PostsService.update", () => {
  beforeEach(() => vi.clearAllMocks());

  it("llama PATCH /posts/:id con FormData y retorna Post con fechas Date", async () => {
    const payload: UpdatePostRequest = {
      title: "Nuevo",
      content: "Nuevo contenido",
      tags: ["react", "vitest"],
      removeCover: true,
    };

    const apiResponse: PostApi = makePostApi({ id: "p9", title: "Nuevo" });

    vi.mocked(http.patch).mockResolvedValue({ data: apiResponse });

    const res = await PostsService.update("p9", payload);

    expect(http.patch).toHaveBeenCalledWith("/posts/p9", expect.any(FormData), {
      headers: { "Content-Type": "multipart/form-data" },
    });

    expect(res.created_at).toBeInstanceOf(Date);
    expect(res.id).toBe("p9");
    expect(res.title).toBe("Nuevo");
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

  it("llama GET /posts/:id y retorna Post con fechas Date", async () => {
    const apiResponse: PostApi = makePostApi({ id: "p2" });

    vi.mocked(http.get).mockResolvedValue({ data: apiResponse });

    const res = await PostsService.getById("p2");

    expect(http.get).toHaveBeenCalledWith("/posts/p2");
    expect(res.created_at).toBeInstanceOf(Date);
    expect(res.id).toBe("p2");
  });
});
