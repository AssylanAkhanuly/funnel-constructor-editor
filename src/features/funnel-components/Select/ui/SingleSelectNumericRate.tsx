"use client";
import { cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

export type SingleSelectNumericRateOptionType = {
  custom_id: number;
  file?: string;
  title: string;
};

const variants = cva(
  [
    "flex font-medium items-center justify-center w-[56px] h-[56px] text-[20px] desktop:hover: desktop:text-[24px] desktop:w-[72px] desktop:h-[72px] border-m rounded-m",
  ],
  {
    variants: {
      state: {
        selected: ["border-[#0057FF] bg-[#EDF3FF] border-[1px]"],
        default: ["border-[#F3F3F3] bg-[#F3F3F3] desktop:hover:bg-[#EDF3FF]"],
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
);
function SingleSelectNumericRate<T extends SingleSelectNumericRateOptionType>({
  options,
  selectedOptionId: selectedOptionId,
  onChangeOption: onChangeOption,
  className,
}: {
  options: T[];
  selectedOptionId: number | undefined;
  onChangeOption: (opiton: T) => void;
  className?: string;
}) {
  return (
    <div
      className={twMerge(
        `flex items-center gap-4 justify-between mx-auto w-full`,
        className
      )}
    >
      {options.map((option, id) => (
        <button
          data-testid={option.title}
          type="button"
          key={option.custom_id}
          onClick={() => onChangeOption(option)}
          className={twMerge(
            variants({
              state:
                option.custom_id === selectedOptionId ? "selected" : "default",
            })
          )}
        >
          {option.title}
        </button>
      ))}
    </div>
  );
}

export default SingleSelectNumericRate;
