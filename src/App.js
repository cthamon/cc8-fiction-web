import "./App.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import CreateNovelPage from "./pages/CreateNovelPage";
import Home from "./pages/Home";
import HomeTest from "./pages/HomeTest";
import ReadNovel from "./pages/ReadNovel";
import Order from "./pages/Order";
import Login from "./pages/Login";
import ViewOrder from "./pages/ViewOrder";
import ViewOrderItem from "./pages/ViewOrderItem";
import Follow from "./pages/Follow";
import ReadHistory from "./pages/ReadHistory";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/createnovel" component={CreateNovelPage} />
        <Route exact path="/hometest" component={HomeTest} />
        <Route exact path="/read" component={ReadNovel} />
        <Route exact path="/login" component={Login} />
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
