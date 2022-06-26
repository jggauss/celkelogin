import React, { useEffect, useState } from "react";
import { Link, useParams,Navigate, useLocation } from "react-router-dom";
import { Menu } from "../components/Menu";
import { servDeleteUser } from "../../services/servDeleteUser";
import api from "../../config/configApi";


export const ViewUser = (props) => {
    let {state} = useLocation()
    const [data,setData] = useState('')
    const {id} = useParams()
    
    const [status, setStatus]= useState({
        type:state ? state.type :"",
        mensagem:state ? state.mensagem:""
    })
    
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
                    setData(response.data.user)
                }else{
                    setStatus({
                        type:"error",
                        mensagem:"Erro. Usuário não encontrado"
                        
                    })
                }
                
            }).catch((err)=>{
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
        getUser()
    },[id])

    const deleteUser = async (idUser) => {
        const response = await servDeleteUser(idUser)
        if(response){
            setStatus({
                type:"success",
                mensagem:response.mensagem
            })
        }else{
            setStatus({
                type:"error",
                mensagem:"Erro. Tente mais tarde"
            })
        }
    }




    return(
        <div>
            <Menu/>
            <h1>Detalhes do Usuário</h1>
            <Link to="/users"><button type="button">Listar</button></Link>{" "}
            <Link to={"/edit-user/"+data.id}><button type="button">Editar</button></Link>{" "}
            <Link to={"/edit-user-password/"+data.id}><button type="button">Editar senha</button></Link>{" "}
            <Link to={"#"+data.id}><button type="button" onClick={() => deleteUser(data.id)}>Apagar</button></Link>
            
            {status.type === 'error'?<Navigate to= "/users" state={status}/>:""}
            {status.type === 'success'?<p>{status.mensagem}</p>:""}
            <hr/>
            <span>{data.id}</span><br/>
            <span>{data.name}</span><br/>
            <span>{data.email}</span><br/>
            
        </div>
    )
}