import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

interface ILocalState {
  collapsed: boolean;
}

export class NavMenu extends Component<{}, ILocalState> {
  // ref variables
  private menu: React.RefObject<HTMLDivElement>;

  constructor(props: any) {
    super(props);

    this.state = {
      collapsed: true
    };

    this.menu = React.createRef();
  }

  handleNavBurgerToggle = () => {
    if (this.menu.current) {
      if (this.menu.current.classList.contains('is-active')) {
        this.menu.current.classList.remove('is-active');
        this.setState({
          collapsed: true
        });
      } else {
        this.menu.current.classList.add('is-active');
        this.setState({
          collapsed: false
        });
      }
    }
  };

  public render() {
    return (
      <>
        <nav className="navbar has-shadow">
          <div className="container">
            <div className="navbar-brand">
              <NavLink className="navbar-item" to="/">
                <h4 className="title is-4">CrosswordFeud.Web</h4>
              </NavLink>
              <button
                className="navbar-burger burger button is-white"
                aria-label="menu"
                aria-expanded="false"
                data-target="navbarBasic"
                onClick={this.handleNavBurgerToggle}>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
              </button>
            </div>

            <div id="navbarBasic" className="navbar-menu" ref={this.menu}>
              <div className="navbar-start">
                <NavLink className="navbar-item is-tab" to="/dictionary" activeClassName="is-active">
                  Dictionary
                </NavLink>
                <NavLink className="navbar-item is-tab" to="/counter" activeClassName="is-active">
                  Counter
                </NavLink>
                <NavLink className="navbar-item is-tab" to="/crossword" activeClassName="is-active">
                  Crossword
                </NavLink>
                <NavLink className="navbar-item is-tab" to="/forecast" activeClassName="is-active">
                  Forecast
                </NavLink>
              </div>
              <div className="navbar-end">
                <div className="navbar-item">
                  <div className="buttons">
                    <NavLink className="button is-info" to="/register" activeClassName="is-active">
                      <strong>Sign up</strong>
                    </NavLink>
                    <NavLink className="button is-light" to="/login" activeClassName="is-active">
                      Login
                    </NavLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </>
    );
  }
}
