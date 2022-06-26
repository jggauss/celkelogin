import React, { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { Menu } from "../components/Menu";
import api from "../../config/configApi";
import * as yup from 'yup';




export const AddUser = () =>{
    const {state} = useLocation()
    
    const[user, setUser]= useState({
        name:'',
        email:'',
        password:''
    })

    
    const [status, setStatus] = useState({
        type: state ? state.type :"",
        mensagem: state ? state.mensagem :""
    })

    const valueInput = e => setUser({...user, [e.target.name]:e.target.value})

    const addUser = async e => {
        e.preventDefault()

        if(!( await validate())) return
        

        const headers = {
            'headers':{
                'Content-type':'application/json',
                'Authorization': 'Bearer '+localStorage.getItem("token")
            }
        }
        await api.post('/user', user, headers)
        .then((response) => {
            setStatus({
                type:'success',
                mensagem:response.data.mensagem
            })
            
        }).catch((err)=>{
            if(err.response){
                setStatus({
                        type:'error',
                        mensagem:err.response.data.mensagem
                    })
            }else{
                setStatus({
                    type:'error',
                    mensagem:"Erro. Tente mais tarde"
                })
            }
        })
    }

    // function validate(){
    //     if(!user.name) return setStatus({
    //         type:'error',
    //         mensagem:'Erro. Nescessário preencher o campo nome'
    //     })
    //     if(!user.email) return setStatus({
    //         type:'error',
    //         mensagem:'Erro. Nescessário preencher o campo email'
    //     })
    //     if(!user.password) return setStatus({
    //         type:'error',
    //         mensagem:'Erro. Nescessário preencher o campo senha'
    //     })
    //     if(user.password.length < 6) return setStatus({
    //         type:'error',
    //         mensagem:'Erro. A senha deve ter no mínimo 6 caracteres'
    //     })
    // }

    async function validate(){
        let schema = yup.object().shape({
                password: yup.string("Erro. Nescessário preencher o campo senha")
                .required("Erro. Nescessário preencher o campo senha")
                .min(6,"Erro. A senha deve ter no mínimo 6 caracteres"),
                email: yup.string("Erro. nescessário preencher o campo e-mail")
                .email("Erro. Preencha um email válido")
                .required("Erro. Nescessário preencher o campo e-mail"),
                name: yup.string("Erro. Nescessário preencher o campo nome")
                .required("Erro. Nescessário preencher o campo nome"),
              })
              try{
                 await schema.validate({
                    name:user.name,
                    email:user.email,
                    password:user.password,
                })
                return true
              }catch(err){
                 setStatus({
                  type:'error',
                  mensagem:err.errors
                })
                return false
              }
    }

   
    return(
        <div>
            <Menu/>
            <h1>Cadastrar Usuário</h1>
            <Link to="/users"><button type="button">Listar</button></Link>
            
            {status.type==='error'?<p>{status.mensagem}</p> :""}
            {status.type==='success'?<Navigate to= "/users" state={status}/> :""}
            <hr/>
            <form onSubmit={addUser}>
                <label>Nome* : </label>
                <input type="text" name="name" placeholder="Nome completo do usuário" onChange={valueInput}></input><br/><br/>
                <label>E-mail* : </label>
                <input type="email" name="email" placeholder="Melhor e-mail do usuário" onChange={valueInput}></input><br/><br/>
                <label>Senha* : </label>
                <input type="password" name="password" placeholder="Senha para acessar o sistema" autoComplete="on" onChange={valueInput}></input><br/><br/>
                * Campo obrigatório
                <button type="submit">Cadastrar</button>
            </form>
        </div>
    )
}