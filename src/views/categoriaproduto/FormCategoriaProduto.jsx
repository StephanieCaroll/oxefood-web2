import axios from "axios";
import { notifyError, notifySuccess } from "../../views/util/Util";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button, Container, Divider, Form, Icon } from "semantic-ui-react";
import MenuSistema from "../../MenuSistema";

export default function FormCategoriaProduto() {
  const [descricao, setDescricao] = useState(""); // Inicialize com string vazia
  const [idCategoriaProduto, setIdCategoriaProduto] = useState(null); // Inicialize com null

  // Use o useLocation para obter o state da navegação
  const { state } = useLocation();

  useEffect(() => {
    // Verifica se há um ID no state da localização (vindo da tela de listagem para edição)
    if (state && state.id) {
      // Requisição de consulta para buscar os dados da categoria
      axios
        .get("http://localhost:8080/api/categoriaproduto/" + state.id)
        .then((response) => {
          setIdCategoriaProduto(response.data.id);
          setDescricao(response.data.descricao);
        })
        .catch((error) => {
          // console.error('Erro ao buscar dados da categoria para edição:', error);
          if (error.response.data.errors != undefined) {
            for (let i = 0; i < error.response.data.errors.length; i++) {
              notifyError(error.response.data.errors[i].defaultMessage);
            }
          } else {
            notifyError(error.response.data.message);
          }
        });
    }
  }, [state]); // O useEffect será re-executado se 'state' mudar

  function salvar() {
    let categoriaProdutoRequest = {
      descricao: descricao,
    };

    if (idCategoriaProduto != null) {
      // Alteração
      axios
        .put(
          "http://localhost:8080/api/categoriaproduto/" + idCategoriaProduto,
          categoriaProdutoRequest
        )
        .then((response) => {
          notifySuccess("Categoria alterada com sucesso.");
        })
        .catch((error) => {
          //   console.error("Erro ao alterar uma categoria:", error);

          if (error.response.data.errors != undefined) {
            for (let i = 0; i < error.response.data.errors.length; i++) {
              notifyError(error.response.data.errors[i].defaultMessage);
            }
          } else {
            notifyError(error.response.data.message);
          }
        });
    } else {
      // Cadastro
      axios
        .post(
          "http://localhost:8080/api/categoriaproduto",
          categoriaProdutoRequest
        )
        .then((response) => {
          notifySuccess("Categoria cadastrada com sucesso.");
        })
        .catch((error) => {
          //   console.error("Erro ao incluir a categoria:", error);

          if (error.response.data.errors != undefined) {
            for (let i = 0; i < error.response.data.errors.length; i++) {
              notifyError(error.response.data.errors[i].defaultMessage);
            }
          } else {
            notifyError(error.response.data.message);
          }
          
        });
    }
  }

  return (
    <div>
      <MenuSistema tela={"categoriaProduto"} />

      <div style={{ marginTop: "3%" }}>
        <Container textAlign="justified">
          {idCategoriaProduto === null ? (
            <h2>
              {" "}
              <span style={{ color: "darkgray" }}>
                {" "}
                Categoria Produto &nbsp;
                <Icon name="angle double right" size="small" />{" "}
              </span>{" "}
              Cadastro
            </h2>
          ) : (
            <h2>
              {" "}
              <span style={{ color: "darkgray" }}>
                {" "}
                Categoria Produto &nbsp;
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
                  label="Descrição"
                  maxLength="100"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                />
              </Form.Group>
            </Form>

            <div style={{ marginTop: "4%" }}>
              <Link to={"/list-categoriaProduto"}>
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
                onClick={salvar}
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
