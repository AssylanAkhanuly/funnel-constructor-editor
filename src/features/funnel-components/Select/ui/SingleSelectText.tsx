"use client";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import Text from "../../TextOld";

export type SingleSelectTextOptionType = {
  custom_id: number;
  file?: string;
  title: string;
};
function SingleSelectText<T extends SingleSelectTextOptionType>({
  options,
  selectedOptionId: selectedOptionId,
  onChangeOption: onChangeOption,
  className,
}: {
  options: T[];
  selectedOptionId: number | undefined;
  onChangeOption: (option: T) => void;
  className?: string;
}) {
  return (
    <div
      className={twMerge(
        `desktop:mx-auto desktop:max-w-[450px] flex flex-col gap-6 items-stretch`,
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
          className="w-full desktop:min-h-[80px] px-5 py-3 flex items-center gap-4 border-m rounded-m shadow-Shadow-1"
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
          <Text className="flex-auto text-left text-[18px] font-medium whitespace-pre-wrap">
            {option.title}
          </Text>
        </button>
      ))}
    </div>
  );
}

export default SingleSelectText;
