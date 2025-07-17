"use client";

import { Progress as ProgressBar } from "@/components/ui/progress";
import { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";
import Text from "../TextOld";
const Progress = ({
  className,
  percent = 50,
  currentPage: currentPage = 10,
  pageCount = 20,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  percent: number;
  currentPage: number;
  pageCount: number;
}) => {
  return (
    <div {...props} className={twMerge("flex gap-4 items-center", className)}>
      <ProgressBar
        className="flex-auto phone:h-2 desktop:h-3 border-none bg-[#f1f2f4]"
        indicatorClassName="bg-[#0057ff] rounded-full"
        value={percent}
      />
      <div>
        <Text className="text-[15px] font-medium">
          <span className="text-Main-Blue">{currentPage}</span>/{pageCount}
        </Text>
      </div>
    </div>
  );
};

export { Progress };

