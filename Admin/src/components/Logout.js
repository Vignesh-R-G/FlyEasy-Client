import React,{useEffect,useContext} from 'react'
import { useNavigate } from 'react-router-dom'
import { context } from "./Context"

export const Logout=()=>{
    const cont=useContext(context)
    const navigate=useNavigate()
    useEffect(()=>{
        localStorage.removeItem("airlines_token")
        cont.setAdminName("")
        cont.setAdminEmail("")
        navigate("/")
    },[])
}