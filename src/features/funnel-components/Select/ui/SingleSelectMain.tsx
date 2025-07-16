"use client";
import { cva, VariantProps } from "class-variance-authority";
import Image from "next/image";
import { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";
import Text from "../../TextOld";

const variants = cva(["text-[18px]"], {
  variants: {
    version: {
      v1: ["font-medium"],
      v2: ["phone:text-[17px]"],
    },
  },
  defaultVariants: {
    version: "v1",
  },
});
export type SingleDefaultOptionType = {
  custom_id: string;
  file?: string;
  title: string;
};
function SingleSelectMain<T extends SingleDefaultOptionType>({
  options,
  selectedOptionId,
  onChangeOption,
  className,
  version,
}: VariantProps<typeof variants> &
  HTMLAttributes<HTMLDivElement> & {
    options: T[];
    selectedOptionId: string | undefined;
    onChangeOption: (option: T) => void;
  }) {
  return (
    <div
      className={twMerge(
        "w-full desktop:mx-auto desktop:max-w-[450px] flex flex-col gap-6 items-stretch",
        className
      )}
    >
      {options.map((option, id) => (
        <button
          key={option.custom_id}
          onClick={() => onChangeOption(option)}
          style={{
            borderColor:
              selectedOptionId === option.custom_id ? "#0057FF" : "transparent",
            backgroundColor:
              selectedOptionId === option.custom_id ? "#EDF3FF" : "#fff",
          }}
          className="w-full desktop:min-h-[80px] phone:min-h-[64px] px-5 py-3 flex items-center gap-4 border-m rounded-m shadow-Shadow-1"
        >
          {option.file && (
            <Image
              loading="eager"
              width={38}
              height={38}
              alt="option-image"
              src={option.file}
            />
          )}
          <Text
            className={twMerge("flex-auto text-left", variants({ version }))}
          >
            {option.title}
          </Text>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="shrink-0 "
          >
            {selectedOptionId === option.custom_id ? (
              <path
                d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16.78 9.7L11.11 15.37C10.97 15.51 10.78 15.59 10.58 15.59C10.38 15.59 10.19 15.51 10.05 15.37L7.22 12.54C6.93 12.25 6.93 11.77 7.22 11.48C7.51 11.19 7.99 11.19 8.28 11.48L10.58 13.78L15.72 8.64C16.01 8.35 16.49 8.35 16.78 8.64C17.07 8.93 17.07 9.4 16.78 9.7Z"
                fill="#0057FF"
              />
            ) : (
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.9985 2C17.5205 2 21.997 6.47715 21.997 12C21.997 17.5228 17.5205 22 11.9985 22C6.47647 22 2 17.5228 2 12C2 6.47715 6.47647 2 11.9985 2ZM11.9989 3.36284C7.22992 3.36284 3.36387 7.22947 3.36387 11.9992C3.36387 16.7689 7.22992 20.6356 11.9989 20.6356C16.7679 20.6356 20.634 16.7689 20.634 11.9992C20.634 7.22947 16.7679 3.36284 11.9989 3.36284Z"
                fill="#0057FF"
              />
            )}
          </svg>
        </button>
      ))}
    </div>
  );
}

export default SingleSelectMain;
