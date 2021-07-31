import React, { Component } from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'
import './scss/style.scss'
import 'bootstrap/dist/css/bootstrap.min.css'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Page500 = React.lazy(() => import('./views/pages/recuperar/Recuperar'))

class App extends Component {
  render() {
    return (
      <HashRouter>
        <React.Suspense fallback={loading}>
          <Switch>
            <Route exact path="/" name="Login Page" render={(props) => <Login {...props} />} />
            <Route
              exact
              path="/recuperar"
              name="Page 500"
              render={(props) => <Page500 {...props} />}
            />
            <Route exact path="/500" name="Page 500" render={(props) => <Page500 {...props} />} />
            <Route path="/" name="Home" render={(props) => <DefaultLayout {...props} />} />
          </Switch>
        </React.Suspense>
      </HashRouter>
    )
  }
}

export default App
