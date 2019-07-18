import { connect } from 'react-redux';
import ForgottenPasswordComponent from './ForgottenPasswordComponent';

function mapStateToProps() {
  return {};
}

// inject methods *and* dispatch
const mapDispatchToProps = (dispatch: any) => {
  return {
    dispatch
  };
};

const ForgottenPasswordContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ForgottenPasswordComponent);

export default ForgottenPasswordContainer;
