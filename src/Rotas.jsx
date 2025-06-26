import { Route, Routes } from "react-router-dom";
import FormCategoriaProduto from './views/categoriaproduto/FormCategoriaProduto';
import ListCategoriaProduto from './views/categoriaproduto/ListCategoriaProduto';
import FormCliente from './views/cliente/FormCliente';
import FormEnderecos from "./views/cliente/FormEnderecos";
import ListCliente from './views/cliente/ListCliente';
import ListEnderecos from "./views/cliente/ListEnderecos";
import FormEntregador from './views/entregador/FormEntregador';
import ListEntregador from './views/entregador/ListEntregador';
import Home from './views/home/Home';
import FormLogin from './views/login/FormLogin';
import FormProduto from './views/produto/FormProduto';
import ListProduto from './views/produto/ListProduto';
import { ProtectedRoute } from './views/util/ProtectedRoute';

function Rotas() { 
    return (
        <>
            <Routes>
                <Route path="/" element={ <FormLogin/> } />

                <Route path="/home" element={
                <ProtectedRoute> 
                    <Home/>
                </ProtectedRoute>
                 } />
       
                <Route path="list-cliente" element={
                 <ProtectedRoute>
                    <ListCliente/>
                </ProtectedRoute>
                 } /> 
       
                <Route path="list-produto" element={
                 <ProtectedRoute>
                    <ListProduto/>
                </ProtectedRoute> 
                } />
        
                <Route path="list-entregador" element={ 
                <ProtectedRoute>  
                    <ListEntregador/>
                 </ProtectedRoute>
                 } />

                <Route path="list-categoriaProduto" element={
                <ProtectedRoute>
                    <ListCategoriaProduto/>
                </ProtectedRoute>   
                } />
        
                <Route path="form-cliente" element={
                <ProtectedRoute>   
                    <FormCliente/>
                 </ProtectedRoute>
                } />

                <Route path="form-produto" element={
                <ProtectedRoute>    
                    <FormProduto/> 
                </ProtectedRoute>    
                } />
        
                <Route path="form-entregador" element={
                <ProtectedRoute>
                    <FormEntregador/>
                </ProtectedRoute>  
                } />
        
                <Route path="form-categoriaProduto" element={
                <ProtectedRoute>
                    <FormCategoriaProduto/>
                </ProtectedRoute>
                } />
        
                <Route path="form-endereco" element={
                <ProtectedRoute>
                    <FormEnderecos/>
                </ProtectedRoute>
                } />
       
                <Route path="list-endereco" element={
                 <ProtectedRoute>
                    <ListEnderecos/>
                </ProtectedRoute>
                } />
        
            </Routes>
        </>
    )
}

export default Rotas
