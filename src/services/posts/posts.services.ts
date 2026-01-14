import { http } from "../http/client";
import type {
  CreatePostRequest,
  ListPostsParams,
  Paginated,
  Post,
  PostApi,
  UpdatePostRequest,
} from "./post.types";

const mapPost = (p: PostApi): Post => ({
  ...p,
  created_at: new Date(p.created_at),
  updated_at: new Date(p.updated_at),
});

const mapPaginated = (data: Paginated<PostApi>): Paginated<Post> => ({
  ...data,
  items: data.items.map(mapPost),
});

export const PostsService = {
  // ---------------------------
  // API calls
  // ---------------------------

  async listFeed(params?: ListPostsParams): Promise<Paginated<Post>> {
    const { data } = await http.get<Paginated<PostApi>>("/posts", { params });
    return mapPaginated(data);
  },

  async listMine(params?: ListPostsParams): Promise<Paginated<Post>> {
    const { data } = await http.get<Paginated<PostApi>>("/posts/me", {
      params,
    });
    return mapPaginated(data);
  },

  async create(payload: CreatePostRequest): Promise<Post> {
    const fd = new FormData();

    fd.append("title", payload.title);
    fd.append("content", payload.content);

    if (payload.excerpt) fd.append("excerpt", payload.excerpt);
    if (payload.status) fd.append("status", payload.status);
    if (payload.tags?.length) fd.append("tags", payload.tags.join(","));
    if (payload.cover) fd.append("cover", payload.cover);

    const { data } = await http.post<PostApi>("/posts", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return mapPost(data);
  },

  async update(postId: string, payload: UpdatePostRequest): Promise<Post> {
    const fd = new FormData();

    if (payload.title !== undefined) fd.append("title", payload.title);
    if (payload.content !== undefined) fd.append("content", payload.content);

    if (payload.excerpt !== undefined)
      fd.append("excerpt", payload.excerpt ?? "");

    if (payload.status !== undefined) fd.append("status", payload.status);
    if (payload.tags !== undefined) fd.append("tags", payload.tags.join(","));

    if (payload.removeCover !== undefined)
      fd.append("removeCover", String(payload.removeCover));

    if (payload.cover) fd.append("cover", payload.cover);

    const { data } = await http.patch<PostApi>(`/posts/${postId}`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return mapPost(data);
  },

  async remove(postId: string): Promise<{ ok: true }> {
    const { data } = await http.delete<{ ok: true }>(`/posts/${postId}`);
    return data;
  },

  async getById(postId: string): Promise<Post> {
    const { data } = await http.get<PostApi>(`/posts/${postId}`);
    return mapPost(data);
  },
};
