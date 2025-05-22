import { Link } from "react-router-dom";
import { Menu } from "semantic-ui-react";

export default function MenuSistema(props) { //Menu do semantic ui

    return (
        <>
            <Menu inverted>

                <Menu.Item
                    content='Home'
                    active={props.tela === 'home'}
                    as={Link}
                    to='/'
                />

                <Menu.Item
                    content='Cliente'
                    active={props.tela === 'cliente'}
                    as={Link}
                    to='/list-cliente'
                />
                <Menu.Item
                    content='Produto'
                    active={props.tela === 'produto'}
                    as={Link}
                    to='/list-produto'
                />

                <Menu.Item
                    content='Entregador'
                    active={props.tela === 'entregador'}
                    as={Link}
                    to='/list-entregador'
                />
                <Menu.Item
                    content='Cupom Desconto'
                    active={props.tela === 'cupomDesconto'}
                    as={Link}
                    to='/list-cupomDesconto'
                />

                 <Menu.Item
                    content='Categoria Produto'
                    active={props.tela === 'categoriaProduto'}
                    as={Link}
                    to='/list-categoriaProduto'
                />

            </Menu>
        </>
    )
}
