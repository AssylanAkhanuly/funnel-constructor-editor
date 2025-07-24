"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JsxEditorProps, useMdastNodeUpdater } from "@mdxeditor/editor";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";
import { uploadMedia } from "../actions";
import { getAttributeValue } from "../utils";
export const validator = z.object({
  src: z.string(),
  type: z.union([z.literal("image")]),
  file: z.any().refine((file) => file instanceof File && file.size > 0, {
    message: "File is required",
  }),
});

const ImageEditor = (props: JsxEditorProps) => {
  const updateNode = useMdastNodeUpdater();

  const quizVersion = getAttributeValue(props, "quizVersion");
  const pageId = getAttributeValue(props, "pageId");
  const form = useForm<z.infer<typeof validator>>({
    defaultValues: {
      src: getAttributeValue(props, "src"),
      type: "image",
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
            <Label htmlFor="file">Upload File</Label>
            <Input type="file" {...form.register("file")} />
          </div>

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="image">Image</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            disabled={form.formState.isSubmitting}
            type="submit"
            className="w-full"
          >
            {form.formState.isSubmitting && (
              <LoaderCircle className="animate-spin" />
            )}
            Save Image
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ImageEditor;
