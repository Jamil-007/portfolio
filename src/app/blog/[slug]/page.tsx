import { BlogPostPage } from "@/components/blog/BlogPostPage/BlogPostPage";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return <BlogPostPage slug={slug} />;
}
