import Image from "next/image";
import { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";
import Text from "../../TextOld";

export type YesNoOptionType = {
  custom_id: number;
  title: string;
  file?: string;
};

function SingleSelectYesNo<T extends YesNoOptionType>({
  options,
  selectedOptionId: selectedOptionId,
  onChangeOption: onChangeOption,
  className,
  ...props
}: {
  options: T[];
  selectedOptionId: number | undefined;
  onChangeOption: (option: T) => void;
} & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={twMerge(
        "mx-auto w-full desktop:max-w-[340px] flex gap-6 items-stretch",
        className
      )}
    >
      {options.map((option) => (
        <button
          key={option.custom_id}
          onClick={() => onChangeOption(option)}
          style={{
            backgroundColor:
              selectedOptionId === option.custom_id ? "#EDF3FF" : "white",
            borderColor:
              selectedOptionId === option.custom_id ? "#0057FF" : "white",
          }}
          className="flex-1 p-3 flex flex-col items-center gap-3 border-m rounded-m shadow-Shadow-1 cursor-pointer"
        >
          {option.file && (
            <Image width={60} height={60} alt="no" src={option.file} />
          )}
          <Text className="text-[17px] font-medium">{option.title}</Text>
        </button>
      ))}
    </div>
  );
}

export default SingleSelectYesNo;
