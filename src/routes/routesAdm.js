//import React, { useContext } from "react";
import {Routes,Navigate, Route } from 'react-router-dom';


import { Login } from "../pages/Login/index.js";
import { Dashboard } from "../pages/Dashboard/index.js";
import {Users} from "../pages/Users/index.js"
import { AddUser } from '../pages/AddUser/index.js';
import { ViewUser } from '../pages/ViewUser/index.js';
import { EditUser } from '../pages/EditUser/index.js';
import {EditUserPassword} from '../pages/EditUserPassword/index.js'
import {ViewProfile} from '../pages/ViewProfile/index.js'
import {EditProfile} from '../pages/EditProfile/index.js'
import { EditProfilePassword } from '../pages/EditProfilePassword/index.js';

//import { Context } from "../Context/AuthContext.js";

function CustomRoute({ children, redirectTo}){
    const Authenticated = localStorage.getItem("token")
    
    return Authenticated ? children : <Navigate to={redirectTo}/>
 
}

export default function RoutesAdm() {
  return (
    <div>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<CustomRoute redirectTo="/"><Dashboard/> /</CustomRoute>} />
            <Route path="/users" element={<CustomRoute redirectTo="/"><Users/> /</CustomRoute>} />
            <Route path="/add-user" element={<CustomRoute redirectTo="/"><AddUser/></CustomRoute>}/>
            <Route path="/view-user/:id" element={<CustomRoute redirectTo="/"><ViewUser/></CustomRoute>}/>
            <Route path="/edit-user/:id" element={<CustomRoute redirectTo="/"><EditUser/></CustomRoute>}/>
            <Route path="/edit-user-password/:id" element={<CustomRoute redirectTo="/"><EditUserPassword/></CustomRoute>}/>
            <Route path="/view-profile" element={<CustomRoute redirectTo="/"><ViewProfile/></CustomRoute>}/>
            <Route path="/edit-profile" element={<CustomRoute redirectTo="/"><EditProfile/></CustomRoute>}/>
            <Route path="/edit-profile-password" element={<CustomRoute redirectTo="/"><EditProfilePassword/></CustomRoute>}/>
        </Routes>
            
    </div>
      
  );
}


