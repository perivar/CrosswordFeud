import React from 'react';
import { Link } from 'react-router-dom';
import { IHomeProps, IUser } from "./types";

export default class HomeComponent extends React.Component<IHomeProps, any> {

    componentDidMount() {
        this.props.getUsers();
    }

    handleDeleteUser(id: number) {
        return () => this.props.delete(id);
    }

    render() {
        const { user, users } = this.props;
        return (
            <div className="col-md-6 col-md-offset-3">
                <h1>Hi {user.firstName}!</h1>
                <p>You're logged in with React!</p>
                <h3>All registered users:</h3>
                {users.loading && <em>Loading users...</em>}
                {users.items &&
                    <ul>
                        {users.items.map((user: IUser, index: number) =>
                            <li key={user.id}>
                                {user.firstName + ' ' + user.lastName}
                                {
                                    user.deleting ? <em> - Deleting...</em>
                                        : user.deleteError ? <span className="error"> - ERROR: {user.deleteError}</span>
                                            : <span> - <a onClick={this.handleDeleteUser(user.id)}>Delete</a></span>
                                }
                            </li>
                        )}
                    </ul>
                }
                <p>
                    <Link to="/login">Logout</Link>
                </p>
            </div>
        );
    }
}
