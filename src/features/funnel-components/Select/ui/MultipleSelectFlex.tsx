import { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";
import Text from "../../TextOld";

export type MultiSelectFlexOptionType = {
  custom_id: string;
  file?: string;
  title: string;
};
function MultiSelectFlex<T extends MultiSelectFlexOptionType>({
  options,
  selectedOptionIds,
  onChangeOption,
  className,
}: {
  onChangeOption: (option: T) => void;
  selectedOptionIds: string[];
  options: T[];
} & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge(
        `flex flex-wrap gap-3 justify-center phone:items-end desktop:items-center`,
        className
      )}
    >
      {options.map((option) => (
        <div
          onClick={() => onChangeOption(option)}
          style={{
            borderColor: selectedOptionIds.includes(option.custom_id)
              ? "#B1CBFF"
              : "#EDF3FF",
          }}
          className="phone:px-2 desktop:px-3 py-1 flex gap-2 items-center border-m rounded-m cursor-pointer"
          key={option.custom_id}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="17"
            height="16"
            viewBox="0 0 17 16"
            fill="none"
          >
            <rect
              x="1"
              y="0.5"
              width="15"
              height="15"
              rx="1.5"
              fill={
                selectedOptionIds.includes(option.custom_id)
                  ? "#0057FF"
                  : "white"
              }
              stroke="#0057FF"
            />
            <path
              d="M7.2887 10.9221C7.11795 10.9221 6.95574 10.8538 6.83621 10.7342L4.42007 8.31809C4.17248 8.0705 4.17248 7.6607 4.42007 7.41311C4.66766 7.16552 5.07746 7.16552 5.32505 7.41311L7.2887 9.37675L11.677 4.98843C11.9246 4.74084 12.3344 4.74084 12.582 4.98843C12.8296 5.23602 12.8296 5.64582 12.582 5.89341L7.74119 10.7342C7.62167 10.8538 7.45945 10.9221 7.2887 10.9221Z"
              fill="white"
            />
          </svg>
          <Text className="text-[18px]">{option.title}</Text>
        </div>
      ))}
    </div>
  );
}

export default MultiSelectFlex;
