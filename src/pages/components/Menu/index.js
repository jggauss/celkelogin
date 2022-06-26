import React, {useContext} from "react";
import { Link } from "react-router-dom";
import {Context} from '../../../Context/AuthContext'


export const Menu =() => {
    const {handleLogout} =useContext(Context)
    return(
        <div>
            <Link to="/dashboard">Dashboard</Link><br/>
            <Link to="/users">Usuários</Link><br/>
            <Link to="/view-profile">Perfil</Link><br/>
            <Link to="/" onClick={handleLogout}>Sair</Link>
        </div>
    )
}