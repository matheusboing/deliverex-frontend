import React, { useState, useEffect } from "react";
import {
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Table,
  TableHead,
  Button,
  ButtonGroup,
  Paper,
  LinearProgress,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import ItemDialog from "../ItemDialog/ItemDialog";

import api from "../../../api";
import ItemDeleteDialog from "../ItemDeleteDialog/ItemDeleteDialog";

export default function Itens() {
  const [itens, setItens] = useState([]);
  const [reloadPending, setReloadPending] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState({});
  const [openItemDeleteDialog, setOpenItemDeleteDialog] = useState(false);
  const [openItemDialog, setOpenItemDialog] = useState(false);
  const [reload, setReload] = useState(false);

  function criarItem() {
    setItemSelecionado({});
    setOpenItemDialog(true);
  }

  function editarItem(item) {
    setItemSelecionado(item);
    setOpenItemDialog(true);
  }

  function deletarItem(item) {
    setItemSelecionado(item);
    setOpenItemDeleteDialog(true);
  } 

  useEffect(() => {
    if (itens.length == 0 || reload) {
      setReloadPending(true);
      api.get("/itens").then((response) => {
        setItens(response.data);
        setReloadPending(false);
      });

      setReload(false);
    }
  });
  
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3>Itens</h3>
        <div>
          <Button
            variant="contained"
            color="primary"
            disableElevation
            onClick={criarItem}
            disabled={reloadPending}
          >
            <AddIcon style={{ marginRight: 5 }} /> Novo item
          </Button>
        </div>
      </div>
      <TableContainer component={Paper}>
        {reloadPending  && <LinearProgress />}
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Código</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Preço</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {itens.map((item) => (
              <TableRow key={item.codigo}>
                <TableCell>{item.codigo}</TableCell>
                <TableCell>{item.descricao}</TableCell>
                <TableCell>$ {item.preco}</TableCell>
                <TableCell>
                  <ButtonGroup
                    disableElevation
                    variant="outlined"
                    color="primary"
                    disablesd={reloadPending}
                  >
                    <Button onClick={() => editarItem(item)}>
                      <EditIcon />
                    </Button>
                    <Button color="secondary" disabled={reloadPending} onClick={() => deletarItem(item)}>
                      <DeleteIcon />
                    </Button>
                  </ButtonGroup>        
                </TableCell>          
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ItemDialog
        item={itemSelecionado}
        setItem={setItemSelecionado}
        open={openItemDialog}
        setOpen={setOpenItemDialog}
        setReload={setReload}
      />
      <ItemDeleteDialog
        setOpen={setOpenItemDeleteDialog}
        open={openItemDeleteDialog}
        item={itemSelecionado}
        setReload={setReload}
      />
    </>
  );
}
