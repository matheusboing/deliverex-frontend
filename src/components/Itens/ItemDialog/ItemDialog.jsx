import React from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  InputAdornment,
} from "@material-ui/core";
import api from "../../../api";

export default function ItemDialog(props) {
  const salvarItem = () => {
    if (props.item.id) {
      api
        .put(`/itens/${props.item.id}`, props.item)
        .then(() => props.setReload(true));
    } else {
      api.post(`/itens`, props.item).then(() => props.setReload(true));
    }
    handleClose(true);
  };

  const handleClose = () => {
    props.setOpen(false);
  };

  const onChangeDescricao = (event) => {
    props.setItem({ ...props.item, descricao: event.target.value });
  };

  const onChangeCodigo = (event) => {
    if (event.target.value >= 0) {
      props.setItem({ ...props.item, codigo: event.target.value });
    } else {
      event.target.value = null;
    }
  };

  const onChangePreco = (event) => {
    if (event.target.value >= 0) {
      props.setItem({ ...props.item, preco: event.target.value });
    } else {
      event.target.value = null;
    }
  };

  return (
    <>
      <Dialog
        open={props.open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          {!props.item.id && "Novo item"}
          {props.item.id && "Editando item"}
        </DialogTitle>
        <DialogContent style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <TextField
              autoFocus
              margin="dense"
              id="codigo"
              label="Código"
              type="number"
              value={props.item.codigo}
              fullWidth
              style={{ marginRight: 10 }}
              onChange={onChangeCodigo}
              min="0"
            />
            <TextField
              autoFocus
              type="number"
              onChange={onChangePreco}
              value={props.item.preco}
              margin="dense"
              id="preco"
              label="Preço"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">R$</InputAdornment>
                )
              }}
              min="0"
              steps="0.01"
            />
          </div>
          <div>
            <TextField
              autoFocus
              margin="dense"
              id="descricao"
              label="Descrição"
              type="text"
              value={props.item.descricao}
              fullWidth
              onChange={onChangeDescricao}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={salvarItem} color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
