import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { Provider } from 'react-redux';
import configureStore from '../state/store';

const mockStore = configureStore();

describe('App', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <MemoryRouter>
        <Provider store={mockStore}>
          <App />
        </Provider>
      </MemoryRouter>,
      div
    );
  });
});
