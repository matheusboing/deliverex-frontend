import React from "react";
import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer
} from "@material-ui/core";

import {Link} from "react-router-dom" 
import ShoppingCart from "@material-ui/icons/ShoppingCart";
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import "./styles.css";

export default function SideDrawer(props) {
  const preventDefault = (event) => event.preventDefault();
  const list = (anchor) => (
    <div
      style={{ width: 250 }}
      role="presentation"
      onClick={() => props.setOpened(false)}>
      <List className="menu-nav">
        <Link to="/itens" color="inherit">
          <ListItem button key="Itens">
            <ListItemIcon>
              <ShoppingCart />
            </ListItemIcon>
            <ListItemText primary="Itens" />
          </ListItem>
        </Link>
        <Link to="/pedidos" color="inherit">
          <ListItem button key="Pedidos">
            <ListItemIcon>
              <ShoppingBasketIcon />
            </ListItemIcon>
            <ListItemText primary="Pedidos" />
          </ListItem>
        </Link>
      </List>
      <Divider />
    </div>
  );

  return (
    <div>
      <Drawer
        anchor={"left"}
        open={props.opened}
        onClose={() => props.setOpened(false)}
      >
        {list("left")}
      </Drawer>
    </div>
  );
}
