import axios from "axios";
import React, { useState } from "react";
import { Button, Container, Divider, Form, Icon } from 'semantic-ui-react';
import MenuSistema from '../../MenuSistema';

export default function FormProduto () {

    const [titulo, setTitulo] = useState();
    const [codigo, setcodigo] = useState();
    const [descricao, setdescricao] = useState();
    const [valorUnitario, setvalorUnitario] = useState();
    const [tempoEntregaMinimo, settempoEntregaMinimo] = useState();
    const [tempoEntregaMaximo, settempoEntregaMaximo] = useState(); 

    function salvar() {

		let ProdutoRequest = {
		     titulo: titulo,
		     codigo: codigo,
		     descricao: descricao,
		     valorUnitario: valorUnitario,
		     tempoEntregaMinimo: tempoEntregaMinimo,
             tempoEntregaMaximo:tempoEntregaMaximo
		}
	
		axios.post("http://localhost:8080/api/produto", ProdutoRequest)
		.then((response) => {
		     console.log('Produto cadastrado com sucesso.')
		})
		.catch((error) => {
		     console.log('Erro ao incluir o um Produto.')
		})
	}


    return (

        <div>
        
        <MenuSistema tela={'produto'} />

            <div style={{marginTop: '3%'}}>

                <Container textAlign='justified' >

                    <h2> <span style={{color: 'darkgray'}}> Produto &nbsp;<Icon name='angle double right' size="small" /> </span> Cadastro </h2>

                    <Divider />

                    <div style={{marginTop: '4%'}}>

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
			                        onChange={e => setcodigo(e.target.value)}
                                >
                                </Form.Input>

                            </Form.Group>
                            <Form.TextArea
                                    label='Descrição'
                                    placeholder="Informe a descrição do produto"
                                    maxLength="10000"
                                    value={descricao}
			                        onChange={e => setdescricao(e.target.value)}

                               />
                            <Form.Group>

                                <Form.Input
                                    required
                                    fluid
                                    label='Valor Unitário'
                                    width={6}
                                    value={valorUnitario}
			                        onChange={e => setvalorUnitario(e.target.value)}
                                >
                                </Form.Input>

                                <Form.Input
                                    fluid
                                    label='Tempo de Entrega Mínimo em Minutos'
                                    placeholder="30"
                                    width={6}
                                    value={tempoEntregaMinimo}
			                        onChange={e => settempoEntregaMinimo(e.target.value)}

                                >
                                </Form.Input>

                                <Form.Input
                                    fluid
                                    label='Tempo de Entrega Máximo em Minutos'
                                    placeholder="40"
                                    width={6}
                                    value={tempoEntregaMaximo}
			                        onChange={e => settempoEntregaMaximo(e.target.value)}

                                >
                                </Form.Input>
                            </Form.Group>
                        
                        </Form>
                        
                        <div style={{marginTop: '4%'}}>

                            <Button
                                type="button"
                                inverted
                                circular
                                icon
                                labelPosition='left'
                                color='orange'
                            >
                                <Icon name='reply' />
                                Listar
                            </Button>
                                
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
