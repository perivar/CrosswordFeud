import React, { PureComponent } from 'react';
import { NavMenu } from './NavMenu';

export class Layout extends PureComponent<any, any> {
  public render() {
    return (
      <>
        <section className="hero">
          <div className="hero-head">
            <NavMenu />
          </div>
          <div className="hero-body">
            <div className="container">
              <div>{this.props.children}</div>
            </div>
          </div>
          <div className="hero-foot">
            <div className="container" />
          </div>
        </section>
      </>
    );
  }
}
