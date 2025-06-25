import axios from "axios";
import { notifyError, notifySuccess } from "../../views/util/Util";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button, Container, Divider, Form, Icon } from "semantic-ui-react";
import MenuSistema from "../../MenuSistema";

export default function FormProduto() {
  const [titulo, setTitulo] = useState("");
  const [codigo, setCodigo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valorUnitario, setValorUnitario] = useState("");
  const [tempoEntregaMinimo, setTempoEntregaMinimo] = useState("");
  const [tempoEntregaMaximo, setTempoEntregaMaximo] = useState("");
  const { state } = useLocation();
  const [idProduto, setIdProduto] = useState(null);
  const [listaCategoria, setListaCategoria] = useState([]);
  const [idCategoria, setIdCategoria] = useState(null); // Inicia como null

  useEffect(() => {
    // 1. Inicia a busca por todas as categorias
    const fetchCategories = axios.get(
      "http://localhost:8080/api/categoriaproduto"
    );

    // 2. Inicia a busca pelos dados do produto, se houver um ID no state (modo edição)
    const fetchProduct = state?.id
      ? axios.get("http://localhost:8080/api/produto/" + state.id)
      : Promise.resolve(null); // Se não for edição, resolve imediatamente com null

    // Espera que AMBAS as chamadas da API sejam concluídas
    Promise.all([fetchCategories, fetchProduct])
      .then(([categoriesResponse, productResponse]) => {
        // Primeiro, processa e define a lista de categorias
        const dropDownCategorias = categoriesResponse.data.map((c) => ({
          text: c.descricao,
          value: c.id,
        }));
        setListaCategoria(dropDownCategorias);

        // Em seguida, se houver dados do produto, preenche o formulário
        if (productResponse && productResponse.data) {
          const productData = productResponse.data;
          setIdProduto(productData.id);
          setCodigo(productData.codigo);
          setTitulo(productData.titulo);
          setDescricao(productData.descricao);
          setValorUnitario(productData.valorUnitario);
          setTempoEntregaMinimo(productData.tempoEntregaMinimo);
          setTempoEntregaMaximo(productData.tempoEntregaMaximo);
          // Define o ID da categoria APÓS a lista de categorias ter sido carregada
          setIdCategoria(productData.categoria?.id || null);
        }
      })
      .catch((error) => {
        // console.error("Erro ao carregar dados (categorias ou produto):", error);

        if (error.response.data.errors !== undefined) {
          for (let i = 0; i < error.response.data.errors.length; i++) {
            notifyError(error.response.data.errors[i].defaultMessage);
          }
        } else {
          notifyError(error.response.data.message);
        }
      });
  }, [state]); // O useEffect será executado novamente se o 'state' da rota mudar

  function salvar() {
    let produtoRequest = {
      idCategoria: idCategoria,
      codigo: codigo,
      titulo: titulo,
      descricao: descricao,
      valorUnitario: parseFloat(valorUnitario), // Converte para número
      tempoEntregaMinimo: parseInt(tempoEntregaMinimo, 10), // Converte para número inteiro
      tempoEntregaMaximo: parseInt(tempoEntregaMaximo, 10), // Converte para número inteiro
    };

    if (idProduto) {
      // Alteração:
      axios
        .put("http://localhost:8080/api/produto/" + idProduto, produtoRequest)
        .then((response) => {
          notifySuccess("Produto alterado com sucesso.");
        })
        .catch((error) => {
          // console.error("Erro ao alterar um produto:", error);

          if (error.response.data.errors !== undefined) {
            for (let i = 0; i < error.response.data.errors.length; i++) {
              notifyError(error.response.data.errors[i].defaultMessage);
            }
          } else {
            notifyError(error.response.data.message);
          }
        });
    } else {
      // Cadastro:
      axios
        .post("http://localhost:8080/api/produto", produtoRequest)
        .then((response) => {
          notifySuccess("Produto cadastrado com sucesso.");
        })
        .catch((error) => {
          // console.error("Erro ao incluir o produto:", error);

          if (error.response.data.errors !== undefined) {
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
      <MenuSistema tela={"produto"} />

      <div style={{ marginTop: "3%" }}>
        <Container textAlign="justified">
          {idProduto === null ? (
            <h2>
              {" "}
              <span style={{ color: "darkgray" }}>
                {" "}
                Produto &nbsp;
                <Icon name="angle double right" size="small" />{" "}
              </span>{" "}
              Cadastro
            </h2>
          ) : (
            <h2>
              {" "}
              <span style={{ color: "darkgray" }}>
                {" "}
                Produto &nbsp;
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
                  label="Titulo"
                  maxLength="100"
                  placeholder="Informe o titulo do produto"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                />

                <Form.Input
                  required
                  fluid
                  placeholder="Informe o código do produto"
                  label="Código do Produto"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                ></Form.Input>
              </Form.Group>

              <Form.Select
                required
                fluid
                tabIndex="3"
                placeholder="Selecione"
                label="Categoria"
                options={listaCategoria}
                value={idCategoria}
                onChange={(e, { value }) => {
                  setIdCategoria(value);
                }}
              />

              <Form.TextArea
                label="Descrição"
                placeholder="Informe a descrição do produto"
                maxLength="10000"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
              <Form.Group>
                <Form.Input
                  required
                  fluid
                  label="Valor Unitário"
                  placeholder="20.99"
                  width={6}
                  value={valorUnitario}
                  onChange={(e) => setValorUnitario(e.target.value)}
                ></Form.Input>

                <Form.Input
                  fluid
                  label="Tempo de Entrega Mínimo em Minutos"
                  placeholder="30"
                  width={6}
                  value={tempoEntregaMinimo}
                  onChange={(e) => setTempoEntregaMinimo(e.target.value)}
                ></Form.Input>

                <Form.Input
                  fluid
                  label="Tempo de Entrega Máximo em Minutos"
                  placeholder="40"
                  width={6}
                  value={tempoEntregaMaximo}
                  onChange={(e) => setTempoEntregaMaximo(e.target.value)}
                ></Form.Input>
              </Form.Group>
            </Form>

            <div style={{ marginTop: "4%" }}>
              <Link to={"/list-produto"}>
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
