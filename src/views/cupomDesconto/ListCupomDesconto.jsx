import axios from 'axios';
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Container, Divider, Header, Icon, Modal, Table } from 'semantic-ui-react';
import MenuSistema from '../../MenuSistema';

export default function ListCupomDesconto() {

    const [lista, setLista] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [idRemover, setIdRemover] = useState();

    useEffect(() => {
        carregarLista();
    }, [])

    function confirmaRemover(id) { //Recebe o id do cupom
        setOpenModal(true) // Modifica a variavel open modal para true
        setIdRemover(id)
    }

    function carregarLista() {

        axios.get("http://localhost:8080/api/cupomDesconto")
            .then((response) => {
                setLista(response.data)
            })
    }
    function formatarData(dataParam) {

        if (dataParam === null || dataParam === '' || dataParam === undefined) {
            return ''
        }

        let arrayData = dataParam.split('-');
        return arrayData[2] + '/' + arrayData[1] + '/' + arrayData[0];
    }

    async function remover() {

        await axios.delete('http://localhost:8080/api/cupomDesconto/' + idRemover)
        .then((response) => {
  
            console.log('Cupom removido com sucesso.')
  
            axios.get("http://localhost:8080/api/cupomDesconto")
            .then((response) => {
                setLista(response.data)
            })
        })
        .catch((error) => {
            console.log('Erro ao remover um cupom.')
        })
        setOpenModal(false)
    } 

    return (
        <div>
            <MenuSistema tela={'cupomDesconto'} />
            <div style={{ marginTop: '3%' }}>

                <Container textAlign='justified' >

                    <h2> Cupom de Desconto </h2>
                    <Divider />

                    <div style={{ marginTop: '4%' }}>
                        <Button
                            label='Novo'
                            circular
                            color='orange'
                            icon='clipboard outline'
                            floated='right'
                            as={Link}
                            to='/form-cupomDesconto'
                        />
                        <br /><br /><br />

                        <Table color='orange' sortable celled>

                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Código</Table.HeaderCell>
                                    <Table.HeaderCell>Percentual Desconto</Table.HeaderCell>
                                    <Table.HeaderCell>Valor Desconto</Table.HeaderCell>
                                    <Table.HeaderCell>Valor Mínimo Permitido para o Pedido</Table.HeaderCell>
                                    <Table.HeaderCell>Quantidade Máxima de Uso por Cliente</Table.HeaderCell>
                                    <Table.HeaderCell>Início da Vigência</Table.HeaderCell>
                                    <Table.HeaderCell>Fim da Vigência</Table.HeaderCell>
                                    <Table.HeaderCell textAlign='center'>Ações</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>

                                {lista.map(cupomDesconto => (

                                    <Table.Row key={cupomDesconto.id}>
                                        <Table.Cell>{cupomDesconto.codigoDesconto}</Table.Cell>
                                        <Table.Cell>{cupomDesconto.percentualDesconto}</Table.Cell>
                                        <Table.Cell>{cupomDesconto.valorDesconto}</Table.Cell>
                                        <Table.Cell>{cupomDesconto.valorMinimoPedidoPermitido}</Table.Cell>
                                        <Table.Cell>{cupomDesconto.quantidadeMaximaUso}</Table.Cell>
                                        <Table.Cell>{formatarData(cupomDesconto.inicioVigencia)}</Table.Cell>
                                        <Table.Cell>{formatarData(cupomDesconto.fimVigencia)}</Table.Cell>
                                        <Table.Cell textAlign='center'>

                                            <Button
                                                inverted
                                                circular
                                                color='green'
                                                title='Clique aqui para editar os dados deste cliente'
                                                icon>
                                                <Link to="/form-cupomDesconto" state={{ id: cupomDesconto.id }} style={{ color: 'green' }}> <Icon name='edit' /> </Link>
                                            </Button>

                                            &nbsp;
                                            <Button
                                                inverted
                                                circular
                                                color='red'
                                                title='Clique aqui para remover este cupom'
                                                icon
                                                onClick={e => confirmaRemover(cupomDesconto.id)}>
                                                <Icon name='trash' />
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
    )
}
