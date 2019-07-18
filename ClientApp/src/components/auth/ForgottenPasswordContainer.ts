import { connect } from 'react-redux';
import ForgottenPasswordComponent from './ForgottenPasswordComponent';
import { IStoreState } from '../../state/store';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { IAuthState } from './types';
import { RouteComponentProps } from 'react-router-dom';

export interface ForgottenPasswordRouterProps {
  token: string; // This one is coming from the router
  username: string;
}

export interface ForgottenPasswordProps extends RouteComponentProps<ForgottenPasswordRouterProps> {
  authentication: IAuthState;
}

export interface ForgottenPasswordDispatchProps {}

const mapStateToProps = (state: IStoreState, ownProps: ForgottenPasswordProps): ForgottenPasswordProps => {
  const { authentication } = state;
  return {
    ...ownProps, // to make routes work, map state to props (add the properties after the spread)
    authentication
  };
};

// inject methods *and* dispatch
const mapDispatchToProps = (dispatch: ThunkDispatch<IStoreState, any, AnyAction>): ForgottenPasswordDispatchProps => {
  return {
    // dispatch
  };
};

const ForgottenPasswordContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ForgottenPasswordComponent);

export default ForgottenPasswordContainer;
