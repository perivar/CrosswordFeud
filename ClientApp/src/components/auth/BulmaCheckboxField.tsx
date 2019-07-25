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
          <label className="checkbox">
            <input type="checkbox" name={name} onChange={handleChange} checked={checked} />
            {label}
          </label>
        </div>
      </div>
    </>
  );
};

export const BulmaCheckboxField = React.memo(CheckboxField);
