"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { deleteTechnology, saveTechnology } from "@/lib/firestore-data";
import type { Technology } from "@/lib/types";
import { Panel } from "@/components/admin/Panel/Panel";
import { TextInput } from "@/components/admin/TextInput/TextInput";
import { FormActions } from "@/components/admin/FormActions/FormActions";
import { ItemList } from "@/components/admin/ItemList/ItemList";

const emptyTechnology: Omit<Technology, "id"> = {
  name: "",
  icon: "",
};

export function TechnologyAdmin({ technologies, setMessage }: { technologies: Technology[]; setMessage: (value: string) => void }) {
  const [editing, setEditing] = useState<Technology | null>(null);
  const { register, handleSubmit, reset } = useForm<Omit<Technology, "id">>({ defaultValues: emptyTechnology });

  async function submit(values: Omit<Technology, "id">) {
    await saveTechnology(values, editing?.id);
    setEditing(null);
    reset(emptyTechnology);
    setMessage("Technology saved.");
  }

  return (
    <div className="grid gap-5">
      <Panel title={editing ? `Edit ${editing.name}` : "Add technology"}>
        <form onSubmit={handleSubmit(submit)} className="grid gap-3">
          <TextInput label="Name" {...register("name", { required: true })} />
          <FormActions onCancel={() => { setEditing(null); reset(emptyTechnology); }} />
        </form>
      </Panel>
      <Panel title="Technologies">
        <ItemList
          items={technologies}
          primary={(tech) => tech.name}
          onEdit={(tech) => {
            setEditing(tech);
            reset(tech);
          }}
          onDelete={async (tech) => {
            await deleteTechnology(tech.id);
            setMessage("Technology deleted.");
          }}
        />
      </Panel>
    </div>
  );
}
