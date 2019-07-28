import React, { PureComponent } from 'react';
import { Container } from 'reactstrap';
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
            <div className="container has-text-centered">
              <Container>{this.props.children}</Container>
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
