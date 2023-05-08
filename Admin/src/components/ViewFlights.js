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
import flight_image from '../images/flight.webp'

export const ViewFlights=()=>{

    const [loading,setLoading]=useState(true)
    const [details,setDetails]=useState([])
    const [flightid,setFlightId]=useState(0)
    const navigate=useNavigate()
    const cont=useContext(context)

    useEffect(()=>{
        if(!localStorage.getItem("airlines_token")){
            setLoading(false)
            setTimeout(()=>{
                navigate("/login")
            },3000)
        }
        else{
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


    const deleteschedule=(x)=>{
        setLoading(true)
        axios.delete(`/admin/flight/deleteschedule/${x._id}`).then((res)=>{
            if(res.data.status){
                toast.success(res.data.msg)
                getschedule()
            }
        }).catch(err=>{
            toast.error('Internal Server Error')
            setLoading(false)
        })
    }

    const deleteflight=(x)=>{
        setLoading(true)
        axios.delete(`/admin/flight/deleteflight/${x.Flight_Id}`).then((res)=>{
            if(res.data.status){
                toast.success(res.data.msg)
                getschedule()
            }
        }).catch(err=>{
            toast.error('Internal Server Error')
            setLoading(false)
        })
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

    const isflightexist=(e)=>{
        axios.get(`/admin/flight/isflightexist/${flightid}`).then((res)=>{
            if(res.data.status){
                searchflight()
            }
            else{
                toast.warning('No Flight Found')
            }
        }).catch((err)=>{
            toast.error('Internal Server Error')
            setLoading(false)
        })
        e.preventDefault()
    }

    const searchflight=()=>{
        axios.get(`/admin/flight/getschedulebasedonid/${flightid}`).then((res)=>{
            if(res.data.status){
                getSearchInfo(res.data.msg)
            }
            else{
                navigate('/searchflights')
            }
        }).catch((err)=>{
            console.log(err)
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
                {details.length===0?<h3 style={{textAlign:"center",color:"blueviolet"}}>No Schedule Found</h3>:<div>
                    <img src={flight_image} width="100%" height="300"/>
                    <br></br>
                    <br></br>
                    <br></br>
                    <div>
                        <div className="row">
                            <div className='col-md-4'></div>
                            <div className='col-md-4 filter'>
                                <br></br>
                                <form onSubmit={isflightexist}>
                                <div className='form-group'>
                                    <label style={{color:'green',fontWeight:'bold',fontFamily:'sans-serif'}}> Flight ID : </label>
                                    <input type="number" placeholder='Enter Flight ID to find its schedule' onChange={(e)=>setFlightId(e.target.value)} className="form-control" required></input>
                                </div>
                                <br></br>
                                <button className='btn btn-success'>Find Schedule</button>
                                </form>
                            </div>
                            <div className='col-md-4'></div>
                        </div>
                        <br></br>
                        <br></br>
                        {details.map((x,index)=><div>
                            <h3 className='title'>Schedule Number {index+1}</h3>
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
                        </div>
                    </div>}
                    </div>:<UnAuthorized/>}
            </div>}
            <ToastContainer/>
        </div>
    )
}