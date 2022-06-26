import React, { useEffect, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { Menu } from "../components/Menu";
import api from "../../config/configApi";


export const ViewProfile = () => {
    
    const  { state }  = useLocation()
    
    
    const [data,setData] = useState('')
    
    const [status, setStatus]= useState({
        type:state? state.type:"",
        mensagem:state? state.mensagem : ""
    })
    
    
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
                    setData(response.data.user)

                }else{
                    setStatus({
                        type:"error",
                        mensagem:"Erro. Perfil não encontrado"
                        
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
    },[])

    
    return(
        <div>
            <Menu/>
            <h1>Perfil</h1>
            <Link to="/edit-profile"><button type="button">Editar</button></Link>{" "}
            <Link to="/edit-profile-password"><button type="button">Alterar Senha</button></Link>
                        
            {status.type === 'error'?<Navigate to= "/login" />:""}
            {status.type === 'success'?<p>{status.mensagem}</p>:""}
            <hr/>
            <span>{data.id}</span><br/>
            <span>{data.name}</span><br/>
            <span>{data.email}</span><br/>
            
        </div>
    )
}