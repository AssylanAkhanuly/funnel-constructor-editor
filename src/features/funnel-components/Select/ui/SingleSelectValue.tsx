"use client";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import Text from "../../TextOld";

export type SingleSelectValueOptionType = {
  custom_id: number;
  file?: string;
  title: string;
  description: string;
};
function SingleSelectValue<T extends SingleSelectValueOptionType>({
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
        `w-full desktop:mx-auto desktop:max-w-[450px] flex flex-col gap-6 items-stretch`,
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
              width={38}
              loading="eager"
              height={38}
              alt="option-image"
              src={option.file}
            />
          )}
          <Text className="flex-auto text-left text-[18px] font-medium">
            {option.title}
          </Text>
          <Text
            style={{
              color: selectedOptionId === option.custom_id ? "#292D32" : "#737E8C",
            }}
          >
            {option.description}
          </Text>
        </button>
      ))}
    </div>
  );
}

export default SingleSelectValue;
