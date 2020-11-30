import React, {useState} from "react"
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props}/>;
}
export default function Notification(props) {

  return (
    <Snackbar
      open={props.open}
      autoHideDuration={6000}
      onClose={() => props.setOpen(false)}
    >
      <Alert onClose={() => props.setOpen(false)} severity={props.severity}>
        {props.message}
      </Alert>
    </Snackbar>
  );
}
