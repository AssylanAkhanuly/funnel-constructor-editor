import Image from "next/image";
import {
  CSSProperties,
  HTMLAttributes,
  useEffect,
  useRef,
  useState,
} from "react";
import Text from "../../TextOld";

export type MultiSelectCheckboxOptionType = {
  custom_id: string;
  file?: string;
  title: string;
};
function MultiSelectCheckbox<T extends MultiSelectCheckboxOptionType>({
  options,
  selectedOptionIds,
  onChangeOption,
  className,
}: {
  onChangeOption: (option: T) => void;
  selectedOptionIds: string[];
  options: T[];
} & HTMLAttributes<HTMLDivElement>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"TOP" | "BOTTOM" | "BETWEEN">("TOP");
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollHeight, scrollTop, clientHeight } = containerRef.current;
        if (scrollHeight - scrollTop === clientHeight) {
          setState("BOTTOM");
        } else if (scrollTop === 0) {
          setState("TOP");
        } else {
          setState("BETWEEN");
        }
      }
    };
    containerRef.current?.addEventListener("scroll", handleScroll);
    return () => {
      containerRef.current?.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const style = ((): CSSProperties => {
    switch (state) {
      case "BOTTOM":
        return {
          borderTop: "1px rgb(241, 242, 244) solid",
        };
      case "TOP":
        return {
          borderBottom: "1px rgb(241, 242, 244) solid",
        };
      default:
        return {
          borderTop: "1px rgb(241, 242, 244) solid",
          borderBottom: "1px rgb(241, 242, 244) solid",
        };
    }
  })();
  return (
    <div ref={containerRef} className={className} style={style}>
      <div className="mx-auto max-w-[450px] flex flex-col phone:gap-3 desktop:gap-6 ">
        {options.map((option) => (
          <div
            key={option.custom_id}
            onClick={() => onChangeOption(option)}
            style={{
              borderColor: selectedOptionIds.includes(option.custom_id)
                ? "#0057FF"
                : "#EDF3FF",
              backgroundColor: selectedOptionIds.includes(option.custom_id)
                ? "#EDF3FF"
                : "white",
            }}
            className="px-4 py-3 desktop:min-h-[80px] phone:min-h-[64px] flex gap-2 items-center border-m rounded-m cursor-pointer shadow-Shadow-1"
          >
            {option.file && (
              <Image
                loading="eager"
                className="object-contain shrink-0"
                width={32}
                height={32}
                alt="option-img"
                src={option.file}
              />
            )}
            <Text className="flex-auto text-[18px] font-medium">
              {option.title}
            </Text>
            <svg
            className="flex-shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <rect
                x="0.5"
                y="0.5"
                width="19"
                height="19"
                rx="3.5"
                fill={
                  selectedOptionIds.includes(option.custom_id)
                    ? "#0057FF"
                    : "white"
                }
                stroke="#0057FF"
              />
              <path
                d="M8.48392 13.6492C8.27048 13.6492 8.06772 13.5638 7.91831 13.4144L4.89813 10.3942C4.58864 10.0847 4.58864 9.57245 4.89813 9.26296C5.20762 8.95348 5.71988 8.95348 6.02936 9.26296L8.48392 11.7175L13.9693 6.23212C14.2788 5.92263 14.7911 5.92263 15.1006 6.23212C15.4101 6.5416 15.4101 7.05386 15.1006 7.36335L9.04954 13.4144C8.90013 13.5638 8.69736 13.6492 8.48392 13.6492Z"
                fill="white"
              />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MultiSelectCheckbox;
