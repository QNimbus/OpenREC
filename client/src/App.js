// Global imports
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// Action imports
import { loadUser } from './redux/actions';

// Component imports
import PrivateRoute from './components/routing/PrivateRoute';
import Modal from './components/layout/Modal';
import Navbar from './components/layout/Navbar';
import Eventlog from './components/dashboard/Eventlog';
import Eventlogs from './components/dashboard/Eventlogs';
import Filters from './components/dashboard/Filters';
import Landing from './components/layout/Landing';
import Alert from './components/layout/Alert';
import Register from './components/auth/Register';
import Login from './components/auth/Login';

// Redux imports
import { Provider } from 'react-redux';
import store from './redux';

// Import utility method
import setAuthToken from './utils/setAuthToken';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  return (
    <Provider store={store}>
      <Router>
        <div id='modal' className='modal hidden'>
          <Modal />
        </div>
        <div id='page' className='no-blur'>
          <Navbar />
          <Route exact path='/' component={Landing} />
          <section className='container'>
            <Alert />
            <Switch>
              <PrivateRoute exact path='/eventlogs' component={Eventlogs} />
              <PrivateRoute path='/eventlog/:id' component={Eventlog} />
              <PrivateRoute exact path='/filters' component={Filters} />
              <Route exact path='/register' component={Register} />
              <Route exact path='/login' component={Login} />
              <Route component={Landing} />
            </Switch>
          </section>
        </div>
      </Router>
    </Provider>
  );
};

export default App;
