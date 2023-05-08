import React,{useState,useEffect,useContext} from 'react'
import '../bootstrap.min.css'
import axios from "../axios/Axios";
import { ToastContainer, toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import { useNavigate } from 'react-router-dom'
import Table from 'react-bootstrap/Table'
import {Loading} from './Loading'
import { context } from './Context'
import '../css/ViewFlights.css'
import { NavigationBar } from './Navbar'
import { UnAuthorized } from './UnAuthorized'
import {RiFlightTakeoffFill} from 'react-icons/ri'
import flight_image from '../images/flight.webp'

export const ViewFlights=()=>{

    const [loading,setLoading]=useState(true)
    const [details,setDetails]=useState([])
    const [fromlocation,setFromLocation]=useState("")
    const [tolocation,setToLocation]=useState("")
    const [date,setDate]=useState("")
    const navigate=useNavigate()
    const cont=useContext(context)

    useEffect(()=>{
        if(!localStorage.getItem("airlinesuser_token")){
            setLoading(false)
            setTimeout(()=>{
                navigate("/login")
            },3000)
        }
        else{
            cont.setBookDetails([])
            cont.setViewDetails([])
            getschedule()
        }
    },[])

    const getschedule=()=>{
        axios.get("/admin/flight/getschedule").then((res)=>{
            setDetails([])
            if(res.data.status){
                getAllInfo(res.data.msg)
            }
            else{
                setLoading(false)
            }
        }).catch((err)=>{
            toast.error('Internal Server Error')
            setLoading(false)
        })
    }

    const getAllInfo=(data)=>{
        const lst=[]
        let count = 0
        for(const x of data){
            axios.get(`admin/seating/gettotalseats/${x._id}`).then((res)=>{
                console.log(res.data.msg)
                x.Available_Seats=res.data.msg.Available_Seats
                x.isSeatAvailable=res.data.msg.isSeatAvailable
                lst.push(x)
                count=count+1
                if(count===data.length){
                    setDetails(lst)
                    setLoading(false)
                }
            }).catch((err)=>{
                console.log(err)
                setLoading(false)
            })
        }
       
    }


    

    

    const getSearchInfo=(data)=>{
        const lst=[]
        let count = 0
        for(const x of data){
            axios.get(`admin/seating/gettotalseats/${x._id}`).then((res)=>{
                console.log(res.data.msg)
                x.Available_Seats=res.data.msg.Available_Seats
                x.isSeatAvailable=res.data.msg.isSeatAvailable
                lst.push(x)
                count=count+1
                if(count===data.length){
                    cont.setViewDetails(lst)
                    navigate('/searchflights')
                }
            }).catch((err)=>{
                console.log(err)
                setLoading(false)
            })
        }
    }


    const searchflightbydate=(e)=>{
        axios.get(`/admin/flight/filterflightsbydate/${fromlocation}/${tolocation}/${date}`).then((res)=>{
            if(res.data.status){
                getSearchInfo(res.data.msg)
            }
            else{
                toast.warning(res.data.msg)
            }
        }).catch((err)=>{
            console.log(err)
            setLoading(false)
        })
        e.preventDefault()
    }

    const searchflightbydatetime=(e)=>{
        axios.get(`/admin/flight/filterflights/${fromlocation}/${tolocation}/${date}`).then((res)=>{
            if(res.data.status){
                getSearchInfo(res.data.msg)
            }
            else{
                toast.warning(res.data.msg)
            }
        }).catch((err)=>{
            console.log(err)
            setLoading(false)
        })
        e.preventDefault()
    }


    const bookticket=(x)=>{
        const lst=[]
        lst.push(x)
        cont.setBookDetails(lst)
        navigate('/booking')
    }

    return(
        <div className='container-fluid'>
            {loading?
                <Loading/>
            :
            <div>
                <NavigationBar/>
                {localStorage.getItem("airlinesuser_token")?<div>
                <br></br>
                <br></br>
                <br></br>
                <h1 className="title"><RiFlightTakeoffFill/> Fly Easy</h1>
                <br></br>
                {details.length===0?<h3 style={{textAlign:"center",color:"blueviolet"}}>No Schedule Found</h3>:
                    <div>
                        <img src={flight_image} width="100%" height="300"/>
                        <br></br>
                        <br></br>
                        <br></br>
                        <div className="row">
                            <div className='col-md-4'></div>
                            <div className='col-md-4 filter'>
                                <form>
                                <div className='form-group'>
                                    <label style={{color:'green',fontWeight:'bold',fontFamily:'sans-serif'}}> From : </label>
                                    <input type="text" placeholder='Enter the starting location' onChange={(e)=>setFromLocation(e.target.value)} className="form-control" required></input>
                                    <br></br>
                                    <label style={{color:'green',fontWeight:'bold',fontFamily:'sans-serif'}}> To : </label>
                                    <input type="text" placeholder='Enter the destination' onChange={(e)=>setToLocation(e.target.value)} className="form-control" required></input>
                                    <br></br>
                                    <label style={{color:'green',fontWeight:'bold',fontFamily:'sans-serif'}}> Date : </label>
                                    <input type="datetime-local" placeholder='Enter the date to find flights' onChange={(e)=>setDate(e.target.value)} className="form-control" required></input>
                                    <br></br>
                                </div>
                                <br></br>
                                <button type="submit" onClick={searchflightbydate} className='btn btn-success'>Search By Date</button>
                                <button type="submit" style={{position:"relative",left:"3px"}}onClick={searchflightbydatetime} className='btn btn-success'>Search By DateTime</button>
                                </form>
                            </div>
                            <div className='col-md-4'></div>
                        </div>
                        <br></br>
                        <br></br>
                        {details.map((x,index)=><div>
                            <h3 className='title'>Flight Number {index+1}</h3>
                            <Table responsive striped bordered hover>
                                <thead>
                                    <tr>
                                        <th style={{color:"green"}}>Flight ID</th>
                                        <th style={{color:"green"}}>Flight Name</th>
                                        <th style={{color:"green"}}>Details</th>
                                        <th style={{color:"green"}}>Action</th>
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
                                            <button className='btn btn-primary' onClick={()=>bookticket(x)}>Book Ticket</button>
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