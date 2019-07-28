import React from 'react';

export interface BulmaChexkboxFieldArguments {
  label: string;
  name: string;
  checked: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CheckboxField = ({ label, name, checked, handleChange }: BulmaChexkboxFieldArguments) => {
  return (
    <>
      <div className="field">
        <div className="control">
          <label htmlFor={name} className="checkbox">
            <input type="checkbox" id={name} name={name} onChange={handleChange} checked={checked} />
            {label}
          </label>
        </div>
      </div>
    </>
  );
};

export const BulmaCheckboxField = React.memo(CheckboxField);
