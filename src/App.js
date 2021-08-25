import "./App.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyNovel from "./pages/MyNovel";
import CreateNovel from "./pages/CreateNovel";
import EditNovel from "./pages/EditNovel";
import Episode from "./pages/Episode";
import CreateEpisode from "./pages/CreateEpisode";
import EditEpisode from "./pages/EditEpisode";
import Read from "./pages/Read";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Follow from "./pages/Follow";
import History from "./pages/History";

import Order from "./pages/Order";
import ViewOrder from "./pages/ViewOrder";
import ViewOrderItem from "./pages/ViewOrderItem";

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

        <Route exact path="/order" component={Order} />
        <Route exact path="/vieworder" component={ViewOrder} />
        <Route exact path="/vieworderitem" component={ViewOrderItem} />

        <Route exact path="/" component={Home} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
