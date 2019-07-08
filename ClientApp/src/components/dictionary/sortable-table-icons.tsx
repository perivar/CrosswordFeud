import React, { CSSProperties, FunctionComponent } from 'react';

interface SortIconProps {
  style?: CSSProperties;
}

interface FaIconProps extends SortIconProps {
  icon: string;
}

const FaIcon: FunctionComponent<FaIconProps> = props => {
  const className = `fas ${props.icon}`;
  return <i className={className} style={props.style} />;
};

export const SortIconBoth: FunctionComponent<SortIconProps> = props => {
  return <FaIcon icon="fa-sort" style={props.style} />;
};

export const SortIconAsc: FunctionComponent<SortIconProps> = props => {
  return <FaIcon icon="fa-sort-down" style={props.style} />;
};

export const SortIconDesc: FunctionComponent<SortIconProps> = props => {
  return <FaIcon icon="fa-sort-up" style={props.style} />;
};
