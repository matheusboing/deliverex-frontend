import React, {useState} from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import SideDrawer from "../SideDrawer/SideDrawer";

export default function Header() {
  const [opened, setOpened] = useState(false)
  console.log("Renderizou header")
  return (
    <>
      <div className={{flexGrow: 1}}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              edge="start"
              style={{marginRight: 2}}
              color="inherit"
              aria-label="menu"
              onClick={()=>setOpened(true)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" style={{flexGrow: 1}}>
              Deliverex
            </Typography>
          </Toolbar>
        </AppBar>
      </div>
      <SideDrawer opened={opened} setOpened={setOpened}/>
    </>
  );
}
