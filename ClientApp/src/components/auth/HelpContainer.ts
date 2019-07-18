import { connect } from 'react-redux';
import HelpComponent from './HelpComponent';

function mapStateToProps() {
  return {};
}

// inject methods *and* dispatch
const mapDispatchToProps = (dispatch: any) => {
  return {
    dispatch
  };
};

const HelpContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(HelpComponent);

export default HelpContainer;
