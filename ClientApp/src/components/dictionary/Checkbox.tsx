import React, { ChangeEvent } from 'react';

interface CheckboxProps {
  name: string;
  label?: string;
  isSelected: boolean;
  onCheckboxChange: (changeEvent: ChangeEvent<HTMLInputElement>) => void;
}

const Checkbox: React.FunctionComponent<CheckboxProps> = ({ name, label, isSelected, onCheckboxChange }) => (
  <div className="form-check">
    <label htmlFor={name}>
      <input
        type="checkbox"
        name={name}
        id={name}
        checked={isSelected}
        onChange={onCheckboxChange}
        className="form-check-input"
      />
      {label}
    </label>
  </div>
);

export default Checkbox;
