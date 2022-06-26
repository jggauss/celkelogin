import React, { useState, useContext } from "react";

import {useNavigate, Navigate} from 'react-router-dom'

import api from "../../config/configApi.js"

import {Context} from "../../Context/AuthContext.js"

export const Login = ()=>{

    const navigate = useNavigate()

    const { signIn } = useContext(Context)
    

    const [user, setUser] = useState({
        email:'',
        password:''
    })

    const [status, setStatus] = useState({
        type:'',
        mensagem:'',
        loading:false
    })

    const valorInput = e => setUser({...user,[e.target.name]: e.target.value})

    const loginSubmit = async e => {
        e.preventDefault()
        setStatus({
            loading:true
        })
        
        const headers = {
            'Content-Type': 'application/json'
        }
        await api.post("/login", user,{ headers })
        .then((response) => {
            setStatus({
                //type:'success',
                //mensagem: response.data.mensagem,
                loading:false    
            })
            localStorage.setItem('token',response.data.token)
            signIn(true)
            return navigate("/dashboard") 
        }).catch((err) => {
            if(err.response){
                setStatus({
                    type:'error',
                    mensagem: err.response.data.mensagem,
                    loading:false
                });
            } else {
                setStatus({
                    type:'error',
                    mensagem:"Erro: Tente mais tarde",
                    loading:false
                })
            }
        })
    }

    return(
        <div>
            <h1>Login</h1>
            {status.type === 'error' ? <p>{status.mensagem}</p>:""}
            {status.type === 'success' ?<Navigate to= "/users" state={status.type}/> :""} 
            {status.loading ? <p>Validando</p> : ""}
            <form onSubmit={loginSubmit}>
                <label>Usuário:</label>
                <input type="text" name="email" placeholder="Digite o e-mail" onChange={valorInput}/><br></br>
                <label>Senha:</label>
                <input type="password" name="password" placeholder="Digite a senha" autoComplete="on" onChange={valorInput}/><br></br>
                
                {status.loading ? <button type="Submit" disabled>Acessando</button> :<button type="Submit">Acessar</button>}
            </form>
        </div>
    )
}