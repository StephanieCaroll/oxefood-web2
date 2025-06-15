import axios from "axios";
import InputMask from "comigo-tech-react-input-mask";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button, Container, Divider, Form, Icon } from "semantic-ui-react";
import MenuSistema from "../../MenuSistema";

export default function FormEnderecos() {
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cep, setCep] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [complemento, setComplemento] = useState('');
  const { state } = useLocation();
  const [idCliente, setIdCliente] = useState('');

  useEffect(() => {
    if (state != null && state.id != null) {
      //Se o id estiver não entrará no if  não terá requisição

      axios
        .get("http://localhost:8080/api/cliente/endereco/" + state.id) //Requisição de consulta
        .then((response) => {
          setIdCliente(response.data.id);
          setRua(response.data.rua);
          setNumero(response.data.numero);
          setBairro(response.data.bairro);
          setCep(response.data.cep);
          setCidade(response.data.cidade);
          setEstado(response.data.estado);
          setComplemento(response.data.complemento);
        });
    }
  }, [state]);

  function salvar() {
    //Função cria um objeto e coloca na variavel clientRequest(backend)

    let enderecoClienteRequest = {
      //Como se fosse o Json (com os dados do cliente)
      id: idCliente,
      rua: rua,
      numero: numero,
      bairro: bairro,
      cep: cep,
      cidade: cidade,
      estado: estado,
      complemento: complemento,
    };

    if (idCliente != null) {
      //Alteração:
      axios
        .put(
          "http://localhost:8080/api/cliente/endereco/" + idCliente,enderecoClienteRequest
        )
        .then((response) => {console.log("Endereço alterado com sucesso.");})
        .catch((error) => {console.log("Erro ao alterar um Endereço.");});
    } else {
      //Cadastro:
      axios
        .post("http://localhost:8080/api/cliente/endereco/", enderecoClienteRequest)
        .then((response) => {
          console.log("Endereço cadastrado com sucesso.");
        })
        .catch((error) => {
          console.log("Erro ao incluir um endereço.");
        });
    }
  }

  return (
    <div>
      <MenuSistema tela={"endereco"} />

      <div style={{ marginTop: "3%" }}>
        <Container textAlign="justified">
          {idCliente === undefined && (
            <h2>
              {" "}
              <span style={{ color: "darkgray" }}>
                {" "}
                Endereços &nbsp;
                <Icon name="angle double right" size="small" />{" "}
              </span>{" "}
              Cadastro
            </h2>
          )}
          {idCliente != undefined && (
            <h2>
              {" "}
              <span style={{ color: "darkgray" }}>
                {" "}
                Endereços &nbsp;
                <Icon name="angle double right" size="small" />{" "}
              </span>{" "}
              Alteração
            </h2>
          )}

          <Divider />

          <div style={{ marginTop: "4%" }}>
            <Form>
              <Form.Group widths="equal">
                <Form.Input
                  required
                  fluid
                  label="Rua"
                  maxLength="100"
                  value={rua}
                  onChange={(e) => setRua(e.target.value)}
                />

                <Form.Input
                  required
                  fluid
                  label="Número"
                  maxLength="100"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                />
              </Form.Group>

              <Form.Group widths={"equal"}>
                <Form.Input
                  required
                  fluid
                  label="Bairro"
                  maxLength="100"
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                />

                <Form.Input
                  required
                  fluid
                  label="CEP"
                  maxLength="100"
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                />
</Form.Group>
<Form.Group widths="equal">
                <Form.Input
                  required
                  fluid
                  label="Cidade"
                  maxLength="100"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                />
                <Form.Input
                  required
                  fluid
                  label="Estado"
                  maxLength="100"
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                />

                <Form.Input
                  fluid
                  label="Complemento"
                  placeholder="Apto, Bloco, etc"
                  maxLength="100"
                  value={complemento}
                  onChange={(e) => setRua(e.target.value)}
                />
              </Form.Group>
            </Form>

            <div style={{ marginTop: "4%" }}>
              <Link to={"/list-endereco"}>
                <Button
                  type="button"
                  inverted
                  circular
                  icon
                  labelPosition="left"
                  color="orange"
                >
                  <Icon name="reply" />
                  Voltar
                </Button>
              </Link>

              <Button
                inverted
                circular
                icon
                labelPosition="left"
                color="blue"
                floated="right"
                onClick={() => salvar()}
              >
                <Icon name="save" />
                Salvar
              </Button>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
