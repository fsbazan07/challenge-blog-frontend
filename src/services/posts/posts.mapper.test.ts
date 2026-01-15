import { describe, it, expect } from "vitest";
import type { PostApi } from "./post.types";

type PostApiDates = Pick<PostApi, "created_at" | "updated_at">;

const mapPost = (p: PostApiDates) => ({
  ...p,
  created_at: new Date(p.created_at),
  updated_at: new Date(p.updated_at),
});

describe("mapPost", () => {
  it("convierte created_at y updated_at a Date", () => {
    const api: PostApiDates = {
      created_at: "2026-01-14T00:00:00.000Z",
      updated_at: "2026-01-14T01:00:00.000Z",
    };

    const out = mapPost(api);

    expect(out.created_at).toBeInstanceOf(Date);
    expect(out.updated_at).toBeInstanceOf(Date);
    expect(out.created_at.toISOString()).toBe("2026-01-14T00:00:00.000Z");
  });
});
