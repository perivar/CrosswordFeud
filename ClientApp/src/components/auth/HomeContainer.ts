import { connect } from "react-redux";
import HomeComponent from "./HomeComponent";

import { IRootState } from "./types";
import { userActions } from "./ducks/actions";

const mapStateToProps = (state: IRootState) => {
    const { users, authentication } = state;
    const { logon } = authentication;
    return {
        logon,
        users
    };
}

// inject methods *and* dispatch
const mapDispatchToProps = (dispatch: any) => {
    return {
        dispatch,
        getAll: () => dispatch(userActions.getAll()),
        delete: (username: string) => dispatch(userActions.delete(username))
    };
}

const HomeContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(HomeComponent);

export default HomeContainer; 