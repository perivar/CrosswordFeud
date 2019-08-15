import React, { useEffect, useState, useCallback, useRef } from 'react';

interface ILetterBoxProps {
  // value: string;
  id: number;
  letterBoxRefs: React.MutableRefObject<HTMLInputElement[]>;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const LetterBox = (props: ILetterBoxProps) => {
  const { id, letterBoxRefs, handleKeyDown } = props;

  return (
    <p className="control">
      <input
        className="input is-uppercase letter-input"
        type="text"
        autoComplete="off"
        spellCheck={false}
        autoCorrect="off"
        id={`${id}`}
        name={`letter[${id}]`}
        maxLength={1}
        ref={el => (letterBoxRefs.current[id] = el!)}
        onKeyDown={handleKeyDown}
      />
    </p>
  );
};

// some useful methods
const range = (n: number) => Array.from({ length: n }, (value, key) => key);

const isNullOrWhitespace = (input: any): boolean => {
  if (typeof input === 'undefined' || input == null) return true;

  return input.replace(/\s/g, '').length < 1;
};

const getPatternString = (letterBoxRefs: HTMLInputElement[]): string => {
  let patternString = '';

  letterBoxRefs.forEach(element => {
    const value = element.value;
    if (isNullOrWhitespace(value)) {
      patternString += '_';
    } else {
      patternString += value;
    }
  });

  return patternString.toUpperCase();
};

interface LetterBoxesArguments {
  inputRef: React.RefObject<HTMLInputElement>;
}

const MAX_LETTERS = 30;
const LetterBoxes = (props: LetterBoxesArguments) => {
  const { inputRef } = props;

  const [letterCount, setLetterCount] = useState<number>(0);

  // create array and keep it between renders by useRef
  // you can access the elements with letterBoxRefs.current[n]
  const letterBoxRefs = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    letterBoxRefs.current = letterBoxRefs.current.slice(0, letterCount);
  }, [letterCount]);

  const updateHiddenPatternField = useCallback(
    (count?: number) => {
      let pattern = '';
      if (count === 0) {
        pattern = '';
      } else if (count) {
        pattern = '_'.repeat(count);
      } else {
        pattern = getPatternString(letterBoxRefs.current);
      }
      if (inputRef && inputRef.current) inputRef.current.value = pattern;
    },
    [inputRef]
  );

  const handleLetterCountChange = useCallback(
    (e: React.FocusEvent<HTMLSelectElement>) => {
      let count = Number(e.target.value);
      if (Number.isNaN(count)) count = 0;
      setLetterCount(count);
      updateHiddenPatternField(count);
    },
    [updateHiddenPatternField]
  );

  const handleReset = () => {
    setLetterCount(0);
    updateHiddenPatternField(0);
  };

  const handleLetterLess = () => {
    setLetterCount(letterCount => {
      const count = Math.max(letterCount - 1, 0);
      updateHiddenPatternField(count);
      return count;
    });
  };

  const handleLetterMore = () => {
    setLetterCount(letterCount => {
      const count = Math.min(letterCount + 1, MAX_LETTERS);
      updateHiddenPatternField(count);
      return count;
    });
  };

  // Event fired when the user presses a key down
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const keyCode = e.keyCode;
      const keyValue = e.key;
      const id = Number(e.currentTarget.id);
      if (keyCode === 37) {
        // left arrow = 37
        const previous = letterBoxRefs.current[id - 1];
        if (previous) previous.focus();
      } else if (keyCode === 9 || keyCode === 39) {
        // right arrow = 39
        // tab = 9
        const next = letterBoxRefs.current[id + 1];
        if (next) next.focus();
      } else if (keyCode === 8 || keyCode === 46) {
        // backspace = 8
        // delete = 46
        const current = letterBoxRefs.current[id];
        if (current) current.value = '';
        const previous = letterBoxRefs.current[id - 1];
        if (previous) previous.focus();
      } else if (
        (keyCode > 47 && keyCode < 58) || // number keys
        keyCode === 32 || // spacebar
        // keyCode === 13 || // return key(s)
        (keyCode > 64 && keyCode < 91) || // letter keys
        (keyCode > 95 && keyCode < 112) || // numpad keys
        (keyCode > 185 && keyCode < 193) || // ;=,-./` (in order)
        (keyCode > 218 && keyCode < 223) // [\]' (in order)
      ) {
        // alphanumeric
        const current = letterBoxRefs.current[id];
        if (current) current.value = keyValue;
        const next = letterBoxRefs.current[id + 1];
        if (next) next.focus();
      }

      updateHiddenPatternField();
    },
    [updateHiddenPatternField]
  );

  // create letterboxes array
  const letterBoxes: React.ReactNode[] = [];
  range(letterCount).forEach(i => {
    letterBoxes.push(
      <LetterBox key={`letter[${i}]`} id={i} letterBoxRefs={letterBoxRefs} handleKeyDown={handleKeyDown} />
    );
  });

  return (
    <>
      <input type="hidden" ref={inputRef} />
      {letterCount === 0 && (
        <div className="field">
          <label className="label" htmlFor="letter-count">
            Hvor mange bokstaver inneholder ordet?
            <div className="control">
              <div className="select">
                <select id="letter-count" onBlur={handleLetterCountChange} onChange={handleLetterCountChange}>
                  <option key="0">Vis alle</option>
                  {Array.from({ length: MAX_LETTERS }, (v, k) => {
                    const key = k + 1;
                    return <option key={key}>{key}</option>;
                  })}
                </select>
              </div>
            </div>
          </label>
        </div>
      )}
      {letterCount > 0 && (
        <>
          <strong>Skriv inn bokstavene du har ({letterCount} bokstaver)</strong>
          <div className="field has-addons">
            <p className="control">
              <button className="button" type="button" id="letterLess" onClick={handleLetterLess}>
                <i className="fas fa-chevron-left" />
              </button>
            </p>
            {letterBoxes}
            <p className="control">
              <button className="button" type="button" id="letterMore" onClick={handleLetterMore}>
                <i className="fas fa-chevron-right" />
              </button>
            </p>
          </div>
          <div className="field">
            <p className="help">Mønster eller antall bokstaver, se hjelp</p>
            <button type="button" className="button is-small is-info" onClick={handleReset}>
              Vis alle synonymer
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default LetterBoxes;
