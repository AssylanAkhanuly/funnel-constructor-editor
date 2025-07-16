import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cva, VariantProps } from "class-variance-authority";
import { Edit, Settings } from "lucide-react";
import Link from "next/link";
import { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

const variants = cva(["m-2 cursor-pointer transition-all hover:shadow-md"], {
  variants: {
    state: {
      active: ["ring-2 ring-primary"],
      default: [],
    },
  },
});
const PageCard = ({
  className,
  state,
  page,
  quizVersion: quizVersion,
  ...props
}: VariantProps<typeof variants> &
  HTMLAttributes<HTMLDivElement> & {
    page: { id: string; order: string; type: "teaser" | "quiz" };
    quizVersion: string;
  }) => {
  return (
    <Card {...props} className={twMerge(variants({ state, className }))}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              #{page.order}
            </Badge>
            <Badge
              className="capitalize"
              variant={page.type === "teaser" ? "default" : "secondary"}
            >
              {page.type}
            </Badge>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size={"sm"} variant={"ghost"}>
                <Settings />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <Link href={`/${quizVersion}/${page.id}`}>
                <DropdownMenuItem>
                  Edit
                  <Edit />
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <CardTitle className="text-sm mb-1">ID: {page.id}</CardTitle>
        {/* <CardDescription className="text-xs">
          {page.next && `Next: ${page.next}`}
          {page.nextMap.size > 0 && (
            <div className="text-primary mt-1">
              {page.nextMap.size} conditional routes
            </div>
          )}
        </CardDescription> */}
      </CardContent>
    </Card>
  );
};

export default PageCard;
