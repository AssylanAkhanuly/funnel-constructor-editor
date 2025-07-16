"use client";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ChevronsUpDownIcon, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { createQuizPage } from "../actions";
import { PageType, pageTypeValidator } from "../types";

const PAGE_TYPES: PageType[] = ["quiz", "teaser"];
const validator = z.object({
  id: z.string().min(1),
  order: z.string().min(1),
  type: pageTypeValidator,
});
const QuizPagesHeader = ({
  quizVersion: quizVersion,
}: {
  quizVersion: string;
}) => {
  const form = useForm<z.infer<typeof validator>>({
    resolver: zodResolver(validator),
    defaultValues: {
      type: "teaser",
    },
  });
  const [open, setOpen] = useState(false);
  const router = useRouter();
  return (
    <AlertDialog>
      <div className="bg-white border-b px-6 py-4">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Quiz</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{quizVersion}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
          <div className="flex justify-center ">
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Plus className="w-4 h-4" />
                Add Page
              </Button>
            </AlertDialogTrigger>
          </div>
        </div>
      </div>

      <AlertDialogContent>
        <form
          onSubmit={form.handleSubmit(async (data) => {
            console.log("redirect");
            await createQuizPage(quizVersion, data);
            //   router.push(`/${quizVersion}/${data.id}`);
          })}
          className="space-y-3"
        >
          <AlertDialogTitle>New page</AlertDialogTitle>
          <Input placeholder="id" {...form.register("id")} />
          <Input placeholder="order" {...form.register("order")} />
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[200px] justify-between"
              >
                {form.watch("type")}
                <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandList>
                  <CommandEmpty>No framework found.</CommandEmpty>
                  <CommandGroup>
                    {PAGE_TYPES.map((pageType) => (
                      <CommandItem
                        key={pageType}
                        value={pageType}
                        onSelect={(currentValue) => {
                          form.setValue("type", pageType);
                          setOpen(false);
                        }}
                      >
                        {pageType}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <AlertDialogFooter>
            <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
            <AlertDialogAction type="submit">Create</AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default QuizPagesHeader;
