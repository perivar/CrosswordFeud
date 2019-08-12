import React, { useEffect, useState, useCallback, useRef } from 'react';

interface LetterBox {
  value: string;
  id: string;
}

interface State {
  letterBoxes: LetterBox[];
  selectedId: string;
}

// some useful methods
const isNullOrWhitespace = (input: any): boolean => {
  if (typeof input === 'undefined' || input == null) return true;

  return input.replace(/\s/g, '').length < 1;
};

const getPatternString = (itemsRef: React.MutableRefObject<HTMLInputElement[]>): string => {
  let patternString = '';
  let isEmptyPattern = true;

  itemsRef.current.forEach(element => {
    const value = element.value;
    if (isNullOrWhitespace(value)) {
      patternString += '_';
    } else {
      patternString += value;
      isEmptyPattern = false;
    }
  });

  return patternString.toUpperCase();
};

// const useLetterBox = () => {};

const LetterBoxes = () => {
  const [letterCount, setLetterCount] = useState<number>(0);

  // create array and keep it between renders by useRef
  // you can access the elements with itemsRef.current[n]
  const itemsRef = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    itemsRef.current = itemsRef.current.slice(0, letterCount);
  }, [letterCount]);

  const handleLetterCountChange = useCallback((e: React.FocusEvent<HTMLSelectElement>) => {
    let count = Number(e.target.value);
    if (Number.isNaN(count)) count = 0;
    setLetterCount(count);
  }, []);

  const handleReset = () => {
    setLetterCount(0);
  };

  const handleLetterLess = () => {
    setLetterCount(letterCount => letterCount - 1);
  };

  const handleLetterMore = () => {
    setLetterCount(letterCount => letterCount + 1);
  };

  // Event fired when the user presses a key down
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const kcode = e.keyCode;
    const value = e.key;
    const id = Number(e.currentTarget.id);
    if (kcode === 37) {
      // left arrow = 37
      const previous = itemsRef.current[id - 1];
      if (previous) previous.focus();
    } else if (kcode === 9 || kcode === 39) {
      // right arrow = 39
      // tab = 9
      const next = itemsRef.current[id + 1];
      if (next) next.focus();
    } else if (kcode === 8 || kcode === 46) {
      // backspace = 8
      // delete = 46
      const current = itemsRef.current[id];
      if (current) current.value = '';
      const previous = itemsRef.current[id - 1];
      if (previous) previous.focus();
    } else if (
      kcode === 32 ||
      (kcode > 47 && kcode < 58) ||
      (kcode > 64 && kcode < 91) ||
      (kcode > 96 && kcode < 123) ||
      (kcode > 191 && kcode < 223)
    ) {
      // space = 32
      // alphanumeric
      const current = itemsRef.current[id];
      if (current) current.value = value;
      const next = itemsRef.current[id + 1];
      if (next) next.focus();
    }

    // console.log('pattern: ' + getPatternString(itemsRef));
  }, []);

  return (
    <>
      {letterCount === 0 && (
        <div className="field">
          <label className="label" htmlFor="letter-count">
            Hvor mange bokstaver inneholder ordet?
            <div className="control">
              <div className="select">
                <select id="letter-count" onBlur={handleLetterCountChange} onChange={handleLetterCountChange}>
                  <option key="0">Vis alle</option>
                  <option key="1">1</option>
                  <option key="2">2</option>
                  <option key="3">3</option>
                  <option key="4">4</option>
                  <option key="5">5</option>
                  <option key="6">6</option>
                  <option key="7">7</option>
                  <option key="8">8</option>
                  <option key="9">9</option>
                  <option key="10">10</option>
                  <option key="11">11</option>
                  <option key="12">12</option>
                  <option key="13">13</option>
                  <option key="14">14</option>
                  <option key="15">15</option>
                  <option key="16">16</option>
                  <option key="17">17</option>
                  <option key="18">18</option>
                  <option key="19">19</option>
                  <option key="20">20</option>
                  <option key="21">21</option>
                  <option key="22">22</option>
                  <option key="23">23</option>
                  <option key="24">24</option>
                  <option key="25">25</option>
                  <option key="26">26</option>
                  <option key="27">27</option>
                  <option key="28">28</option>
                  <option key="29">29</option>
                  <option key="30">30</option>
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

            {[...Array(letterCount)].map((e, i) => {
              return (
                <p className="control" key={`letter[${i}]`}>
                  <input
                    className="input is-uppercase letter-input"
                    type="text"
                    autoComplete="off"
                    id={`${i}`}
                    name={`letter[${i}]`}
                    maxLength={1}
                    ref={el => (itemsRef.current[i] = el!)}
                    onKeyDown={handleKeyDown}
                  />
                </p>
              );
            })}
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
