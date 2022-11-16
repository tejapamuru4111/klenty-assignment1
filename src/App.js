import {BrowserRouter, Switch, Redirect, Route} from 'react-router-dom'

import LoginForm from './components/LoginForm'
import RegistrationForm from './components/RegistrationForm'
import Home from './components/Home'
import NotFound from './components/NotFound'
import './App.css'

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/login" component={LoginForm} />
      <Route exact path="/register" component={RegistrationForm} />
      <Route exact path="/" component={Home} />
      <Route path="/bad-path" component={NotFound} />
      <Redirect to="/bad-path" />
    </Switch>
  </BrowserRouter>
)

export default App
