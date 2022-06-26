import React, { useState, useEffect } from "react";
import { Link, Navigate,useLocation  } from "react-router-dom";
import * as yup from 'yup';
import { Menu } from "../components/Menu";
import api from "../../config/configApi";



export const EditProfile = () =>{
    const state = useLocation()    
    const [name, setName] =useState('')
    const [email, setEmail] =useState('')

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

        await api.put('/edit-profile',{name,email}, headers)
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
            await api.get("/view-profile",headers)
            .then((response)=>{
                if(response.data.user){
                    setName(response.data.user.name)
                    setEmail(response.data.user.email)
                }else{
                    setStatus({
                        type:"warning",
                        mensagem:"Erro. Usuário não encontrado"
                        
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
    //         mensagem:'Erro. Nescessário preencher o campo nome4'
    //     })
    //     if(!email) return setStatus({
    //         type:'error',
    //         mensagem:'Erro. Nescessário preencher o campo email'
    //     })
    //     if(!password) return setStatus({
    //         type:'error',
    //         mensagem:'Erro. Nescessário preencher o campo senha'
    //     })
    //     if(password.length < 6) return setStatus({
    //         type:'error',
    //         mensagem:'Erro. A senha deve ter no mínimo 6 caracteres'
    //     })
        
    // }
    async function validate() {
        let schema = yup.object().shape({
            email: yup.string("Erro: Necessário preencher o campo e-mail!")
                .email("Erro: Necessário preencher o campo e-mail!")
                .required("Erro: Necessário preencher o campo e-mail!"),
            name: yup.string("Erro: Necessário preencher o campo nome!")
                .required("Erro: Necessário preencher o campo nome!")
        });

        try {
            await schema.validate({ name, email });
            return true;
        } catch (err) {
            setStatus({ type: 'error', mensagem: err.errors });
            return false;
        }
    }

    

    return(
        <div>
            <Menu/>
            <h1>Editar Pefil</h1>
            <Link to="/users"><button type="button">Listar</button></Link>{" "}
            
            {status.type === 'error'?<Navigate to= "/login" state={status}/>:""}
            {status.type === 'success'?<Navigate to= "/view-profile" state={status}/>:""}
            <hr/>
            
            <form onSubmit={editUser}>
                <label>Nome* : </label>
                <input type="text" name="name" placeholder="Nome Completo do usuário"  value={name} onChange={event => setName(event.target.value)}></input><br/><br/>
                <label>E-mail* : </label>
                <input type="email" name="email" placeholder="Melhor e-mail do usuário" value={email} onChange = {event => setEmail(event.target.value)}></input><br/><br/>
                
                * Campo obrigatório
                <button type="submit">Salvar</button>
            </form>

        </div>
    )
}