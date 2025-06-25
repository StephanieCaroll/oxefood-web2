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

export default function ListCliente() {
  const [lista, setLista] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [idRemover, setIdRemover] = useState();

  useEffect(() => {
    carregarLista();
  }, []);

  function confirmaRemover(id) {
    //Recebe o id do cliente
    setOpenModal(true); // Modifica a variavel open modal para true
    setIdRemover(id);
  }

  function carregarLista() {
    axios.get("http://localhost:8080/api/cliente").then((response) => {
      setLista(response.data);
    });
  }

  function formatarData(dataParam) {
    if (!dataParam) {
      return "";
    }

    let dia = "";
    let mes = "";
    let ano = "";

    if (Array.isArray(dataParam) && dataParam.length === 3) {
      ano = dataParam[0];
      mes = String(dataParam[1]).padStart(2, "0"); // Garante 2 dígitos
      dia = String(dataParam[2]).padStart(2, "0"); // Garante 2 dígitos
    } else if (typeof dataParam === "string" && dataParam.includes("-")) {
      const parts = dataParam.split("-");
      if (parts.length === 3) {
        ano = parts[0];
        mes = parts[1];
        dia = parts[2];
      }
    } else {
      console.warn(
        "Formato de data inesperado, retornando string original:",
        dataParam
      );
      return String(dataParam);
    }

    return `${dia}/${mes}/${ano}`;
  }

  // Nova função para formatar CPF
  function formatarCpf(cpfParam) {
    if (!cpfParam) {
      return "";
    }
    // Remove qualquer coisa que não seja dígito
    const cpfLimpo = String(cpfParam).replace(/\D/g, "");

    // Aplica a máscara se tiver 11 dígitos
    if (cpfLimpo.length === 11) {
      return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }
    return cpfLimpo; // Retorna sem máscara se não tiver 11 dígitos
  }

  // Nova função para formatar números de telefone (celular e fixo)
  function formatarTelefone(foneParam) {
    if (!foneParam) {
      return "";
    }
    // Remove qualquer coisa que não seja dígito
    const foneLimpo = String(foneParam).replace(/\D/g, "");

    // Formata o número baseado no comprimento
    if (foneLimpo.length === 11) {
      // Celular com DDD (XX) XXXXX-XXXX
      return foneLimpo.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    } else if (foneLimpo.length === 10) {
      // Fixo ou celular antigo com DDD (XX) XXXX-XXXX
      return foneLimpo.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    }
    return foneLimpo; // Retorna sem máscara se não corresponder a um formato conhecido
  }

  async function remover() {
    await axios
      .delete("http://localhost:8080/api/cliente/" + idRemover)
      .then((response) => {
        notifySuccess("Cliente removido com sucesso.");
        carregarLista(); // Recarrega a lista após a remoção
      })
      .catch((error) => {
        // console.log("Erro ao remover um cliente:", error);

        if (error.response.data.errors != undefined) {
          for (let i = 0; i < error.response.data.errors.length; i++) {
            notifyError(error.response.data.errors[i].defaultMessage);
          }
        } else {
          notifyError(error.response.data.message);
        }
        
      });
    setOpenModal(false);
  }

  return (
    <div>
      <MenuSistema tela={"cliente"} />
      <div style={{ marginTop: "3%" }}>
        <Container textAlign="justified">
          <h2> Cliente </h2>
          <Divider />

          <div style={{ marginTop: "4%" }}>
            <Button
              label="Novo"
              circular
              color="orange"
              icon="clipboard outline"
              floated="right"
              as={Link}
              to="/form-cliente"
            />
            <br />
            <br />
            <br />

            <Table color="orange" sortable celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Nome</Table.HeaderCell>
                  <Table.HeaderCell>CPF</Table.HeaderCell>
                  <Table.HeaderCell>Data de Nascimento</Table.HeaderCell>
                  <Table.HeaderCell>Fone Celular</Table.HeaderCell>
                  <Table.HeaderCell>Fone Fixo</Table.HeaderCell>
                  <Table.HeaderCell textAlign="center">Ações</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {lista.map((cliente) => (
                  <Table.Row key={cliente.id}>
                    <Table.Cell>{cliente.nome}</Table.Cell>
                    <Table.Cell>{formatarCpf(cliente.cpf)}</Table.Cell>{" "}
                    {/* CPF Formatado */}
                    <Table.Cell>
                      {formatarData(cliente.dataNascimento)}
                    </Table.Cell>
                    <Table.Cell>
                      {formatarTelefone(cliente.foneCelular)}
                    </Table.Cell>{" "}
                    {/* Celular Formatado */}
                    <Table.Cell>
                      {formatarTelefone(cliente.foneFixo)}
                    </Table.Cell>{" "}
                    {/* Fixo Formatado */}
                    <Table.Cell textAlign="center">
                      <Button
                        inverted
                        circular
                        color="green"
                        title="Clique aqui para editar os dados deste cliente"
                        icon
                      >
                        <Link
                          to={"/form-cliente"}
                          state={{ id: cliente.id }}
                          style={{ color: "green" }}
                        >
                          {" "}
                          <Icon name="edit" />{" "}
                        </Link>
                      </Button>
                      &nbsp;
                      <Button
                        inverted
                        circular
                        color="red"
                        title="Clique aqui para remover este cliente"
                        icon
                        onClick={(e) => confirmaRemover(cliente.id)}
                      >
                        <Icon name="trash" />
                      </Button>
                      <br></br>
                      <Button
                        inverted
                        circular
                        color="blue"
                        title="Clique aqui para ver os Endereços deste cliente"
                        icon
                      >
                        <Link
                          to={"/list-endereco"}
                          state={{ id: cliente.id }}
                          style={{ color: "blue" }}
                        >
                          {" "}
                          <Icon name="home" />{" "}
                        </Link>
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
          <Button color="green" inverted onClick={() => remover()}>
            <Icon name="checkmark" /> Sim
          </Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
}
