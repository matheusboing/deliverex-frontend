import React, { useState, useEffect } from "react";
import {
  TableRow,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableCell,
  Paper,
  ButtonGroup,
  Button,
  LinearProgress,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import api from "../../../api";
import PedidoDialog from "../PedidoDialog/PedidoDialog";
import DeleteIcon from "@material-ui/icons/Delete";
import ConfirmacaoDialog from "../ConfirmacaoDialog/ConfirmacaoDialog"

export default function PedidosList() {
  const [pedidos, setPedidos] = useState([]);
  const [reloadPending, setReloadPending] = useState(false);
  const [pedidoSelecionado, setPedidoSelecionado] = useState({});
  const [openPedidoDialog, setOpenPedidoDialog] = useState(false);
  const [openPedidoDeleteDialog, setOpenPedidoDeleteDialog] = useState(false);
  const [reload, setReload] = useState(true);

  function criarPedido() {
    setPedidoSelecionado({});
    setOpenPedidoDialog(true);
  }

  function editarPedido(pedido) {
    setPedidoSelecionado(pedido);
    setOpenPedidoDialog(true);
  }

  function deletarPedido(pedido) {
    setPedidoSelecionado(pedido);
    setOpenPedidoDeleteDialog(true);
  }

  function acaoDeletarPedido() {
    api.delete(`/pedidos/${pedidoSelecionado.id}`).then(() => setReload(true));
  }

  useEffect(() => {
    if (reload) {
      setReloadPending(true);
      api.get(`/pedidos?carregarItens=true`).then((response) => {
        setPedidos(response.data);
        setReloadPending(false);
      });
      setReload(false);
    }
  }, [reload]);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3>Pedidos</h3>
        <div>
          <Button
            variant="contained"
            color="primary"
            disableElevation
            disabled={reloadPending}
            onClick={() => criarPedido()}
          >
            <AddIcon style={{ marginRight: 5 }} /> Novo pedido
          </Button>
        </div>
      </div>
      <TableContainer component={Paper}>
        {reloadPending && <LinearProgress />}
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Número</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Situação</TableCell>
              <TableCell>Preço</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pedidos.map((pedido) => (
              <TableRow key={pedido.id}>
                <TableCell>{pedido.id}</TableCell>
                <TableCell>{pedido.descricao}</TableCell>
                <TableCell>{pedido.situacao == "EmAnalise"? "Em análise" : pedido.situacao}</TableCell>
                <TableCell>$ {pedido.valorTotal}</TableCell>
                <TableCell>
                  <ButtonGroup
                    disableElevation
                    variant="outlined"
                    color="primary"
                    disabled={reloadPending}
                  >
                    <Button onClick={() => editarPedido(pedido)}>
                      Abrir pedido
                    </Button>
                  </ButtonGroup>
                </TableCell>
                <TableCell>
                    <Button color="secondary" variant="outlined" onClick={() => deletarPedido(pedido)}>
                      <DeleteIcon />
                    </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <PedidoDialog
        pedido={pedidoSelecionado}
        setPedido={setPedidoSelecionado}
        open={openPedidoDialog}
        setOpen={setOpenPedidoDialog}
        setReload={setReload}
      />
      <ConfirmacaoDialog
        setOpen={setOpenPedidoDeleteDialog}
        open={openPedidoDeleteDialog}
        titulo="Confirme a exclusão"
        mensagem={`Realmente deseja excluir o pedido #${pedidoSelecionado.id}?`}
        confirmar="Excluir"
        acaoConfirmacao={acaoDeletarPedido}
      />
    </>
  );
}
