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

export const FilterBookings=()=>{
    const [loading,setLoading]=useState(true)
    const [flightid,setFlightId]=useState(0)
    const [date,setDate]=useState("")
    const navigate=useNavigate()
    const cont=useContext(context)
    const details=cont.filterdetails

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
                <br></br>
                {details.length===0?<h3 style={{textAlign:"center",color:"blueviolet"}}>No Bookings Found</h3>:<div>
                {details.map((x,index)=><div>
                    <h3 className='title'>Booking Number : {index+1}</h3>
                    <br></br>
                    <Table responsive striped bordered hover>
                                <thead>
                                    <tr>
                                        <th style={{color:"green"}}>Booking Id</th>
                                        <th style={{color:"green"}}>Booked Email</th>
                                        <th style={{color:"green"}}>Booked Date</th>
                                        <th style={{color:"green"}}>Number of Passengers</th>
                                        <th style={{color:"green"}}>Flight ID</th>
                                        <th style={{color:"green"}}>Flight Name</th>
                                        <th style={{color:"green"}}>From</th>
                                        <th style={{color:"green"}}>To</th>
                                        <th style={{color:"green"}}>Departure Date</th>
                                    </tr>
                                    <tr>
                                        <th style={{color:"blue"}}>{x[0].Booking_Id}</th>
                                        <th style={{color:"blue"}}>{x[0].Booking_Email}</th>
                                        <th style={{color:"blue"}}>{x[0].Booking_Date.slice(0,10)}</th>
                                        <th style={{color:"blue"}}>{x[0].Number_Of_Passengers}</th>
                                        <th style={{color:"blue"}}>{x[0].Flight_Id}</th>
                                        <th style={{color:"blue"}}>{x[0].Flight_Name}</th>
                                        <th style={{color:"blue"}}>{x[0].From_Location}</th>
                                        <th style={{color:"blue"}}>{x[0].To_Location}</th>
                                        <th style={{color:"blue"}}>{x[0].Departure_Time}</th>
                                    </tr>
                                </thead>
                    </Table>
                    <Table responsive striped bordered hover>
                    <thead>
                        <tr>
                            <th style={{color:"green"}}>Passenger Name</th>
                            <th style={{color:"green"}}>Passenger Age</th>
                            <th style={{color:"green"}}>Passenger Email</th>
                            <th style={{color:"green"}}>Passenger Mno</th>
                        </tr>
                    </thead>
                    <tbody>
                    {x.map((y)=>
                        <tr>
                            <th style={{color:"blue"}}>{y.Person_Name}</th>
                            <th style={{color:"blue"}}>{y.Age}</th>
                            <th style={{color:"blue"}}>{y.Person_Email===undefined?"N/A":y.Person_Email}</th>
                            <th style={{color:"blue"}}>{y.Mobile_Num===undefined?"N/A":y.Mobile_Num}</th>
                        </tr>
                    )}
                    </tbody>
                    </Table>
                    <Table responsive striped bordered hover>
                        <thead>
                            <tr>
                                <th style={{color:"green"}}>Price (Per Ticket)</th>
                                <th style={{color:"blueviolet"}}>₹ {x[0].Ticket_Price}</th>
                                <th style={{color:"green"}}>Total Price</th>
                                <th style={{color:"blueviolet"}}>₹ {x[0].Ticket_Price*x[0].Number_Of_Passengers}</th>
                            </tr>
                        </thead>
                    </Table>
                    <br></br>
                    <br></br>
                </div>)}
                </div>}
                </div>:<UnAuthorized/>}
            </div>}
        </div>
    )
}