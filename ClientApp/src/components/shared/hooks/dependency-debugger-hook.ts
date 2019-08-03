import { useRef, useMemo } from 'react';

// https://stackoverflow.com/questions/55187563/determine-which-dependency-array-variable-caused-useeffect-hook-to-fire
// This can then be used by copying a dependency array literal and just changing it to be an object literal:
//
// useDependenciesDebugger({ state1, state2 });

const compareInputs = (inputKeys: any, oldInputs: any, newInputs: any) => {
  inputKeys.forEach((key: any) => {
    const oldInput = oldInputs[key];
    const newInput = newInputs[key];
    if (oldInput !== newInput) {
      console.log('change detected', key, 'old:', oldInput, 'new:', newInput);
    }
  });
};

export const useDependenciesDebugger = (inputs: any) => {
  const oldInputsRef = useRef(inputs);
  const inputValuesArray = Object.values(inputs);
  const inputKeysArray = Object.keys(inputs);

  useMemo(() => {
    const oldInputs = oldInputsRef.current;

    compareInputs(inputKeysArray, oldInputs, inputs);

    oldInputsRef.current = inputs;
  }, inputValuesArray); // eslint-disable-line react-hooks/exhaustive-deps
};
