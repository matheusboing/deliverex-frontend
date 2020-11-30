import React from 'react';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import api from '../../../api'

export default function PedidoDeleteDialog(props) {

    const handleClose = () => {
        props.setOpen(false)
    }

    const confirmarDelecao = () => {
        api.delete(`/pedidos/${props.pedido.id}`).then(() => props.setReload(true));
        handleClose();
    }

    return (
    <Dialog
      maxWidth="xs"
      aria-labelledby="confirmation-dialog-title"
      open={props.open}
      onClose={handleClose}
    >
      <DialogTitle id="confirmation-dialog-title">Confirme a exclusão</DialogTitle>
      <DialogContent dividers>
          Realmente deseja excluir o pedido #{props.pedido.id}?
      </DialogContent>
      <DialogActions>
        <Button autoFocus color="primary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button  color="primary" onClick={confirmarDelecao}>
          Excluir
        </Button>
      </DialogActions>
    </Dialog>
  );

}