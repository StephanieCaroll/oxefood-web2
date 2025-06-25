import axios from "axios";
import { notifyError, notifySuccess } from "../../views/util/Util";
import { useEffect, useState } from "react";
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

export default function ListEntregador() {
  const [lista, setLista] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [idRemover, setIdRemover] = useState();

  const [openAddressModal, setOpenAddressModal] = useState(false);
  const [entregadorEndereco, setEntregadorEndereco] = useState(null);

  useEffect(() => {
    carregarLista();
  }, []);

  function confirmaRemover(id) {
    setOpenModal(true);
    setIdRemover(id);
  }

  function carregarLista() {
    axios
      .get("http://localhost:8080/api/entregador")
      .then((response) => {
        setLista(response.data);
      })
      .catch((error) => {
        // console.error("Erro ao carregar a lista de entregadores:", error);

        if (error.response.data.errors != undefined) {
          for (let i = 0; i < error.response.data.errors.length; i++) {
            notifyError(error.response.data.errors[i].defaultMessage);
          }
        } else {
          notifyError(error.response.data.message);
        }
      });
  }

  function formatarData(dataParam) {
    if (!dataParam) return "";

    let arrayData = dataParam.split("-");
    return `${arrayData[2]}/${arrayData[1]}/${arrayData[0]}`;
  }

  async function remover() {
    try {
      await axios.delete("http://localhost:8080/api/entregador/" + idRemover);
      notifySuccess("Entregador removido com sucesso.");
      carregarLista();
      setOpenModal(false);
    } catch (error) {
      //   console.error("Erro ao remover um entregador:", error);

      if (error.response.data.errors != undefined) {
        for (let i = 0; i < error.response.data.errors.length; i++) {
          notifyError(error.response.data.errors[i].defaultMessage);
        }
      } else {
        notifyError(error.response.data.message);
      }
      
    }
  }

  function showAddressModal(entregador) {
    setEntregadorEndereco(entregador);
    setOpenAddressModal(true);
  }

  return (
    <div>
      <MenuSistema tela={"entregador"} />
      <div style={{ marginTop: "3%" }}>
        <Container textAlign="justified">
          <h2>Entregador</h2>
          <Divider />

          <div style={{ marginTop: "4%" }}>
            <Button
              label="Novo"
              circular
              color="orange"
              icon="clipboard outline"
              floated="right"
              as={Link}
              to="/form-entregador"
            />
            <br />
            <br />
            <br />

            <Table color="orange" sortable celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Nome</Table.HeaderCell>
                  <Table.HeaderCell>CPF</Table.HeaderCell>
                  <Table.HeaderCell>RG</Table.HeaderCell>
                  <Table.HeaderCell>Data de Nascimento</Table.HeaderCell>
                  <Table.HeaderCell>Fone Celular</Table.HeaderCell>
                  <Table.HeaderCell>Fone Fixo</Table.HeaderCell>
                  <Table.HeaderCell>
                    Quantidade de Entregas Realizadas
                  </Table.HeaderCell>
                  <Table.HeaderCell>Valor Frete</Table.HeaderCell>
                  <Table.HeaderCell textAlign="center">Ações</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {lista.map((entregador) => (
                  <Table.Row key={entregador.id}>
                    <Table.Cell>{entregador.nome}</Table.Cell>
                    <Table.Cell>{entregador.cpf}</Table.Cell>
                    <Table.Cell>{entregador.rg}</Table.Cell>
                    <Table.Cell>
                      {formatarData(entregador.dataNascimento)}
                    </Table.Cell>
                    <Table.Cell>{entregador.foneCelular}</Table.Cell>
                    <Table.Cell>{entregador.foneFixo}</Table.Cell>
                    <Table.Cell>{entregador.qtdEntregasRealizadas}</Table.Cell>
                    <Table.Cell>{entregador.valorFrete}</Table.Cell>
                    <Table.Cell textAlign="center">
                      <Button
                        inverted
                        circular
                        color="green"
                        title="Clique aqui para editar os dados deste entregador"
                        icon
                        as={Link}
                        to="/form-entregador"
                        state={{ id: entregador.id }}
                      >
                        <Icon name="edit" />
                      </Button>
                      &nbsp;
                      <Button
                        inverted
                        circular
                        color="blue"
                        title="Clique aqui para ver o endereço do entregador"
                        icon
                        onClick={() => showAddressModal(entregador)}
                      >
                        <Icon name="map marker alternate" />
                      </Button>
                      &nbsp;
                      <Button
                        inverted
                        circular
                        color="red"
                        title="Clique aqui para remover este entregador"
                        icon
                        onClick={(e) => confirmaRemover(entregador.id)}
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
          <Button color="green" inverted onClick={() => remover()}>
            <Icon name="checkmark" /> Sim
          </Button>
        </Modal.Actions>
      </Modal>

      <Modal
        onClose={() => setOpenAddressModal(false)}
        onOpen={() => setOpenAddressModal(true)}
        open={openAddressModal}
        size="small"
      >
        <Header
          icon="map marker alternate"
          content={
            entregadorEndereco
              ? `Endereço de ${entregadorEndereco.nome} (ID: ${entregadorEndereco.id})`
              : "Endereço do Entregador"
          }
        />
        <Modal.Content>
          {entregadorEndereco ? (
            <div>
              <p>
                <strong>Rua:</strong> {entregadorEndereco.enderecoRua},{" "}
                {entregadorEndereco.enderecoNumero}
                {entregadorEndereco.enderecoComplemento &&
                  `, ${entregadorEndereco.enderecoComplemento}`}
              </p>
              <p>
                <strong>Bairro:</strong> {entregadorEndereco.enderecoBairro}
              </p>
              <p>
                <strong>Cidade:</strong> {entregadorEndereco.enderecoCidade} -{" "}
                {entregadorEndereco.enderecoUf}
              </p>
              <p>
                <strong>CEP:</strong> {entregadorEndereco.enderecoCep}
              </p>
            </div>
          ) : (
            <p>Nenhum endereço disponível.</p>
          )}
        </Modal.Content>
        <Modal.Actions>
          <Button color="green" onClick={() => setOpenAddressModal(false)}>
            <Icon name="checkmark" /> Ok
          </Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
}
