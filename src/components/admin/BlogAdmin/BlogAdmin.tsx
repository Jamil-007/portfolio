"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { deleteBlogPost, saveBlogPost } from "@/lib/firestore-data";
import type { BlogPost } from "@/lib/types";
import { slugify, splitText } from "@/lib/settings-utils";
import { AdminGrid } from "@/components/admin/AdminGrid/AdminGrid";
import { Panel } from "@/components/admin/Panel/Panel";
import { TextInput } from "@/components/admin/TextInput/TextInput";
import { TextArea } from "@/components/admin/TextArea/TextArea";
import { FormActions } from "@/components/admin/FormActions/FormActions";
import { ItemList } from "@/components/admin/ItemList/ItemList";

type BlogFormValues = Omit<BlogPost, "id" | "tags" | "relatedProjects"> & {
  tagsText: string;
  relatedProjectsText?: string;
};

const emptyBlog: BlogFormValues = {
  title: "",
  slug: "",
  excerpt: "",
  coverImage: "",
  content: "",
  tagsText: "",
  publishedAt: new Date().toISOString().slice(0, 10),
  status: "published",
  relatedProjectsText: "",
};

export function BlogAdmin({ posts, setMessage }: { posts: BlogPost[]; setMessage: (value: string) => void }) {
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const { register, handleSubmit, reset, setValue, watch } = useForm<BlogFormValues>({ defaultValues: emptyBlog });
  const lastBlogAutoSlug = useRef("");
  const title = watch("title");
  const slug = watch("slug");

  useEffect(() => {
    if (editing) return;

    const nextSlug = slugify(title);
    if (!nextSlug) {
      lastBlogAutoSlug.current = "";
      return;
    }

    if (!slug || slug === lastBlogAutoSlug.current) {
      setValue("slug", nextSlug, { shouldDirty: true });
      lastBlogAutoSlug.current = nextSlug;
    }
  }, [editing, setValue, slug, title]);

  function edit(post: BlogPost) {
    setEditing(post);
    reset({
      ...post,
      tagsText: post.tags.join(", "),
      relatedProjectsText: post.relatedProjects?.join(", ") ?? "",
    });
  }

  async function submit(values: BlogFormValues) {
    const payload = {
      ...values,
      tags: splitText(values.tagsText),
      relatedProjects: splitText(values.relatedProjectsText ?? ""),
    };
    const { tagsText, relatedProjectsText, ...rest } = payload;
    void tagsText;
    void relatedProjectsText;
    await saveBlogPost({ ...rest, status: "published" }, editing?.id);
    setEditing(null);
    reset(emptyBlog);
    setMessage("Blog post saved.");
  }

  return (
    <AdminGrid>
      <Panel title={editing ? `Edit ${editing.title}` : "Add blog post"}>
        <form onSubmit={handleSubmit(submit)} className="grid gap-3">
          <TextInput label="Title" {...register("title", { required: true })} />
          <TextInput label="Slug" {...register("slug", { required: true })} />
          <TextInput label="Excerpt" {...register("excerpt", { required: true })} />
          <TextArea label="Content" rows={8} {...register("content", { required: true })} />
          <TextInput label="Tags, comma separated" {...register("tagsText")} />
          <TextInput label="Published date" type="date" {...register("publishedAt")} />
          <FormActions onCancel={() => { setEditing(null); reset(emptyBlog); }} />
        </form>
      </Panel>
      <Panel title="Blog posts">
        <ItemList
          items={posts}
          primary={(post) => post.title}
          secondary={(post) => post.publishedAt ?? "No date"}
          onEdit={edit}
          onDelete={async (post) => {
            await deleteBlogPost(post.id);
            setMessage("Blog post deleted.");
          }}
        />
      </Panel>
    </AdminGrid>
  );
}
