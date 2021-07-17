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

import HomeTest from "./pages/HomeTest";
import ReadNovel from "./pages/ReadNovel";
import Order from "./pages/Order";
import ViewOrder from "./pages/ViewOrder";
import ViewOrderItem from "./pages/ViewOrderItem";
import Follow from "./pages/Follow";
import ReadHistory from "./pages/ReadHistory";

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

        <Route exact path="/hometest" component={HomeTest} />
        <Route exact path="/read" component={ReadNovel} />
        <Route exact path="/order" component={Order} />
        <Route exact path="/vieworder" component={ViewOrder} />
        <Route exact path="/vieworderitem" component={ViewOrderItem} />
        <Route exact path="/follow" component={Follow} />
        <Route exact path="/readhistory" component={ReadHistory} />
        <Route exact path="/" component={Home} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
