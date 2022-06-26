import React, { useState, useEffect } from "react";
import { Link,useParams, Navigate } from "react-router-dom";
import * as yup from 'yup';
import { Menu } from "../components/Menu";
import api from "../../config/configApi";
import { servDeleteUser } from '../../services/servDeleteUser';



export const EditUserPassword = (props) =>{
    
    const {id} = useParams()
    const [name, setName] =useState('')
    const [email, setEmail] =useState('')
    
    const [password, setPassword] =useState('')

    const [status, setStatus]= useState({
        type:'',
        mensagem:''
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

        await api.put("/user-senha",{id,password}, headers)

      
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
            await api.get("/user/"+id,headers)
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
    },[id])

    

    

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
            password: yup.string("Erro: Necessário preencher o campo senha!")
                .required("Erro: Necessário preencher o campo senha!")
                .min(6, "Erro: A senha deve ter no mínimo 6 caracteres!"),
            
        });

        try {
            await schema.validate({password, });
            return true;
        } catch (err) {
            setStatus({ type: 'error', mensagem: err.errors });
            return false;
        }
    }

    const deleteUser = async (idUser) => {
        const response = await servDeleteUser(idUser);
        if (response) {
            if (response.type === "success") {
                setStatus({
                    type: 'success',
                    mensagem: response.mensagem
                });
            } else {
                setStatus({
                    type: "error",
                    mensagem: response.mensagem
                });
            }
        } else {
            setStatus({
                type: 'error',
                mensagem: 'Erro: Tente mais tarde!'
            });
        }
    }

    return(
        <div>
            <Menu/>
            <h1>Editar Usuário</h1>
            <Link to="/users"><button type="button">Listar</button></Link>{" "}
            <Link to={"/view-user/"+id}><button type="button">Visualizar</button></Link>
            <Link to={"#"+id}><button type="button" onClick={() => deleteUser(id)}>Apagar</button></Link>

            {status.type === 'warning'?<Navigate to= "/users" state={status.type}/>:""}
            {status.type === 'success'?<Navigate to="/users" state={status}/>:""}
            {status.type === 'error'?<p>{status.mensagem}</p>:""}
            <hr/>
            
            
            <form onSubmit={editUser}>
                <label>Nome* :{name} </label><br/>
                
                <label>E-mail* :{email} </label><br/><br/>
                
                <label>Senha* : </label>
                <input type="password" name="password" placeholder="Nova senha" autoComplete="on" onChange={event => setPassword(event.target.value)}></input><br/><br/>
                * Campo obrigatório
                <button type="submit">Salvar</button>
            </form>

        </div>
    )
}