import { connect } from 'react-redux';
import DictionaryComponent from './DictionaryComponent';

import { IStoreState } from '../../state/store';

const mapStateToProps = (state: IStoreState) => {
  return {};
};

const mapDispatchToProps = (dispatch: any) => {
  return {};
};

const DictionaryContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DictionaryComponent);

export default DictionaryContainer;
