"use client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { JsxEditorProps, useMdastNodeUpdater } from "@mdxeditor/editor";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";
import { uploadMedia } from "../actions";
export const validator = z.object({
  src: z.string(),
  file: z.any().refine((file) => file instanceof File && file.size > 0, {
    message: "File is required",
  }),
});

const LottieEditor = (props: JsxEditorProps) => {
  const updateNode = useMdastNodeUpdater();
  const getAttributeValue = (name: string): string => {
    const attr = props.mdastNode.attributes?.find(
      (attr) => "name" in attr && attr.name === name
    );
    if (attr && "value" in attr && typeof attr.value === "string") {
      return attr.value;
    }
    return "";
  };
  const quizVersion = getAttributeValue("quizVersion");
  const pageId = getAttributeValue("pageId");
  const form = useForm<z.infer<typeof validator>>({
    defaultValues: {
      src: getAttributeValue("src"),
    },
  });

  const onSubmit = async (data: z.infer<typeof validator>) => {
    if (!data.file?.length) return;
    const url = await uploadMedia(quizVersion, pageId, data.file[0]);
    const attributes = [
      { name: "src", type: "mdxJsxAttribute" as const, value: url },
    ];
    updateNode({ ...props.mdastNode, attributes });
  };
  return (
    <div className="p-4 border rounded-lg bg-background">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file">Upload Lottie File</Label>
            <Input type="file" accept=".json" {...form.register("file")} />
          </div>
          <Button
            disabled={form.formState.isSubmitting}
            type="submit"
            className="w-full"
          >
            {form.formState.isSubmitting && (
              <LoaderCircle className="animate-spin" />
            )}
            Save
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default LottieEditor;
