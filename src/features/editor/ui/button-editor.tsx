"use client";
import { Button } from "@/components/ui/button";
import { Form, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { JsxEditorProps, useMdastNodeUpdater } from "@mdxeditor/editor";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";
const validator = z.object({
  text: z.string(),
});
const ButtonEditor = (props: JsxEditorProps) => {
  const updateNode = useMdastNodeUpdater();
  const form = useForm<z.infer<typeof validator>>({
    resolver: zodResolver(validator),
    defaultValues: {},
  });
  const onSubmit = (data: z.infer<typeof validator>) => {
    updateNode({
      ...props.mdastNode,
      attributes: [
        { name: "text", type: "mdxJsxAttribute", value: data.text },
      ],
    });
  };
  return (
    <div className="p-4 space-y-2 border rounded-lg bg-background">
      <h3 className="font-semibold">Button</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormItem>
            <FormLabel>Text</FormLabel>
            <div className="space-y-2">
              <Label htmlFor="file">Upload File</Label>
              <Input {...form.register("text")} />
            </div>
            <FormMessage />
          </FormItem>

          <Button disabled={form.formState.isSubmitting} type="submit">
            {form.formState.isSubmitting && (
              <LoaderCircle className="animate-spin" />
            )}
            Update
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ButtonEditor;
