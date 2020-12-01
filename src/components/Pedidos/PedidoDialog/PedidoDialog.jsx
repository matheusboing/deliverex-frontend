import React, { useEffect, useState } from "react";
import {
  TableRow,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableCell,
  Paper,
  LinearProgress,
  Snackbar,
  Slide,
  IconButton,
  Toolbar,
  AppBar,
  Typography,
  ButtonGroup,
  Button,
  makeStyles,
  Container,
  InputAdornment,
  Dialog,
  TextField,
  Chip,
} from "@material-ui/core";
import api from "../../../api";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import MuiAlert from "@material-ui/lab/Alert";
import ConfirmacaoDialog from "../ConfirmacaoDialog/ConfirmacaoDialog"

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function PedidoDialog(props) {
  const classes = useStyles();
  const [itemAlterado, setItemAlterado] = useState(false);
  const [itens, setItens] = useState([]);
  const [reloadPending, setReloadPending] = useState(false);
  const [codigo, setCodigo] = useState(0);
  const [erroCodigo, setErroCodigo] = useState("");
  const [erroDescricao, setErroDescricao] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [valorTotal, setValorTotal] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [totalDesconto, setTotalDesconto] = useState(0);
  const [descricao, setDescricao] = useState("");
  const [openCancelamentoDialog, setOpenCancelamentoDialog] = useState(false);
  const [openAprovacaoDialog, setOpenAprovacaoDialog] = useState(false);

  
  const onCodigoChange = (event) => {
    setCodigo(event.target.value);
    setErroCodigo(null);
  };

  const onQuantidadeChange = (event, item) => {
    item.quantidade =
      event.target.value == 0 ? 1 : +event.target.value.replace(",", ".");
    item.valorTotal = item.quantidade * item.preco - item.desconto;
    setItemAlterado(!itemAlterado);
    if (item.desconto > item.preco * item.quantidade) {
      item.erroDesconto = "Desconto não pode ser maior que valor total.";
      return;
    }

    item.erroDesconto = null;
    calcularValores(itens);
  };

  const onDescricaoChange = (event) => {
    if (event.target.value == "") {
      setErroDescricao("Descrição obrigatória");
    } else {
      setErroDescricao(null);
    }
    setDescricao(event.target.value);
  };

  const onDescontoChange = (event, item) => {
    if (event.target.value > item.preco * item.quantidade) {
      item.erroDesconto = "Desconto não pode ser maior que valor total.";
    } else {
      item.erroDesconto = null;
    }

    item.desconto = event.target.value == 0 ? 0 : +event.target.value;
    item.valorTotal = item.quantidade * item.preco - item.desconto;
    setItemAlterado(!itemAlterado);
    calcularValores(itens);
  };

  const salvarPedido = () => {
    if (!descricao || descricao == "") {
      setErroDescricao("Descrição obrigatória");
      return;
    }

    if (itens.find((i) => i.erroDesconto) || erroDescricao) {
      return;
    }

    props.pedido.itens = itens;
    props.pedido.descricao = descricao;

    if (props.pedido.id) {
      api
        .put(`/pedidos/${props.pedido.id}`, props.pedido)
        .then(() => props.setReload(true));
    } else {
      api.post(`/pedidos`, props.pedido).then(() => props.setReload(true));
    }
    handleClose();
  };

  const alterarStatus = (situacao) => {
    api
      .patch(`/pedidos/${props.pedido.id}`, { id: props.pedido.id, situacao })
      .then(() => {
        props.setPedido({ ...props.pedido, situacao });
        props.setReload(true);
      });
  };
  const deletarItem = (item) => {
    if (itens.length == 1) {
      setOpenSnackBar(true);
      return;
    }

    itens.splice(
      itens.findIndex((i) => i.codigo === item.codigo),
      1
    );
    setItemAlterado(!itemAlterado);
    calcularValores(itens);
    
  };

  const adicionarItem = () => {
    const contemItem = itens.find((item) => item.codigo == codigo);

    if (contemItem) {
      setErroCodigo("Esse item já foi inserido");
      return;
    }

    if (codigo <= 0) {
      return;
    }

    setReloadPending(true);

    api
      .get(`/itens/codigo/${codigo}`)
      .then((response) => {
        response.data.quantidade = 1;
        response.data.desconto = 0;
        response.data.valorTotal =
          response.data.quantidade * response.data.preco;
        setItens([...itens, response.data]);
        calcularValores([...itens, response.data]);
      })
      .catch((err) => {
        if (err.response.status === 404) {
          setErroCodigo("Esse item não existe");
        }
      })
      .finally(() => setReloadPending(false));
  };

  const handleClose = () => {
    props.setOpen(false);
  };

  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackBar(false);
  };

  const calcularValores = (itens) => {
    let subTotalItens = 0;
    let totalDescontoItens = 0;
    let valorTotalItens = 0;

    for (let item of itens) {
      subTotalItens += item.quantidade * item.preco;
      totalDescontoItens += item.desconto;
      valorTotalItens += item.valorTotal;
    }

    setSubTotal(+subTotalItens);
    setTotalDesconto(+totalDescontoItens);
    setValorTotal(+valorTotalItens);
  };

  useEffect(() => {
    if (props.pedido.id) {
      setReloadPending(true);

      api
        .get(`/pedidos/${props.pedido.id}?carregarItens=true`)
        .then((response) => {
          setItens(response.data.itens);
          setDescricao(response.data.descricao);
          calcularValores(response.data.itens);
          setReloadPending(false);
        });
    } else {
      props.pedido.situacao != "EmAnalise" &&
        props.setPedido({ ...props.pedido, situacao: "EmAnalise" });
      setItens([]);
      calcularValores([]);
      setDescricao("");
    }
  }, [props.pedido]);

  return (
    <>
      <div>
        <Dialog
          fullScreen
          open={props.open}
          onClose={handleClose}
          TransitionComponent={Transition}
        >
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex" }}>
                  <Typography
                    variant="h6"
                    className={classes.title}
                    style={{ marginRight: "20px" }}
                  >
                    Pedido #{props.pedido.id}
                  </Typography>
                  {props.pedido.id && (
                    <Chip
                      label={
                        props.pedido.situacao == "EmAnalise"
                          ? "Em análise"
                          : props.pedido.situacao
                      }
                    />
                  )}
                </div>
                <div style={{ display: "flex" }}>
                  {props.pedido.id && (
                    <>
                      <Button
                        disabled={
                          reloadPending || props.pedido.situacao == "Cancelado"
                        }
                        autoFocus
                        variant="contained"
                        color="secondary"
                        onClick={() => setOpenCancelamentoDialog(true)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        disabled={
                          reloadPending || props.pedido.situacao == "Aprovado"
                        }
                        autoFocus
                        variant="contained"
                        color="default"
                        onClick={salvarPedido}
                        className="success"
                        style={{ marginLeft: "15px" }}
                        onClick={() => setOpenAprovacaoDialog(true)}
                      >
                        Aprovar
                      </Button>
                    </>
                  )}
                  <Button
                    autoFocus
                    color="inherit"
                    onClick={salvarPedido}
                    style={{ marginLeft: "20px" }}
                  >
                    Salvar
                  </Button>
                </div>
              </div>
            </Toolbar>
          </AppBar>
          <Container
            maxWidth="lg"
            style={{
              marginTop: "1em",
              marginBottom: "1em",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <TextField
              disabled={reloadPending || props.pedido.situacao != "EmAnalise"}
              label="Descrição do pedido"
              error={erroDescricao}
              helperText={erroDescricao}
              onChange={onDescricaoChange}
              style={{ width: "60%" }}
              value={descricao}
            ></TextField>
            <TextField
              disabled={reloadPending || props.pedido.situacao != "EmAnalise"}
              error={erroCodigo}
              helperText={erroCodigo}
              label="Código do item"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      onClick={adicionarItem}
                      disabled={
                        reloadPending || props.pedido.situacao != "EmAnalise"
                      }
                    >
                      Adicionar
                    </Button>
                  </InputAdornment>
                ),
              }}
              onChange={onCodigoChange}
            ></TextField>
          </Container>
          <TableContainer component={Paper}>
            {reloadPending && <LinearProgress />}
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Código</TableCell>
                  <TableCell>Descrição</TableCell>
                  <TableCell align="right">Preço unitário</TableCell>
                  <TableCell align="right">Quantidade</TableCell>
                  <TableCell align="right">Desconto</TableCell>
                  <TableCell align="right">Valor total</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {itens.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.codigo}</TableCell>
                    <TableCell>{item.descricao}</TableCell>
                    <TableCell align="right">
                      $ {item.preco.toFixed(2)}
                    </TableCell>
                    <TableCell align="right">
                      <TextField
                        disabled={
                          reloadPending || props.pedido.situacao != "EmAnalise"
                        }
                        inputProps={{ style: { textAlign: "right" } }}
                        value={item.quantidade}
                        onChange={(event) => onQuantidadeChange(event, item)}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <TextField
                        disabled={
                          reloadPending || props.pedido.situacao != "EmAnalise"
                        }
                        inputProps={{ style: { textAlign: "right" } }}
                        value={item.desconto}
                        error={item.erroDesconto}
                        helperText={item.erroDesconto}
                        onChange={(event) => onDescontoChange(event, item)}
                      />
                    </TableCell>
                    <TableCell align="right">
                      $ {item.valorTotal.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <ButtonGroup>
                        <Button
                          disabled={
                            reloadPending ||
                            props.pedido.situacao != "EmAnalise"
                          }
                          color="secondary"
                          onClick={() => deletarItem(item)}
                        >
                          <DeleteIcon />
                        </Button>
                      </ButtonGroup>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>SubTotal</TableCell>
                  <TableCell style={{ fontWeight: "bold" }} align="right">
                    $ {subTotal.toFixed(2)}
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Desconto</TableCell>
                  <TableCell style={{ fontWeight: "bold" }} align="right">
                    $ {totalDesconto.toFixed(2)}
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Total</TableCell>
                  <TableCell style={{ fontWeight: "bold" }} align="right">
                    $ {valorTotal.toFixed(2)}
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Dialog>
      </div>
      <Snackbar
        open={openSnackBar}
        autoHideDuration={6000}
        onClose={handleCloseSnackBar}
      >
        <Alert onClose={handleCloseSnackBar} severity="error">
          O pedido deve ter no mínimo um item
        </Alert>
      </Snackbar>
      <ConfirmacaoDialog
      setOpen={setOpenAprovacaoDialog}
      open={openAprovacaoDialog}
      titulo="Confirme a aprovação"
      mensagem={`Realmente deseja aprovar o pedido #${props.pedido.id}?`}
      acaoConfirmacao={() => alterarStatus("Aprovado")}
      confirmar="Sim"
      cancelar="Não"
    />
    <ConfirmacaoDialog
        setOpen={setOpenCancelamentoDialog}
        open={openCancelamentoDialog}
        titulo="Confirme o cancelamento"
        mensagem={`Realmente deseja cancelar o pedido #${props.pedido.id}?`}
        confirmar="Sim"
        cancelar="Não"
        acaoConfirmacao={() => alterarStatus("Cancelado")}
      />
    </>
  );
}
