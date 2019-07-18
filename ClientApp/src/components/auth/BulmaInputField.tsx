import React from 'react';

export interface BulmaInputFieldArguments {
  label: string;
  type: 'text' | 'password' | 'email';
  name: string;
  placeholder: string;
  required: boolean;
  requiredMessage: string;
  value: string;
  submitted: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: JSX.Element;
}

export function BulmaInputField({
  label,
  type,
  name,
  placeholder,
  required,
  requiredMessage,
  submitted,
  value,
  handleChange,
  icon
}: BulmaInputFieldArguments) {
  if (icon === undefined) {
    icon = <i className="fas fa-smile"></i>;
  }
  return (
    <>
      <div className="field">
        <label className="label" htmlFor={name}>
          {label}
        </label>
        <div className={`control has-icons-left ${required && submitted && !value ? ' has-icons-right' : ' '}`}>
          <input
            type={type} // text, email or password
            className={`input ${required && submitted && !value ? ' is-danger' : ' '}`}
            name={name}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            // required
          />
          <span className="icon is-small is-left">{icon}</span>
          {required && submitted && !value ? (
            <span className="icon is-small is-right">
              <i className="fas fa-exclamation-triangle"></i>
            </span>
          ) : (
            ''
          )}
        </div>
        {required && submitted && !value ? <p className="help is-danger">{requiredMessage}</p> : ''}
      </div>
    </>
  );
}
