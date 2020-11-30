import React, {useState} from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Notification from "../../Notification/Notification"


import api from "../../../api";

export default function ItemDeleteDialog(props) {
  const [apiError, setApiError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const handleClose = () => {
    props.setOpen(false);
  };

  const deletarItem = () => {
    api
      .delete(`itens/${props.item.id}`)
      .then(() => props.setReload(true))
      .catch((error) => {
        setApiError(true)
        setErrorMessage(error.response.data.message)
      });
    handleClose();
  };

  return (
    <>
    <div>
      <Dialog
        open={props.open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirme a exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Você realmente deseja excluir o item '{props.item.descricao}'?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Não
          </Button>
          <Button onClick={deletarItem} color="primary" autoFocus>
            Sim
          </Button>
        </DialogActions>
      </Dialog>
    </div>
    <Notification open={apiError} setOpen={setApiError} severity="error" message={errorMessage}/>
    </>
  );
}
