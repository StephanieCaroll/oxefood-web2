import axios from "axios";
import InputMask from "comigo-tech-react-input-mask";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Button, Container, Divider, Form, Icon, Message } from "semantic-ui-react";
import MenuSistema from "../../MenuSistema";

export default function FormEnderecos() {
  const navigate = useNavigate();
  const location = useLocation();

  // Estados para os campos do formulário
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cep, setCep] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [complemento, setComplemento] = useState('');

  // Estados cruciais para a lógica de associação e identificação de modo (edição/cadastro)
  const [idEndereco, setIdEndereco] = useState(null); // ID do endereço sendo editado
  const [idClienteAssociado, setIdClienteAssociado] = useState(null); // ID do cliente ao qual este endereço pertence

  // Estados para feedback visual ao usuário
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [mensagemErro, setMensagemErro] = useState('');

  // Efeito para carregar dados (se editando) ou obter clienteId (se novo) 
  useEffect(() => {
    // 1. Tenta obter o clienteId DO STATE da navegação (usado quando se clica em EDITAR na lista)
    // E também o idEndereco, se estiver vindo da edição.
    const { idEndereco: idEndFromState, clienteId: clienteIdFromState } = location.state || {};

    if (idEndFromState) {
        // Se há idEndereco no state, estamos em modo de EDIÇÃO
        setIdEndereco(idEndFromState);
        setIdClienteAssociado(clienteIdFromState); // Garante que o clienteId também é capturado para o PUT

        // GET para buscar um endereço específico (para edição)
        // URL: /api/cliente/endereco/{idEndereco}
        axios.get(`http://localhost:8080/api/cliente/endereco/${idEndFromState}`)
            .then((response) => {
                const endereco = response.data;
                setRua(endereco.rua);
                setNumero(endereco.numero);
                setBairro(endereco.bairro);
                setCep(endereco.cep);
                setCidade(endereco.cidade);
                setEstado(endereco.estado);
                setComplemento(endereco.complemento);
                // Ao carregar para edição, se o clienteId não veio do state, tentamos pegar do endereço (se disponível)
                if (!clienteIdFromState && endereco.cliente?.id) {
                    setIdClienteAssociado(endereco.cliente.id); 
                }
            })
            .catch((error) => {
                console.error("Erro ao carregar endereço para edição:", error);
                setMensagemErro("Erro ao carregar os dados do endereço para edição.");
            });
    } else {
        // 2. Se não há idEndereco no state, tenta obter o clienteId dos query parameters (para NOVO endereço).
        const params = new URLSearchParams(location.search);
        const clienteIdFromQuery = params.get('clienteId');
        if (clienteIdFromQuery) {
            setIdClienteAssociado(clienteIdFromQuery);
        }
    }
  }, [location.state, location.search]); 

  // Função para salvar (criar ou atualizar) o endereço 
  function salvar() {
    setMensagemSucesso('');
    setMensagemErro('');

    if (!idClienteAssociado) {
        setMensagemErro("Erro: Um endereço deve estar associado a um cliente. Por favor, retorne e selecione um cliente válido.");
        return;
    }

    let enderecoClienteRequest = {
      rua: rua,
      numero: numero,
      bairro: bairro,
      cep: cep,
      cidade: cidade,
      estado: estado,
      complemento: complemento
    };

    if (idEndereco) { // Se `idEndereco` tem valor, é ALTERAÇÃO (PUT)
      // URL DO SEU BACKEND: /api/cliente/endereco/{enderecoId}
      axios.put(`http://localhost:8080/api/cliente/endereco/${idEndereco}`, enderecoClienteRequest)
        .then(() => {
          setMensagemSucesso("Endereço alterado com sucesso!");
          navigate('/list-endereco', { state: { id: idClienteAssociado } });
        })
        .catch((error) => {
          console.error("Erro ao alterar um endereço:", error.response?.data || error);
          setMensagemErro("Erro ao alterar o endereço. Verifique o console.");
        });
    } else { // Se `idEndereco` é null, é CADASTRO (POST)
      // URL DO SEU BACKEND: /api/cliente/endereco/{clienteId}
      axios.post(`http://localhost:8080/api/cliente/endereco/${idClienteAssociado}`, enderecoClienteRequest)
        .then(() => {
          setMensagemSucesso("Endereço cadastrado com sucesso!");
          navigate('/list-endereco', { state: { id: idClienteAssociado } });
        })
        .catch((error) => {
          console.error("Erro ao incluir um endereço:", error.response?.data || error);
          setMensagemErro("Erro ao incluir um endereço. Verifique o console.");
        });
    }
  }

  return (
    <div>
      <MenuSistema tela={"endereco"} />

      <div style={{ marginTop: "3%" }}>
        <Container textAlign="justified">
          <h2>
            <span style={{ color: "darkgray" }}>
              Endereços &nbsp;
              <Icon name="angle double right" size="small" />{" "}
            </span>
            {idEndereco ? "Alteração" : "Cadastro"}
          </h2>

          <Divider />

          <div style={{ marginTop: "4%" }}>
            <Form>
              <Form.Group widths="equal">
                <Form.Input
                  required fluid label="Rua" maxLength="100"
                  value={rua} onChange={(e) => setRua(e.target.value)}
                />
                <Form.Input
                  required fluid label="Número" maxLength="10"
                  value={numero} onChange={(e) => setNumero(e.target.value)}
                />
              </Form.Group>

              <Form.Group widths={"equal"}>
                <Form.Input
                  required fluid label="Bairro" maxLength="100"
                  value={bairro} onChange={(e) => setBairro(e.target.value)}
                />
                <Form.Field
                  required label="CEP" control={InputMask} mask="99999-999"
                  value={cep} onChange={(e) => setCep(e.target.value)}
                />
              </Form.Group>

              <Form.Group widths="equal">
                <Form.Input
                  required fluid label="Cidade" maxLength="100"
                  value={cidade} onChange={(e) => setCidade(e.target.value)}
                />
                <Form.Input
                  required fluid label="Estado" maxLength="2"
                  value={estado} onChange={(e) => setEstado(e.target.value)}
                />
                <Form.Input
                  fluid label="Complemento" placeholder="Apto, Bloco, etc" maxLength="100"
                  value={complemento} onChange={(e) => setComplemento(e.target.value)}
                />
              </Form.Group>
            </Form>

            {mensagemSucesso && <Message positive>{mensagemSucesso}</Message>}
            {mensagemErro && <Message negative>{mensagemErro}</Message>}
            
            {idClienteAssociado && !idEndereco && (
                <Message info>
                    Você está adicionando um novo endereço para o **Cliente ID: {idClienteAssociado}**.
                </Message>
            )}
            {idClienteAssociado && idEndereco && (
                <Message info>
                    Você está editando o **Endereço ID: {idEndereco}** do **Cliente ID: {idClienteAssociado}**.
                </Message>
            )}
            {!idClienteAssociado && (
                <Message warning>
                    **Atenção:** Não foi possível identificar o cliente associado a este endereço. Certifique-se de que você acessou esta página a partir de um cliente válido para poder salvar.
                </Message>
            )}

            <div style={{ marginTop: "4%" }}>
              <Button
                type="button" inverted circular icon labelPosition="left" color="orange"
                onClick={() => navigate('/list-endereco', { state: { id: idClienteAssociado } })}
              >
                <Icon name="reply" />
                Voltar
              </Button>

              <Button
                inverted circular icon labelPosition="left" color="blue" floated="right"
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