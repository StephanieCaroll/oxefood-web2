import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button, Container, Divider, Form, Icon } from 'semantic-ui-react';
import MenuSistema from '../../MenuSistema';

export default function FormProduto() {

    const [titulo, setTitulo] = useState();
    const [codigo, setCodigo] = useState();
    const [descricao, setDescricao] = useState();
    const [valorUnitario, setValorUnitario] = useState();
    const [tempoEntregaMinimo, setTempoEntregaMinimo] = useState();
    const [tempoEntregaMaximo, setTempoEntregaMaximo] = useState();
    const { state } = useLocation();
    const [idProduto, setIdProduto] = useState();

    useEffect(() => {
        if (state != null && state.id != null) {
            axios.get("http://localhost:8080/api/produto/" + state.id)
                .then((response) => {
                    setIdProduto(response.data.id)
                    setTitulo(response.data.titulo)
                    setCodigo(response.data.codigo)
                    setDescricao(response.data.descricao)
                    setValorUnitario(response.data.valorUnitario)
                    setTempoEntregaMinimo(response.data.tempoEntregaMinimo)
                    setTempoEntregaMaximo(response.data.tempoEntregaMaximo)
                })
        }
    }, [state])


    function salvar() {

        let ProdutoRequest = {
            titulo: titulo,
            codigo: codigo,
            descricao: descricao,
            valorUnitario: valorUnitario,
            tempoEntregaMinimo: tempoEntregaMinimo,
            tempoEntregaMaximo: tempoEntregaMaximo
        }

        if (idProduto != null) { //Alteração:
            axios.put("http://localhost:8080/api/produto/" + idProduto, ProdutoRequest)
            .then((response) => { console.log('Produto alterado com sucesso.') })
            .catch((error) => { console.log('Erro ao alter um produto.') })
        } else { //Cadastro:
            axios.post("http://localhost:8080/api/produto", ProdutoRequest)
            .then((response) => { console.log('Produto cadastrado com sucesso.') })
            .catch((error) => { console.log('Erro ao incluir o produto.') })
        }
 }

    return (

        <div>

            <MenuSistema tela={'produto'} />

            <div style={{ marginTop: '3%' }}>

                <Container textAlign='justified' >

                   
{ idProduto === undefined &&
    <h2> <span style={{color: 'darkgray'}}> Produto &nbsp;<Icon name='angle double right' size="small" /> </span> Cadastro</h2>
}
{ idProduto != undefined &&
    <h2> <span style={{color: 'darkgray'}}> Produto &nbsp;<Icon name='angle double right' size="small" /> </span> Alteração</h2>
}


                    <Divider />

                    <div style={{ marginTop: '4%' }}>

                        <Form>

                            <Form.Group widths='equal'>

                                <Form.Input
                                    required
                                    fluid
                                    label='Titulo'
                                    maxLength="100"
                                    placeholder="Informe o titulo do produto"
                                    value={titulo}
                                    onChange={e => setTitulo(e.target.value)}

                                />

                                <Form.Input
                                    required
                                    fluid
                                    placeholder="Informe o código do produto"
                                    label='Código do Produto'
                                    value={codigo}
                                    onChange={e => setCodigo(e.target.value)}
                                >
                                </Form.Input>

                            </Form.Group>
                            <Form.TextArea
                                label='Descrição'
                                placeholder="Informe a descrição do produto"
                                maxLength="10000"
                                value={descricao}
                                onChange={e => setDescricao(e.target.value)}

                            />
                            <Form.Group>

                                <Form.Input
                                    required
                                    fluid
                                    label='Valor Unitário'
                                    width={6}
                                    value={valorUnitario}
                                    onChange={e => setValorUnitario(e.target.value)}
                                >
                                </Form.Input>

                                <Form.Input
                                    fluid
                                    label='Tempo de Entrega Mínimo em Minutos'
                                    placeholder="30"
                                    width={6}
                                    value={tempoEntregaMinimo}
                                    onChange={e => setTempoEntregaMinimo(e.target.value)}

                                >
                                </Form.Input>

                                <Form.Input
                                    fluid
                                    label='Tempo de Entrega Máximo em Minutos'
                                    placeholder="40"
                                    width={6}
                                    value={tempoEntregaMaximo}
                                    onChange={e => setTempoEntregaMaximo(e.target.value)}

                                >
                                </Form.Input>
                            </Form.Group>

                        </Form>

                        <div style={{ marginTop: '4%' }}>

                            <Link to={'/list-produto'}>

                                <Button
                                    type="button"
                                    inverted
                                    circular
                                    icon
                                    labelPosition='left'
                                    color='orange'
                                >
                                    <Icon name='reply' />
                                    Voltar
                                </Button>

                            </Link>

                            <Button
                                inverted
                                circular
                                icon
                                labelPosition='left'
                                color='blue'
                                floated='right'
                                onClick={() => salvar()}
                            >
                                <Icon name='save' />
                                Salvar
                            </Button>

                        </div>

                    </div>

                </Container>
            </div>
        </div>

    );

}
