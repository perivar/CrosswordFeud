import React from 'react';
import { Link } from 'react-router-dom';
import { IHomeProps, IUser, IClaim } from './types';

export default class HomeComponent extends React.Component<IHomeProps> {
  componentDidMount() {
    this.props.getAll();
  }

  handleDeleteUser(username: string) {
    return () => this.props.delete(username);
  }

  render() {
    const { logon, users } = this.props;
    return (
      <div>
        <h3 className="is-size-3">Hi {logon.user.userName}!</h3>
        <section className="section">
          <h4 className="is-size-4">Claims</h4>
          <div className="columns is-centered">
            <div className="column is-narrow">
              <table className="table is-bordered">
                <tbody>
                  {logon.claims.map((claim: IClaim, index: number) => (
                    <tr key={index}>
                      <td>{claim.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="section">
          <h4 className="is-size-4">All registered users</h4>
          <div className="columns is-centered">
            <div className="column is-narrow">
              <table className="table is-bordered">
                <tbody>
                  {users.loading && (
                    <>
                      <tr>
                        <td>
                          <h3 className="title is-3 has-text-success">Loading users</h3>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <progress className="progress progress is-medium is-dark" max="100"></progress>
                        </td>
                      </tr>
                    </>
                  )}
                  {users.items && (
                    <>
                      <tr>
                        <th>Id</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Phone Number</th>
                        <th>Delete</th>
                      </tr>
                      {users.items.map((user: IUser, index: number) => (
                        <tr key={index}>
                          <td>{user.id}</td>
                          <td>{user.userName}</td>
                          <td>{user.email}</td>
                          <td>{user.phoneNumber}</td>
                          <td>
                            {user.deleting ? (
                              <span className="is-info">Deleting...</span>
                            ) : user.deleteError ? (
                              <span className="is-warning">{user.deleteError}</span>
                            ) : (
                              <button className="button is-danger" onClick={this.handleDeleteUser(user.userName)}>
                                Delete
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <Link className="button is-info is-medium" to="/login">
          Logout
        </Link>
      </div>
    );
  }
}
