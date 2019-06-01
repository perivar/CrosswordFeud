import React from 'react';
import { Link } from 'react-router-dom';
import { IHomeProps, IUser, IClaim } from "./types";
import { Button, ListGroup, ListGroupItem, Alert } from 'reactstrap';

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
                <h4>Hi {logon.user.userName}!</h4>
                <h5>Claims</h5>
                <ListGroup>
                    {logon.claims.map((claim: IClaim, index: number) =>
                        <ListGroupItem key={index}>{claim.value}</ListGroupItem>
                    )}
                </ListGroup>
                <div>&nbsp;</div>
                <h5>All registered users</h5>
                {users.loading && <em>Loading users...</em>}
                {users.items &&
                    <div>
                        <ListGroup>
                        {users.items.map((user: IUser, index: number) =>
                            <ListGroupItem>
                                <div><strong>Id:</strong> {user.id}</div>
                                <div><strong>Username:</strong> {user.userName}</div>
                                <div><strong>Email:</strong> {user.email}</div>
                                <div><strong>Phone Number:</strong> {user.phoneNumber}</div>
                                {
                                    user.deleting ? <em> - Deleting...</em>
                                        : user.deleteError ? <span className="error"> - ERROR: {user.deleteError}</span>
                                            : <Button color="primary" size="sm" onClick={this.handleDeleteUser(user.userName)}>Delete</Button>
                                }
                            </ListGroupItem>
                        )}
                        </ListGroup>
                    </div>
                }
                <div>&nbsp;</div>
                <Alert color="primary">
                    <Link to="/login">Logout</Link>
                </Alert>
            </div>
        );
    }
}
