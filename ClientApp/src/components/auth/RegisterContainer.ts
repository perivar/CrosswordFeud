import { connect } from 'react-redux';
import RegisterComponent from './RegisterComponent';

import { userActions } from './ducks/actions';
import { IUser } from './types';

function mapStateToProps(state: any) {
  const { registering } = state.registration;
  return {
    registering
  };
}

// inject methods *and* dispatch
const mapDispatchToProps = (dispatch: any) => {
  return {
    dispatch,
    register: (user: IUser) => dispatch(userActions.register(user))
  };
};

const RegisterContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterComponent);

export default RegisterContainer;
