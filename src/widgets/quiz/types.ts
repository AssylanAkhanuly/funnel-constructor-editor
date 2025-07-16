import z from "zod";

export const pageTypeValidator = z.union([
  z.literal("teaser"),
  z.literal("quiz"),
]);
export type PageType = z.infer<typeof pageTypeValidator>;
export type PageFrontmatterType = {
  id: string;
  order: string;
  type: PageType;
};

export type Page = {
  frontmatter: PageFrontmatterType;
  key: string;
};
