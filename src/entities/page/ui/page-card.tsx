import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { cva, VariantProps } from "class-variance-authority";
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
const   PageCard = ({
  className,
  state,
  page,
  ...props
}: VariantProps<typeof variants> &
  HTMLAttributes<HTMLDivElement> & {
    page: { order: number; type: "teaser" | "quiz" };
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
