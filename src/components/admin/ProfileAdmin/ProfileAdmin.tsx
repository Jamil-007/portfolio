"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Save } from "lucide-react";
import { saveProfile } from "@/lib/firestore-data";
import type { Profile } from "@/lib/types";
import { Panel } from "@/components/admin/Panel/Panel";
import { TextInput } from "@/components/admin/TextInput/TextInput";
import { TextArea } from "@/components/admin/TextArea/TextArea";

export function ProfileAdmin({ profile, setMessage }: { profile: Profile; setMessage: (value: string) => void }) {
  const { register, handleSubmit, reset } = useForm<Profile>({ defaultValues: profile });

  useEffect(() => {
    reset(profile);
  }, [profile, reset]);

  async function submit(values: Profile) {
    await saveProfile(values);
    setMessage("Profile saved.");
  }

  return (
    <Panel title="Profile">
      <form onSubmit={handleSubmit(submit)} className="grid gap-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <TextInput label="Name" {...register("name", { required: true })} />
          <TextInput label="Role" {...register("role", { required: true })} />
        </div>
        <TextInput label="Short bio" {...register("shortBio", { required: true })} />
        <TextArea label="About" rows={5} {...register("about", { required: true })} />
        <TextArea label="Fun fact" rows={3} {...register("funFact", { required: true })} />
        <TextInput label="Photo URL" {...register("photoUrl")} />
        <TextInput label="Email" type="email" {...register("email", { required: true })} />
        <div className="grid gap-3 sm:grid-cols-3">
          <TextInput label="Resume URL" {...register("resumeUrl")} />
          <TextInput label="GitHub URL" {...register("githubUrl")} />
          <TextInput label="LinkedIn URL" {...register("linkedinUrl")} />
        </div>
        <TextInput label="Location" {...register("location")} />
        <button className="inline-flex w-fit items-center gap-2 rounded bg-[#0075de] px-4 py-2 text-sm font-semibold text-white hover:bg-[#005bab]">
          <Save size={16} /> Save profile
        </button>
      </form>
    </Panel>
  );
}
