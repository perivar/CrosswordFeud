import React from 'react';
import { Link } from 'react-router-dom';
import { IHomeProps, IClaim, IUser } from './types';

export default class HomeComponent extends React.Component<IHomeProps> {
  componentDidMount() {
    this.props.getAll();
  }

  handleDeleteUser = (username: string, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    // event.persist(); // this stores parameters like id and value inside the event.target
    this.props.delete(username);
  };

  render() {
    const { logon, users } = this.props;
    return (
      <>
        <h4 className="title is-size-4 has-text-dark">Hi {logon.user.username}!</h4>

        <h4 className="title is-size-4 has-text-dark">Claims</h4>
        <div className="list">
          {logon.claims.map((claim: IClaim, index: number) => (
            <div className="list-item" key={index}>
              <span className="icon">
                <i className="fas fa-key" aria-hidden="true" />
              </span>
              {claim.value}
            </div>
          ))}
        </div>

        <h4 className="title is-size-4 has-text-dark">Users</h4>
        {users.loading && (
          <>
            <p className="title is-5 has-text-success">Loading users...</p>
            <progress className="progress progress is-small is-dark" max="100" />
          </>
        )}

        {users.items && (
          <>
            <div className="list">
              <div className="columns is-multiline">
                {users.items.map((user: IUser, index: number) => (
                  <div
                    className={
                      index % 2
                        ? 'list-item column is-5-tablet is-10-mobile is-offset-1-mobile'
                        : 'list-item column is-5-tablet is-offset-1-tablet is-10-mobile is-offset-1-mobile'
                    }
                    key={index}>
                    <article className="media">
                      <figure className="media-left">
                        <span className="icon is-medium">
                          <i className="fas fa-user fa-2x" />
                        </span>
                      </figure>
                      <div className="media-content">
                        <div className="content">
                          <h5 className="title is-5">{user.username}</h5>
                          <div className="level">
                            {user.email && (
                              <div className="level-left">
                                <div className="level-item">
                                  <span className="icon has-text-info">
                                    <i className="fas fa-envelope" />
                                  </span>
                                  <p>{user.email}</p>
                                </div>
                              </div>
                            )}
                            {user.phonenumber && (
                              <div className="level-right">
                                <div className="level-item">
                                  <span className="icon has-text-info">
                                    <i className="fa fa-phone" />
                                  </span>
                                  <p>{user.phonenumber}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
                    <div className="columns is-centered mt-10">
                      <div className="column">
                        <div className="buttons is-centered">
                          {user.deleting ? (
                            <h6 className="has-text-info is-size-6">Deleting...</h6>
                          ) : user.deleteError ? (
                            <h6 className="has-text-danger is-size-6">{user.deleteError}</h6>
                          ) : (
                            <button
                              type="button"
                              className="button is-danger is-outlined"
                              onClick={event => this.handleDeleteUser(user.username, event)}>
                              <span className="icon is-small">
                                <i className="fas fa-times" />
                              </span>
                              <span>Delete</span>
                            </button>
                          )}
                          <button type="button" className="button is-outlined">
                            <span className="icon is-small">
                              <i className="fas fa-user-circle" />
                            </span>
                            <span>View Profile</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="list-item content has-text-centered">
          <Link className="button is-info" to="/login">
            Logout
          </Link>
        </div>
      </>
    );
  }
}
