"use client";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

export type SingleSelectRateOptionType = {
  custom_id: number;
  file?: string;
  title: string;
};
function SingleSelectRate<T extends SingleSelectRateOptionType>({
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
          style={{
            borderColor:
              selectedOptionId === option.custom_id ? "#0057FF" : "#F3F3F3",
            backgroundColor:
              selectedOptionId === option.custom_id ? "#EDF3FF" : "#F3F3F3",
          }}
          className="p-4 border-m rounded-m"
        >
          {option.file && (
            <Image
              loading="eager"
              width={40}
              height={40}
              alt="option-img"
              src={option.file}
            />
          )}
        </button>
      ))}
    </div>
  );
}

export default SingleSelectRate;
