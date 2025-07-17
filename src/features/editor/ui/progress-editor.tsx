"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { JsxEditorProps, useMdastNodeUpdater } from "@mdxeditor/editor";
import { useForm } from "react-hook-form";
import z from "zod";
const validator = z.object({
  back: z.boolean(),
  logo: z.boolean(),
  burger: z.boolean(),
});
const ProgressEditor = (props: JsxEditorProps) => {
  const updateNode = useMdastNodeUpdater();
  const form = useForm<z.infer<typeof validator>>({
    resolver: zodResolver(validator),
    defaultValues: {},
  });
  const onSubmit = (data: z.infer<typeof validator>) => {};
  return (
    <div className="p-4 space-y-2 border rounded-lg bg-background">
      <h3 className="font-semibold">Progress</h3>
    </div>
  );
};

export default ProgressEditor;
