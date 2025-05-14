import axios from "axios";
import InputMask from 'comigo-tech-react-input-mask';
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button, Container, Divider, Form, Icon } from 'semantic-ui-react';
import MenuSistema from '../../MenuSistema';

export default function FormCupomDesconto() {

    const [codigoDesconto, setCodigoDesconto] = useState();
    const [percentualDesconto, setPercentualDesconto] = useState();
    const [valorDesconto, setValorDesconto] = useState();
    const [valorMinimoPedidoPermitido, setValorMinimoPedidoPermitido] = useState();
    const [quantidadeMaximaUso, setQuantidadeMaximaUso] = useState();
    const [inicioVigencia, setInicioVigencia] = useState();
    const [fimVigencia, setFimVigencia] = useState();
    const { state } = useLocation();
    const [idCupomDesconto, setIdCupomDesconto] = useState();

    useEffect(() => {

        if (state != null && state.id != null) {

            axios.get("http://localhost:8080/api/cupomDesconto/" + state.id) //Requisição de consulta
                .then((response) => {
                    setIdCupomDesconto(response.data.id)
                    setCodigoDesconto(response.data.codigoDesconto)
                    setPercentualDesconto(response.data.percentualDesconto)
                    setValorDesconto(response.data.valorDesconto)
                    setValorMinimoPedidoPermitido(response.data.valorMinimoPedidoPermitido)
                    setQuantidadeMaximaUso(response.data.quantidadeMaximaUso)
                    setInicioVigencia(formatarData(response.data.inicioVigencia))
                    setFimVigencia(formatarData(response.data.fimVigencia))
                })
        }
    }, [state])


    function salvar() { //Função cria um objeto e coloca na variavel cupomDescontoRequest(backend)

        let cupomDescontoRequest = { //Como se fosse o Json (com os dados do cupom)
            codigoDesconto: codigoDesconto,
            percentualDesconto: percentualDesconto,
            valorDesconto: valorDesconto,
            valorMinimoPedidoPermitido: valorMinimoPedidoPermitido,
            quantidadeMaximaUso: quantidadeMaximaUso,
            inicioVigencia: inicioVigencia,
            fimVigencia: fimVigencia
        }

        if (idCupomDesconto != null) { //Alteração:
            axios.put("http://localhost:8080/api/cupomDesconto/" + idCupomDesconto, cupomDescontoRequest)
                .then((response) => { console.log('Cupom alterado com sucesso.') })
                .catch((error) => { console.log('Erro ao alterar um cupom.') })
        } else { //Cadastro:
            axios.post("http://localhost:8080/api/cupomDesconto", cupomDescontoRequest)
                .then((response) => { console.log('Cupom cadastrado com sucesso.') })
                .catch((error) => { console.log('Erro ao incluir o cupom.') })
        }

    }

    function formatarData(dataParam) {

        if (dataParam === null || dataParam === '' || dataParam === undefined) {
            return ''
        }

        let arrayData = dataParam.split('-');
        return arrayData[2] + '/' + arrayData[1] + '/' + arrayData[0];
    }

    return (

        <div>

            <MenuSistema tela={'cupomDesconto'} />

            <div style={{ marginTop: '3%' }}>

                <Container textAlign='justified' >

                    {idCupomDesconto === undefined &&
                        <h2> <span style={{ color: 'darkgray' }}> Cupom de Desconto &nbsp;<Icon name='angle double right' size="small" /> </span> Cadastro</h2>
                    }
                    {idCupomDesconto != undefined &&
                        <h2> <span style={{ color: 'darkgray' }}> Cupom de Desconto &nbsp;<Icon name='angle double right' size="small" /> </span> Alteração</h2>
                    }


                    <Divider />

                    <div style={{ marginTop: '4%' }}>

                        <Form>

                            <Form.Group widths='equal'>

                                <Form.Input
                                    required
                                    fluid
                                    label='Código'
                                    maxLength="400"
                                    width={10}
                                    value={codigoDesconto}
                                    onChange={e => setCodigoDesconto(e.target.value)}

                                />

                                <Form.Input

                                    fluid
                                    label='Percentual Desconto'
                                    maxLength="50"
                                    width={5}
                                    value={percentualDesconto}
                                    onChange={e => setPercentualDesconto(e.target.value)}

                                />

                                <Form.Input

                                    fluid
                                    label='Valor Desconto'
                                    maxLength="50"
                                    width={5}
                                    value={valorDesconto}
                                    onChange={e => setValorDesconto(e.target.value)}

                                />

                            </Form.Group>

                            <Form.Group>

                                <Form.Input

                                    fluid
                                    label='Valor Mínimo Permitido para o Pedido'
                                    maxLength="20"
                                    width={10}
                                    value={valorMinimoPedidoPermitido}
                                    onChange={e => setValorMinimoPedidoPermitido(e.target.value)}

                                />

                                <Form.Input
                                    fluid
                                    label='Quantidade Máxima de Uso por Cliente'
                                    maxLength="20"
                                    width={10}
                                    value={quantidadeMaximaUso}
                                    onChange={e => setQuantidadeMaximaUso(e.target.value)}

                                />
                            </Form.Group>

                            <Form.Group>
                                <Form.Input
                                    fluid
                                    label='Início da Vigência'
                                    width={4}
                                >
                                    <InputMask
                                        mask="99/99/9999"
                                        maskChar={null}
                                        placeholder="Ex: 20/01/2005"
                                        value={inicioVigencia}
                                        onChange={e => setInicioVigencia(e.target.value)}
                                    />
                                </Form.Input>

                                <Form.Input
                                    fluid
                                    label='Fim da Vigência'
                                    width={4}
                                >
                                    <InputMask
                                        mask="99/99/9999"
                                        maskChar={null}
                                        placeholder="Ex: 18/05/2005"
                                        value={fimVigencia}
                                        onChange={e => setFimVigencia(e.target.value)}
                                    />
                                </Form.Input>

                            </Form.Group>

                        </Form>

                        <div style={{ marginTop: '4%' }}>

                            <Link to={'/list-cupomDesconto'}>

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
