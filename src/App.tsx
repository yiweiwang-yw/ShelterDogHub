import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './components/Login/Login';
import DogSearchPage from './pages/DogSearchPage'; // Assuming you'll create this next

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/dog-search">
          <DogSearchPage />
        </Route>
        <Route path="/">
          <Login />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
