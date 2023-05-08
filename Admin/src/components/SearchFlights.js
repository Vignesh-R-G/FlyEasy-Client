import React,{useState,useEffect,useContext} from 'react'
import '../bootstrap.min.css'
import axios from "../axios/Axios";
import { ToastContainer, toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import { useNavigate } from 'react-router-dom'
import Table from 'react-bootstrap/Table'
import {Loading} from './Loading'
import { context } from './Context'
import { NavigationBar } from './Navbar'
import { UnAuthorized } from './UnAuthorized'
import {RiFlightTakeoffFill} from 'react-icons/ri'

export const SearchFlights=()=>{

    const [loading,setLoading]=useState(true)
    const navigate=useNavigate()
    const cont=useContext(context)
    const details=cont.viewdetails

    useEffect(()=>{
        if(!localStorage.getItem("airlines_token")){
            setLoading(false)
            setTimeout(()=>{
                navigate("/login")
            },3000)
        }
        else{
            setTimeout(()=>{
                setLoading(false)
            },1000)
        }
    },[])

    const deleteschedule=(x)=>{
        axios.delete(`/admin/flight/deleteschedule/${x._id}`).then((res)=>{
            if(res.data.status){
                navigate('/')
                toast.success(res.data.msg)
            }
        }).catch(err=>{
            toast.error('Internal Server Error')
            setLoading(false)
        })
    }

    const deleteflight=(x)=>{
        axios.delete(`/admin/flight/deleteflight/${x.Flight_Id}`).then((res)=>{
            if(res.data.status){
                navigate('/')
                toast.success(res.data.msg)
            }
        }).catch(err=>{
            toast.error('Internal Server Error')
            setLoading(false)
        })
    }


    return(
        <div className='container-fluid'>
            {loading?
                <Loading/>
            :
            <div>
                <NavigationBar/>
                {localStorage.getItem("airlines_token")?<div>
                <br></br>
                <br></br>
                <br></br>
                <h1 className="title"><RiFlightTakeoffFill/> Fly Easy</h1>
                <br></br>
                <br></br>
                {details.length===0?<h3 style={{textAlign:"center",color:"blueviolet"}}>No Schedule Found</h3>:
                    <div>
                        {details.map((x,index)=><div>
                            <h3 className='title'>Schedule Number {index+1}</h3>
                            <br></br>
                            <br></br>
                            <Table responsive striped bordered hover>
                                <thead>
                                    <tr>
                                        <th style={{color:"green"}}>Flight ID</th>
                                        <th style={{color:"green"}}>Flight Name</th>
                                        <th style={{color:"green"}}>Details</th>
                                        <th>Action</th>
                                    </tr>
                                    <tr>
                                        <th style={{color:"blueviolet"}}>{x.Flight_Id}</th> 
                                        <th style={{color:"blueviolet"}}>{x.Flight_Name}</th>
                                        <th>
                                            <h6>From: <span style={{color:"blue"}}>{x.From_Location}</span></h6>
                                            <h6>To: <span style={{color:"blue"}}>{x.To_Location}</span></h6>
                                            <h6>Departure Time: <span style={{color:"blue"}}>{x.Departure_Time}</span></h6>
                                            <h6>Arrival Time: <span style={{color:"blue"}}>{x.Arrival_Time}</span></h6>
                                            <h6>Duration: <span style={{color:"blue"}}>{x.Duration}</span></h6>
                                            <h6>Ticket Price: <span style={{color:"blue"}}>₹ {x.Ticket_Price}</span></h6>
                                        </th>
                                        <th>
                                            <button className='btn btn-primary' onClick={()=>deleteschedule(x)}>Delete Schedule</button>
                                            <button className='btn btn-success' onClick={()=>deleteflight(x)} style={{position:"relative",left:"3px"}}>Delete Flight</button>
                                        </th>
                                    </tr>
                                    <tr>
                                        <th style={{color:"green"}}>Seat Availability :</th>
                                        <th style={{color:"blue"}}>{x.isSeatAvailable?"Available":"Not Available"}</th>
                                        <th style={{color:"green"}}>Available Seats :</th>
                                        <th style={{color:"blue"}}>{x.Available_Seats} Seats</th>
                                    </tr>
                                </thead>
                            </Table>
                            <br></br>
                            
                        </div>)}
                    </div>}
                    </div>:<UnAuthorized/>}
            </div>}
            <ToastContainer/>
        </div>
    )
}