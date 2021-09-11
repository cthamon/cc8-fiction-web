import "./App.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Home, Login, Register, MyNovel, CreateNovel, EditNovel, Episode, CreateEpisode, EditEpisode, Read, Profile, EditProfile, Follow, History, Checkout, OrderHistory } from './pages';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/m" component={MyNovel} />
        <Route exact path="/w" component={CreateNovel} />
        <Route exact path="/editn" component={EditNovel} />
        <Route exact path="/ninfo" component={Episode} />
        <Route exact path="/ep" component={CreateEpisode} />
        <Route exact path="/editep" component={EditEpisode} />
        <Route exact path="/read" component={Read} />
        <Route exact path="/follow" component={Follow} />
        <Route exact path="/profile" component={Profile} />
        <Route exact path="/editprofile" component={EditProfile} />
        <Route exact path="/history" component={History} />
        <Route exact path="/checkout" component={Checkout} />
        <Route exact path="/orderhistory" component={OrderHistory} />
        <Route exact path="/" component={Home} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
