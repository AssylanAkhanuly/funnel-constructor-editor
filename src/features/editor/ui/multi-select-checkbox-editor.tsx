"use client";
import { Button } from "@/components/ui/button";
import { Form, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { tryParse } from "@/shared/utils/try-parse";
import { zodResolver } from "@hookform/resolvers/zod";
import { JsxEditorProps, useMdastNodeUpdater } from "@mdxeditor/editor";
import { LoaderCircle, Plus, Trash } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import z from "zod";
import { uploadMedia } from "../actions";
import { getAttributeValue } from "../utils";

const validator = z.object({
  options: z.array(
    z.object({
      label: z.string().min(1, "Label is required"),
      value: z.string().min(1, "Value is required"),
      next: z.string().optional(), // next page id (optional)
      file: z.union([
        z.any().refine((file) => file instanceof FileList),
        z.null(),
      ]),
    })
  ),
});

type FormValues = z.infer<typeof validator>;

const MultiSelectCheckboxEditor = (props: JsxEditorProps) => {
  const updateNode = useMdastNodeUpdater();
  const optionsProp = props.mdastNode.attributes.find(
    (attribute) =>
      attribute.type === "mdxJsxAttribute" && attribute.name === "options"
  );
  const form = useForm<FormValues>({
    resolver: zodResolver(validator),
    defaultValues: {
      options: tryParse(optionsProp?.value) || [
        { label: "", value: uuidv4(), file: null },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "options",
  });

  const onSubmit = async (data: FormValues) => {
    const quizVersion = getAttributeValue(props, "quizVersion");
    const pageId = getAttributeValue(props, "pageId");
    const options = await Promise.all(
      data.options.map(async (option) => {
        if (option.file) {
          const [file] = option.file;
          if (file) {
            const url = await uploadMedia(quizVersion, pageId, file);
            return {
              ...option,
              file: url,
            };
          }
        }
        return { ...option, file: null };
      })
    );
    updateNode({
      ...props.mdastNode,
      attributes: [
        {
          name: "options",
          type: "mdxJsxAttribute",
          value: JSON.stringify(options),
        },
      ],
    });
  };

  return (
    <div className="p-4 space-y-2 border rounded-lg bg-background">
      <h3 className="font-semibold">Multi Select Checkbox options editor</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {fields.map((field, idx) => (
            <FormItem key={field.id}>
              <FormLabel>Option {idx + 1}</FormLabel>
              <div className="flex items-center gap-2">
                <Input
                  {...form.register(`options.${idx}.label`)}
                  placeholder="Label"
                />
                <Input
                  {...form.register(`options.${idx}.value`)}
                  placeholder="Value"
                  readOnly
                  className="w-40"
                />

                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => remove(idx)}
                  disabled={fields.length === 1}
                  aria-label="Remove option"
                >
                  <Trash size={16} />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept=".webp"
                  {...form.register(`options.${idx}.file`)}
                  placeholder="File URL (optional)"
                  className="w-60"
                />
              </div>

              <FormMessage>
                {form.formState.errors.options?.[idx]?.label?.message}
                {form.formState.errors.options?.[idx]?.value?.message}
                {form.formState.errors.options?.[idx]?.next?.message}
                {form.formState.errors.options?.[idx]?.file?.message}
              </FormMessage>
            </FormItem>
          ))}
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              append({
                label: "",
                value: uuidv4(),
                next: "",
                file: null,
              })
            }
            className="flex items-center gap-2"
          >
            <Plus size={16} /> Add Option
          </Button>
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

export default MultiSelectCheckboxEditor;
