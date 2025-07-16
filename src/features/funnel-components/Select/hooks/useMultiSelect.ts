import { MultiSelectOptionType } from "../types";
import useArray from "./useArray";

export const useMultiSelect = <T extends MultiSelectOptionType>({
  options,
  onOptionsChange,
}: {
  options: T[];
  onOptionsChange?: (options: T[]) => void;
}) => {
  const { array: selectedOptions, remove, push } = useArray<T>();

  const isSelected = (element: T) => {
    const index = selectedOptions.findIndex(
      (arrElement) => arrElement.id === element.id
    );
    return index > -1;
  };
  const toggle = (element: T) => {
    const index = selectedOptions.findIndex(
      (arrElement) => arrElement.id === element.id
    );
    const updatedArr = index > -1 ? remove(index) : push(element);
    onOptionsChange?.(updatedArr);
  };
  const hasAnySelection = () => {
    return Boolean(selectedOptions.length);
  };
  return { options, isSelected, toggle, hasAnySelection };
};
