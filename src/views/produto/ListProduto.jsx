import axios from "axios";
import { notifyError, notifySuccess } from "../../views/util/Util";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Container,
  Divider,
  Header,
  Icon,
  Modal,
  Table,
} from "semantic-ui-react";
import MenuSistema from "../../MenuSistema";

export default function ListProduto() {
  const [lista, setLista] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [idRemover, setIdRemover] = useState(null);

  useEffect(() => {
    carregarLista();
  }, []);

  function confirmaRemover(id) {
    if (id !== null && typeof id !== "undefined") {
      setOpenModal(true);
      setIdRemover(id);
    } else {
      console.error("Tentativa de remover produto com ID inválido:", id);
    }
  }

  function carregarLista() {
    axios
      .get("http://localhost:8080/api/produto")
      .then((response) => {
        const data = response.data.map((produto) => {
          if (produto.id === null || typeof produto.id === "undefined") {
            console.warn("Produto sem ID encontrado na lista:", produto);
          }
          return produto;
        });
        setLista(data);
      })
      .catch((error) => {
        // console.error("Erro ao carregar a lista de produtos:", error);

        if (error.response.data.errors !== undefined) {
          for (let i = 0; i < error.response.data.errors.length; i++) {
            notifyError(error.response.data.errors[i].defaultMessage);
          }
        } else {
          notifyError(error.response.data.message);
        }
        
      });
  }

  async function remover() {
    if (idRemover === null) {
      console.error("ID para remoção é inválido ou não foi definido.");
      setOpenModal(false);
      return;
    }

    try {
      await axios.delete("http://localhost:8080/api/produto/" + idRemover);
      notifySuccess("Produto removido com sucesso.");
      carregarLista();
    } catch (error) {
      // console.error('Erro ao remover um produto:', error);

      if (error.response.data.errors !== undefined) {
        for (let i = 0; i < error.response.data.errors.length; i++) {
          notifyError(error.response.data.errors[i].defaultMessage);
        }
      } else {
        notifyError(error.response.data.message);
      }
    } finally {
      setOpenModal(false);
      setIdRemover(null);
    }
  }

  function formatarValor(valor) {
    if (valor === null || valor === undefined) {
      return "R$ 0,00";
    }
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    }).format(valor);
  }

  return (
    <div>
      <MenuSistema tela={"produto"} />
      <div style={{ marginTop: "3%" }}>
        <Container textAlign="justified">
          <h2> Produto </h2>
          <Divider />

          <div style={{ marginTop: "4%" }}>
            <Button
              label="Novo"
              circular
              color="orange"
              icon="clipboard outline"
              floated="right"
              as={Link}
              to="/form-produto"
            />
            <br />
            <br />
            <br />

            <Table color="orange" sortable celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Codigo</Table.HeaderCell>
                  <Table.HeaderCell>Categoria</Table.HeaderCell>
                  <Table.HeaderCell>Título</Table.HeaderCell>
                  <Table.HeaderCell>Descrição</Table.HeaderCell>
                  <Table.HeaderCell>Valor Unitário</Table.HeaderCell>
                  <Table.HeaderCell>Tempo de Entrega Mínimo</Table.HeaderCell>
                  <Table.HeaderCell>Tempo de Entrega Máximo</Table.HeaderCell>
                  <Table.HeaderCell textAlign="center">Ações</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {lista.map((produto) => (
                  <Table.Row key={produto.id || `temp-${Math.random()}`}>
                    {" "}
                    {/* Fallback key */}
                    <Table.Cell>{produto.codigo}</Table.Cell>
                    <Table.Cell>
                      {produto.categoria ? produto.categoria.descricao : "N/A"}
                    </Table.Cell>
                    <Table.Cell>{produto.titulo}</Table.Cell>
                    <Table.Cell>{produto.descricao}</Table.Cell>
                    <Table.Cell>
                      {formatarValor(produto.valorUnitario)}
                    </Table.Cell>
                    <Table.Cell>{produto.tempoEntregaMinimo}</Table.Cell>
                    <Table.Cell>{produto.tempoEntregaMaximo}</Table.Cell>
                    <Table.Cell textAlign="center">
                      <Button
                        inverted
                        circular
                        color="green"
                        title="Clique aqui para editar os dados deste produto"
                        icon
                        as={produto.id ? Link : "span"} // Only link if product.id exists
                        to={produto.id ? "/form-produto" : undefined}
                        state={produto.id ? { id: produto.id } : undefined}
                        style={{
                          cursor: produto.id ? "pointer" : "not-allowed",
                        }}
                        disabled={!produto.id} // Disable if no ID
                      >
                        <Icon name="edit" />
                      </Button>{" "}
                      &nbsp;
                      <Button
                        inverted
                        circular
                        color="red"
                        title="Clique aqui para remover este produto"
                        icon
                        onClick={() => confirmaRemover(produto.id)}
                        disabled={!produto.id} // Disable if no ID
                      >
                        <Icon name="trash" />
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </Container>
      </div>

      <Modal
        basic
        onClose={() => setOpenModal(false)}
        onOpen={() => setOpenModal(true)}
        open={openModal}
      >
        <Header icon>
          <Icon name="trash" />
          <div style={{ marginTop: "5%" }}>
            {" "}
            Tem certeza que deseja remover esse registro?{" "}
          </div>
        </Header>
        <Modal.Actions>
          <Button
            basic
            color="red"
            inverted
            onClick={() => setOpenModal(false)}
          >
            <Icon name="remove" /> Não
          </Button>
          <Button color="green" inverted onClick={remover}>
            {" "}
            {/* Directly call remover */}
            <Icon name="checkmark" /> Sim
          </Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
}
