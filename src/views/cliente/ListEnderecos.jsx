import axios from 'axios';
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Container, Divider, Header, Icon, Modal, Table } from 'semantic-ui-react';
import MenuSistema from '../../MenuSistema';

export default function ListEnderecos() {
    const location = useLocation();
    const navigate = useNavigate();
    const { id: clienteId } = location.state || {}; // Pega o id do cliente do state da navegação

    // Removida a variável 'lista' não utilizada
    const [listaEnderecos, setListaEnderecos] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [idRemover, setIdRemover] = useState();
    const [nomeCliente, setNomeCliente] = useState('');

    useEffect(() => {
        if (clienteId) {
            carregarEnderecosDoCliente(clienteId);
            carregarNomeDoCliente(clienteId);
        } else {
            // Se não há clienteId, tenta carregar todos os endereços.
            // VOCÊ DEVE CONFIRMAR ESTE ENDPOINT NO SEU BACKEND.
            carregarTodosEnderecos();
        }
    }, [clienteId]);

    function confirmaRemover(id) {
        setOpenModal(true);
        setIdRemover(id);
    }

    function carregarTodosEnderecos() {
        // ASSUMIR QUE ESTE É O ENDPOINT PARA TODOS OS ENDEREÇOS. CONFIRME NO BACKEND.
        axios.get(`http://localhost:8080/api/endereco`) // Endpoint mais genérico para todos os endereços
            .then((response) => {
                setListaEnderecos(response.data);
            })
            .catch((error) => {
                console.error("Erro ao carregar todos os endereços:", error);
            });
    }

    function carregarEnderecosDoCliente(id) {
        // ESTE ENDPOINT PARECE SER O MAIS PROVÁVEL PARA ENDEREÇOS DE UM CLIENTE. CONFIRME NO BACKEND.
        axios.get(`http://localhost:8080/api/cliente/${id}/endereco`) // Mantido como está no seu código
            .then((response) => {
                setListaEnderecos(response.data);
            })
            .catch((error) => {
                console.error("Erro ao carregar endereços do cliente:", error);
            });
    }

    function carregarNomeDoCliente(id) {
        axios.get(`http://localhost:8080/api/cliente/${id}`)
            .then((response) => {
                setNomeCliente(response.data.nome);
            })
            .catch((error) => {
                console.error("Erro ao carregar nome do cliente:", error);
                setNomeCliente(' (Cliente não encontrado)');
            });
    }

    async function remover() {
        try {
            // CORREÇÃO NA URL DO DELETE: Use template literal para incluir o ID
            await axios.delete(`http://localhost:8080/api/cliente/endereco/${idRemover}`);
            console.log('Endereço removido com sucesso.');
            // Recarrega a lista de endereços após a remoção
            if (clienteId) {
                carregarEnderecosDoCliente(clienteId);
            } else {
                carregarTodosEnderecos();
            }
        } catch (error) {
            console.error('Erro ao remover um endereço:', error);
        } finally {
            setOpenModal(false);
        }
    }

    return (
        <div>
            <MenuSistema tela={'endereco'} />
            <div style={{ marginTop: '3%' }}>
                <Container textAlign='justified'>
                    <h2> Endereços {nomeCliente && `de ${nomeCliente}`} </h2>
                    <Divider />

                    <div style={{ marginTop: '4%' }}>
                        <Button
                            label='Novo'
                            circular
                            color='orange'
                            icon='clipboard outline'
                            floated='right'
                            as={Link}
                            // Passa o clienteId como parâmetro de query para o FormEnderecos
                            to={clienteId ? `/form-endereco?clienteId=${clienteId}` : '/form-endereco'}
                        />
                        <Link to={'/list-cliente'}>
                            <Button
                                label='Voltar'
                                circular
                                color='blue'
                                icon='arrow left'
                                floated='left'
                            />
                        </Link>
                        <br /><br /><br />

                        {listaEnderecos.length > 0 ? (
                            <Table color='orange' sortable celled>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>Rua</Table.HeaderCell>
                                        <Table.HeaderCell>Número</Table.HeaderCell>
                                        <Table.HeaderCell>Bairro</Table.HeaderCell>
                                        <Table.HeaderCell>CEP</Table.HeaderCell>
                                        <Table.HeaderCell>Cidade</Table.HeaderCell>
                                        <Table.HeaderCell>Estado</Table.HeaderCell>
                                        <Table.HeaderCell>Complemento</Table.HeaderCell>
                                        <Table.HeaderCell textAlign='center'>Ações</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                    {listaEnderecos.map(endereco => (
                                        <Table.Row key={endereco.id}>
                                            <Table.Cell>{endereco.rua}</Table.Cell>
                                            <Table.Cell>{endereco.numero}</Table.Cell>
                                            <Table.Cell>{endereco.bairro}</Table.Cell>
                                            <Table.Cell>{endereco.cep}</Table.Cell>
                                            <Table.Cell>{endereco.cidade}</Table.Cell>
                                            <Table.Cell>{endereco.estado}</Table.Cell>
                                            <Table.Cell>{endereco.complemento}</Table.Cell>
                                            <Table.Cell textAlign='center'>
                                                <Button
                                                    inverted
                                                    circular
                                                    color='green'
                                                    title='Clique aqui para editar os dados deste endereço'
                                                    icon
                                                >
                                                    {/* Passa o clienteId para o FormEnderecos via state ao editar */}
                                                    <Link to={`/form-endereco/${endereco.id}`} state={{ clienteId: clienteId }} style={{ color: 'green' }}>
                                                        <Icon name='edit' />
                                                    </Link>
                                                </Button>

                                                &nbsp;
                                                <Button
                                                    inverted
                                                    circular
                                                    color='red'
                                                    title='Clique aqui para remover este endereço'
                                                    icon
                                                    onClick={e => confirmaRemover(endereco.id)}
                                                >
                                                    <Icon name='trash' />
                                                </Button>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                        ) : (
                            <p>Nenhum endereço encontrado para este cliente.</p>
                        )}
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
                    <Icon name='trash' />
                    <div style={{ marginTop: '5%' }}> Tem certeza que deseja remover esse registro? </div>
                </Header>
                <Modal.Actions>
                    <Button basic color='red' inverted onClick={() => setOpenModal(false)}>
                        <Icon name='remove' /> Não
                    </Button>
                    <Button color='green' inverted onClick={() => remover()}>
                        <Icon name='checkmark' /> Sim
                    </Button>
                </Modal.Actions>
            </Modal>
        </div>
    );
}