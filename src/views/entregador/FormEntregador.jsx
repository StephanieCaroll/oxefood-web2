import InputMask from 'comigo-tech-react-input-mask';
import React from "react";
import { Button, Container, Divider, Form, Icon } from 'semantic-ui-react';

export default function FormEntregador () {

    return (

        <div>

            <div style={{marginTop: '3%'}}>

                <Container textAlign='justified' >

                    <h2> <span style={{color: 'darkgray'}}> Entregador &nbsp;<Icon name='angle double right' size="small" /> </span> Cadastro </h2>

                    <Divider />

                    <div style={{marginTop: '4%'}}>

                        <Form>

                            <Form.Group>

                                <Form.Input
                                    required
                                    fluid
                                    label='Nome'
                                   width={10}
                                />

                                <Form.Input
                                    required
                                    width={3}
                                    fluid
                                    label='CPF'>
                                    <InputMask
                                    required
                                    mask="999.999.999-99"
                                    /> 
                                    
                                </Form.Input>
                               
                                <Form.Input
                                    fluid
                                    label='RG'
                                   width={4}
                                />

                            </Form.Group>
                            <Form.Group>
                            <Form.Input
                                    fluid
                                    label='DT Nascimento'
                                    width={4}>
                                     <InputMask 
                                    mask="99/99/9999" 
                                    maskChar={null}
                                    placeholder="Ex: 20/03/1985"
                                    /> 
                                </Form.Input>

                            <Form.Input
                            required
                            fluid
                            label='Fone Celular'
                            width={6}>
                            <InputMask 
                            mask="(99) 9999.9999"
                            /> 
                            </Form.Input>
                            
                            <Form.Input
                            fluid
                            label='Fone Fixo'
                            width={6}>
                            <InputMask 
                            mask="(99) 9999.9999"
                            /> 
                            </Form.Input>

                            <Form.Input
                                    fluid
                                    label='QTD Entregas Realizadas'
                                    width={6}>
                                </Form.Input>

                                <Form.Input
                                    fluid
                                    label='Valor Por Frete'
                                    width={6}>
                                </Form.Input>

                                </Form.Group>
                            <Form.Group>

                                <Form.Input
                                    fluid
                                    label='Rua'
                                    width={14}>
                                </Form.Input>

                                <Form.Input
                                    fluid
                                    label='Número'
                                    width={3}
                                >
                                </Form.Input>

                            </Form.Group>
                        
                            <Form.Group>

                            <Form.Input
                                    fluid
                                    label='Bairro'
                                    width={12}
                                >
                                </Form.Input>

                                <Form.Input
                                    fluid
                                    label='Cidade'
                                    width={13}
                                >
                                </Form.Input>

                                <Form.Input
                                    fluid
                                    label='CEP'
                                    width={4}
                                >
                                </Form.Input>

                            </Form.Group>

                            <Form.Input
                                    fluid
                                    label='UF'
                                    width={60}
                                >
                                </Form.Input>

                                <Form.Input
                                    fluid
                                    label='Complemento'
                                    width={60}
                                >
                                </Form.Input>


<div class="ui form">
  <div class="inline fields">
    <label>Ativo:</label>
    <div class="field">
      <div class="ui radio checkbox">
        <label>Sim</label>
      </div>
    </div>
    <div class="field">
      <div class="ui radio checkbox">
        <label>Não</label>
      </div>
    </div>
  </div>
</div>

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
