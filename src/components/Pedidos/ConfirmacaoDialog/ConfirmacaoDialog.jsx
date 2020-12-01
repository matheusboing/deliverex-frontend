import React from 'react';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';

export default function ConfirmacaoDialog(props) {

    const handleClose = () => {
        props.setOpen(false)
    }

    const executar = () => {
      props.acaoConfirmacao();
      handleClose();
    }

    return (
    <Dialog
      maxWidth="xs"
      aria-labelledby="confirmation-dialog-title"
      open={props.open}
      onClose={handleClose}
    >
      <DialogTitle id="confirmation-dialog-title">{props.titulo ?? "Confirme a ação"}</DialogTitle>
      <DialogContent dividers>
          {props.mensagem}
      </DialogContent>
      <DialogActions>
        <Button autoFocus color="primary" onClick={handleClose}>
          {props.cancelar ?? "Cancelar"}
        </Button>
        <Button  color="primary" onClick={executar}>
          {props.confirmar ?? "Confirmar"}
        </Button>
      </DialogActions>
    </Dialog>
  );

}