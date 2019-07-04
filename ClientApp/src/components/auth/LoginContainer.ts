import { connect } from 'react-redux';
import LoginComponent from './LoginComponent';

import { userActions } from './ducks/actions';
import { IStoreState } from '../../state/store';

function mapStateToProps(state: IStoreState) {
  const { loggingIn } = state.authentication;
  return {
    loggingIn
  };
}

// inject methods *and* dispatch
const mapDispatchToProps = (dispatch: any) => {
  return {
    dispatch,
    login: (username: string, password: string) => dispatch(userActions.login(username, password)),
    logout: () => dispatch(userActions.logout())
  };
};

const LoginContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginComponent);

export default LoginContainer;
