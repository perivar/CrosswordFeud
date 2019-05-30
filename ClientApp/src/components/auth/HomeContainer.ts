import { connect } from "react-redux";
import HomeComponent from "./HomeComponent";

import { IRootState } from "./types";
import { userActions } from "./ducks/actions";

const mapStateToProps = (state: IRootState) => {
    const { users, authentication } = state;
    const { user } = authentication;
    return {
        user,
        users
    };
}

// inject methods *and* dispatch
const mapDispatchToProps = (dispatch: any) => {
    return {
        dispatch,
        getUsers: () => dispatch(userActions.getAll()),
        delete: (id: number) => dispatch(userActions.delete(id))
    };
}

const HomeContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(HomeComponent);

export default HomeContainer; 