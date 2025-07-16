import { useState } from "react";

export default function useArray<T>(defaultValue: T[] = []) {
  const [array, setArray] = useState(defaultValue);

  function push(element: T) {
    const newArr = [...array, element];
    setArray(newArr);

    return newArr;
  }

  function update(index: number, newElement: T) {
    setArray((a) => [
      ...a.slice(0, index),
      newElement,
      ...a.slice(index + 1, a.length),
    ]);
  }

  function patch(index: number, patchedElement: Partial<T>) {
    const oldElement = array[index];
    update(index, { ...oldElement, ...patchedElement });
  }

  function remove(index: number) {
    const newArr = [
      ...array.slice(0, index),
      ...array.slice(index + 1, array.length),
    ];
    setArray(newArr);
    return newArr;
  }

  function clear() {
    setArray([]);
  }

  return { array, set: setArray, push, update, remove, clear, patch };
}
