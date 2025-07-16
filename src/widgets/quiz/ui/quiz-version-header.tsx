"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import z from "zod";
import { createQuizVersion } from "../actions";

const formValidator = z.object({
  name: z.string(),
});
const QuizVersionsHeader = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formValidator>>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: zodResolver(formValidator),
    defaultValues: {
      name: "",
    },
  });
  return (
    <>
      <AlertDialog>
        <div className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Funnel Versions</h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage and edit your funnel configurations
              </p>
            </div>
            <AlertDialogTrigger asChild>
              <Button onClick={() => {}} className="gap-2">
                <Plus className="w-4 h-4" />
                Create New Funnel
              </Button>
            </AlertDialogTrigger>
          </div>
        </div>
        <AlertDialogContent>
          <form
            onSubmit={form.handleSubmit(async (data) => {
              await createQuizVersion(data.name);
            })}
          >
            <AlertDialogTitle>New Quiz</AlertDialogTitle>
            <Input placeholder="v3.0.0" {...form.register("name")} />
            <AlertDialogAction
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              Create
            </AlertDialogAction>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default QuizVersionsHeader;
