import React,{useEffect,useContext} from 'react'
import { useNavigate } from 'react-router-dom'
import { context } from "./Context"

export const Logout=()=>{
    const cont=useContext(context)
    const navigate=useNavigate()
    useEffect(()=>{
        localStorage.removeItem("airlinesuser_token")
        cont.setUserName("")
        cont.setUserEmail("")
        navigate("/")
    },[])
}