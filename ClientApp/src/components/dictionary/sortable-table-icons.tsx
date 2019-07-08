import React, { Component, CSSProperties } from 'react';

interface SortIconProps {
  style?: CSSProperties;
}

interface FaIconProps extends SortIconProps {
  icon: string;
}

class FaIcon extends Component<FaIconProps, any> {
  render() {
    const className = `fas ${this.props.icon}`;
    return <i className={className} style={this.props.style} />;
  }
}

export class SortIconBoth extends Component<SortIconProps, any> {
  render() {
    return <FaIcon icon="fa-sort" style={this.props.style} />;
  }
}

export class SortIconAsc extends Component<SortIconProps, any> {
  render() {
    return <FaIcon icon="fa-sort-down" style={this.props.style} />;
  }
}

export class SortIconDesc extends Component<SortIconProps, any> {
  render() {
    return <FaIcon icon="fa-sort-up" style={this.props.style} />;
  }
}
