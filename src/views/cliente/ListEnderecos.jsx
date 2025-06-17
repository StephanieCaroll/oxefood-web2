import axios from 'axios';
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Container, Divider, Header, Icon, Modal, Table } from 'semantic-ui-react';
import MenuSistema from '../../MenuSistema';

export default function ListEnderecos() {
    const location = useLocation();
    const navigate = useNavigate();
    const { id: clienteId } = location.state || {}; // Pega o id do cliente do state da navegação

    const [listaEnderecos, setListaEnderecos] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [idRemover, setIdRemover] = useState();
    const [nomeCliente, setNomeCliente] = useState('');

    useEffect(() => {
        if (clienteId) {
            carregarEnderecosDoCliente(clienteId);
            carregarNomeDoCliente(clienteId);
        } else {
            carregarTodosEnderecos();
        }
    }, [clienteId]);

    function confirmaRemover(id) {
        setOpenModal(true);
        setIdRemover(id);
    }

    function carregarTodosEnderecos() {
        axios.get(`http://localhost:8080/api/endereco`)
            .then((response) => {
                setListaEnderecos(response.data);
            })
            .catch((error) => {
                console.error("Erro ao carregar todos os endereços:", error);
            });
    }

    function carregarEnderecosDoCliente(id) {
        axios.get(`http://localhost:8080/api/cliente/${id}/endereco`)
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
            await axios.delete(`http://localhost:8080/api/cliente/endereco/${idRemover}`);
            console.log('Endereço removido com sucesso.');

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
                    <h2>
                        Endereços {nomeCliente && `de ${nomeCliente}`} {clienteId && `(ID: ${clienteId})`}
                    </h2>
                    <Divider />

                    <div style={{ marginTop: '4%' }}>
                        <Button
                            label='Novo'
                            circular
                            color='orange'
                            icon='clipboard outline'
                            floated='right'
                            as={Link}
                            // Para um NOVO endereço, ainda passamos via query parameter,
                            // pois o FormEnderecos usa location.search para isso.
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
                                                    {/* >>> MUDANÇA AQUI: Passa ID do Endereço e ClienteId via STATE <<< */}
                                                    <Link to={`/form-endereco`} 
                                                          state={{ idEndereco: endereco.id, clienteId: clienteId }} 
                                                          style={{ color: 'green' }}>
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