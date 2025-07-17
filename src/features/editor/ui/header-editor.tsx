"use client";
import { Button } from "@/components/ui/button";
import { Form, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { JsxEditorProps, useMdastNodeUpdater } from "@mdxeditor/editor";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";
const validator = z.object({
  back: z.boolean(),
  logo: z.boolean(),
  burger: z.boolean(),
});
const HeaderEditor = (props: JsxEditorProps) => {
  const updateNode = useMdastNodeUpdater();
  const form = useForm<z.infer<typeof validator>>({
    resolver: zodResolver(validator),
    defaultValues: {},
  });
  const onSubmit = (data: z.infer<typeof validator>) => {
    updateNode({
      ...props.mdastNode,
      attributes: [
        { name: "back", type: "mdxJsxAttribute", value: String(data.back) },
        { name: "logo", type: "mdxJsxAttribute", value: String(data.logo) },
        { name: "burger", type: "mdxJsxAttribute", value: String(data.burger) },
      ],
    });
  };
  return (
    <div className="p-4 space-y-2 border rounded-lg bg-background">
      <h3 className="font-semibold">Header</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex justify-between">
            <FormItem>
              <FormLabel>Back Button</FormLabel>
              <Input
                type="checkbox"
                className="size-4"
                {...form.register("back")}
              />
              <FormMessage />
            </FormItem>
            <FormItem>
              <FormLabel>Logo</FormLabel>
              <Input
                type="checkbox"
                className="size-4"
                {...form.register("logo")}
              />
              <FormMessage />
            </FormItem>
            <FormItem>
              <FormLabel>Burger button</FormLabel>
              <Input
                type="checkbox"
                className="size-4"
                {...form.register("burger")}
              />
              <FormMessage />
            </FormItem>
          </div>
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

export default HeaderEditor;
