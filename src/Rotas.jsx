import { Route, Routes } from "react-router-dom";

import FormCategoriaProduto from './views/categoriaproduto/FormCategoriaProduto';
import ListCategoriaProduto from './views/categoriaproduto/ListCategoriaProduto';
import FormCliente from './views/cliente/FormCliente';
import ListCliente from './views/cliente/ListCliente';
import FormCupomDesconto from "./views/cupomDesconto/FormCupomDesconto";
import ListCupomDesconto from "./views/cupomDesconto/ListCupomDesconto";
import FormEntregador from './views/entregador/FormEntregador';
import ListEntregador from './views/entregador/ListEntregador';
import Home from './views/home/Home';
import FormProduto from './views/produto/FormProduto';
import ListProduto from './views/produto/ListProduto';
import FormEnderecos from "./views/cliente/FormEnderecos";
import ListEnderecos from "./views/cliente/ListEnderecos";

function Rotas() { 
    return (
        <>
            <Routes>
                <Route path="/" element={ <Home/> } /> 
                <Route path="list-cliente" element={ <ListCliente/> } /> 
                <Route path="list-produto" element={ <ListProduto/> } />
                <Route path="list-entregador" element={ <ListEntregador/> } />
                <Route path="list-cupomDesconto" element={ <ListCupomDesconto/> } />
                <Route path="list-categoriaProduto" element={ <ListCategoriaProduto/> } />
                <Route path="form-cliente" element={ <FormCliente/> } />
                <Route path="form-produto" element={ <FormProduto/> } />
                <Route path="form-entregador" element={ <FormEntregador/> } />
                <Route path="form-cupomDesconto" element={ <FormCupomDesconto/> } />
                <Route path="form-categoriaProduto" element={ <FormCategoriaProduto/> } />
                <Route path="form-endereco" element={ <FormEnderecos/> } />
                <Route path="list-endereco" element={ <ListEnderecos/> } />
            </Routes>
        </>
    )
}

export default Rotas
