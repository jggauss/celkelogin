import React, { useState, useEffect } from "react";
import {  Navigate, useLocation } from "react-router-dom";
import * as yup from 'yup';
import { Menu } from "../components/Menu";
import api from "../../config/configApi";


export const EditProfilePassword = () =>{
    const state = useLocation()
    const [name, setName] =useState('')
    const [email, setEmail] =useState('')
    
    const [password, setPassword] =useState('')

    const [status, setStatus] = useState({
        type: state ? state.type :"",
        mensagem: state ? state.mensagem :""
    })

    const editUser = async e => {
        e.preventDefault()

        if(!( await validate())) return

        
        const headers = {
            'headers': {
                'Content-type':'application/json',
                'Authorization':'Bearer '+localStorage.getItem("token")
            }
        }

        await api.put("/edit-profile-password",{password}, headers)

      
        .then((response) => {
            setStatus({
                type:"success",
                mensagem:response.data.mensagem
            })
        }).catch((err) => {
            if(err.response){
                setStatus({
                    type:"error",
                    mensagem:err.response.data.mensagem
                })
            }else{
                setStatus({
                    type:"error",
                    mensagem:"Erro. Tente mais tarde"
                })

            }
        })
    }

    useEffect(() => {
        const getUser = async () => {
            const headers = {
                'headers': {
                    'Content-type':'application/json',
                    'Authorization':'Bearer '+localStorage.getItem("token")
                }
            }
            await api.get("/view-profile/",headers)
            .then((response)=>{
                if(response.data.user){
                    setName(response.data.user.name)
                    setEmail(response.data.user.email)   
                }else{
                    setStatus({
                        type:"warning",
                        mensagem:"Erro. Usu??rio n??o encontrado"
                        
                    })
                }
                
            }).catch((err)=>{
                if(err.response){
                    setStatus({
                        type:"warning",
                        mensagem:err.response.data.mensagem
                    })
                }else{
                    setStatus({
                        type:"warning",
                        mensagem:"Erro. Tente mais tarde"
                    })
                }
            })
        }
        getUser()
    },[])

    

    

    // async function validate(){
    //     if(!name) return setStatus({
    //         type:'error',
    //         mensagem:'Erro. Nescess??rio preencher o campo nome4'
    //     })
    //     if(!email) return setStatus({
    //         type:'error',
    //         mensagem:'Erro. Nescess??rio preencher o campo email'
    //     })
    //     if(!password) return setStatus({
    //         type:'error',
    //         mensagem:'Erro. Nescess??rio preencher o campo senha'
    //     })
    //     if(password.length < 6) return setStatus({
    //         type:'error',
    //         mensagem:'Erro. A senha deve ter no m??nimo 6 caracteres'
    //     })
        
    // }
    async function validate() {
        let schema = yup.object().shape({
            password: yup.string("Erro: Necess??rio preencher o campo senha!")
                .required("Erro: Necess??rio preencher o campo senha!")
                .min(6, "Erro: A senha deve ter no m??nimo 6 caracteres!"),
            
        });

        try {
            await schema.validate({password, });
            return true;
        } catch (err) {
            setStatus({ type: 'error', mensagem: err.errors });
            return false;
        }
    }



    return(
        <div>
            <Menu/>
            <h1>Alterar Senha Perfil</h1>
                        

            {status.type === 'warning'?<Navigate to= "/users" state={status.type}/>:""}
            {status.type === 'success'?<Navigate to="/users" state={status}/>:""}
            {status.type === 'error'?<p>{status.mensagem}</p>:""}
            <hr/>
            
            
            <form onSubmit={editUser}>
                <label>Nome* :{name} </label><br/>
                
                <label>E-mail* :{email} </label><br/><br/>
                
                <label>Senha* : </label>
                <input type="password" name="password" placeholder="Nova senha" autoComplete="on" onChange={event => setPassword(event.target.value)}></input><br/><br/>
                * Campo obrigat??rio
                <button type="submit">Salvar</button>
            </form>

        </div>
    )
}