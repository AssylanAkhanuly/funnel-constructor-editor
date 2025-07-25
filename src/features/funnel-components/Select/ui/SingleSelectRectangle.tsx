"use client";
import Image from "next/image";
import { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";
import Text from "../../TextOld";

export type SingleGridOptionType = {
  custom_id: string;
  file?: string;
  title: string;
};
function SingleSelectRectangle<T extends SingleGridOptionType>({
  options,
  selectedOptionId: selectedOption,
  onChangeOption: onChangeOption,
  className,
}: {
  options: T[];
  selectedOptionId: string | undefined;
  onChangeOption: (option: T) => void;
} & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge(
        "max-w-[383px] mx-auto w-full grid grid-cols-2 gap-6",
        className
      )}
    >
      {options.map((option, id) => (
        <button
          key={option.custom_id}
          onClick={() => onChangeOption(option)}
          style={{
            borderColor:
              selectedOption === option.custom_id ? "#0057FF" : "transparent",
            backgroundColor:
              selectedOption === option.custom_id ? "#EDF3FF" : "#fff",
          }}
          className="w-full aspect-square p-3 flex flex-col justify-center items-center gap-4 border-m rounded-m shadow-Shadow-1"
        >
         {option.file &&  <Image
            loading="eager"
            width={38}
            height={38}
            alt="option-image"
            src={option.file}
          />}
          <Text className="text-center text-[18px] font-medium whitespace-pre-wrap">
            {option.title}
          </Text>
        </button>
      ))}
    </div>
  );
}

export default SingleSelectRectangle;
