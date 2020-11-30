import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Dashboard from "./components/Dashboard/Dashboard";
import ItensList from "./components/Itens/ItensList/ItensList";
import PedidosList from "./components/Pedidos/PedidosList/PedidosList";
import Header from "./components/Header/Header";
import Container from '@material-ui/core/Container';

export default function App() {
  return (
    <>
      <Router>
        <Header />
        <Container maxWidth="md">
          <Switch>
            <Route exact path="/">
              <Dashboard />
            </Route>
            <Route exact path="/itens">
              <ItensList />
            </Route>
            <Route exact path="/pedidos">
              <PedidosList />
            </Route>
          </Switch>
        </Container>
      </Router>
    </>
  );
}
