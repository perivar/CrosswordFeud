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
        <p className="title is-size-4">Hi {logon.user.username}!</p>

        <div className="panel">
          <p className="panel-heading">Claims</p>
          {logon.claims.map((claim: IClaim, index: number) => (
            <div className="panel-block" key={index}>
              <span className="panel-icon">
                <i className="fas fa-key" aria-hidden="true" />
              </span>
              {claim.value}
            </div>
          ))}
        </div>

        <p className="title is-size-4 has-text-dark">Users</p>
        {users.loading && (
          <>
            <p className="title is-5 has-text-success">Loading users...</p>
            <progress className="progress progress is-small is-dark" max="100" />
          </>
        )}

        {users.items && (
          <>
            {users.items.map((user: IUser, index: number) => (
              <article className="box" key={index}>
                <p className="title is-5">{user.username}</p>
                <div className="media">
                  <div className="media-left">
                    <span className="icon is-medium">
                      <i className="fas fa-user fa-2x" />
                    </span>
                  </div>
                  <div className="media-content">
                    <div className="content">
                      <div className="level">
                        <div className="level-left">
                          {user.email && (
                            <div className="level-item">
                              <span className="icon has-text-info">
                                <i className="fas fa-envelope" />
                              </span>
                              <p>{user.email}</p>
                            </div>
                          )}
                          {user.phonenumber && (
                            <div className="level-item">
                              <span className="icon has-text-info">
                                <i className="fa fa-phone" />
                              </span>
                              <p>{user.phonenumber}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="media-right">
                    {user.deleting ? (
                      <p className="has-text-info is-size-6">Deleting...</p>
                    ) : user.deleteError ? (
                      <p className="has-text-danger is-size-6">{user.deleteError}</p>
                    ) : (
                      <button
                        type="button"
                        className="button is-danger is-small"
                        onClick={event => this.handleDeleteUser(user.username, event)}>
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </>
        )}

        <div className="content has-text-centered">
          <Link className="button is-info" to="/login">
            Logout
          </Link>
        </div>
      </>
    );
  }
}
