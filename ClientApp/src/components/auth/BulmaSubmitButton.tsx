import React from 'react';

export interface BulmaSubmitButtonArguments {
  text: string;
  loading: boolean;
}

export function BulmaSubmitButton({ text, loading }: BulmaSubmitButtonArguments) {
  return (
    <>
      <div className="field">
        <div className="control">
          <button className={`button is-block is-info is-large is-fullwidth ${loading ? 'is-loading' : ''}`}>
            {text}
          </button>
        </div>
      </div>
    </>
  );
}
