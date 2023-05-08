import React,{useState,useEffect,useContext} from 'react'
import '../bootstrap.min.css'
import axios from "../axios/Axios";
import { ToastContainer, toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import { useNavigate } from 'react-router-dom'
import {Loading} from './Loading'
import '../css/AddSchedule.css'
import { NavigationBar } from './Navbar'
import { UnAuthorized } from './UnAuthorized'
import {RiFlightTakeoffFill} from 'react-icons/ri'

export const AddNewFlightSchedule=()=>{

    const navigate=useNavigate()
    const [loading,setLoading]=useState(false)

    const [id,setId]=useState(0)
    const [name,setName]=useState("")
    const [description,setDescription]=useState("")
    const [fromlocation,setFromLocation]=useState("")
    const [tolocation,setToLocation]=useState("")
    const [departuretime,setDepartureTime]=useState("")
    const [arrivaltime,setArrivalTime]=useState("")
    const [price,setPrice]=useState(0)

    useEffect(()=>{
        if(!localStorage.getItem("airlines_token")){
            setLoading(false)
            setTimeout(()=>{
                navigate("/login")
            },3000)
        }
    },[])


    //To calculate duration between departure and arrival time
    const calculateDuration = () => {
        const start = new Date(departuretime)
        const end = new Date(arrivaltime)
        const durationInMilliseconds = end - start
        const millisecondsPerMinute = 1000 * 60
        const millisecondsPerHour = 1000 * 60 * 60
        const millisecondsPerDay = 1000 * 60 * 60 * 24

        const days = Math.floor(durationInMilliseconds / millisecondsPerDay);
        const hours = Math.floor((durationInMilliseconds % millisecondsPerDay) / millisecondsPerHour)
        const minutes = Math.floor((durationInMilliseconds % millisecondsPerHour) / millisecondsPerMinute)

        let durationString = ""
        if (days > 0) {
            durationString += days + " day" + (days > 1 ? "s" : "") + " "
        }
        if (hours > 0) {
            durationString += hours + " hour" + (hours > 1 ? "s" : "") + " "
        }
        if (minutes > 0) {
            durationString += minutes + " minute" + (minutes > 1 ? "s" : "") + " "
        }
        console.log(durationString)
        return durationString.trim()
    }


    console.log(arrivaltime,new Date(arrivaltime))
    const addschedule=(e)=>{
        const flightdetails={
            flight_id:id,
            flight_name:name,
            description:description,
            from_location:fromlocation,
            to_location:tolocation,
            departure_time:departuretime,
            arrival_time:arrivaltime,
            duration:calculateDuration(),
            ticket_price:price
        }

        axios.post('/admin/flight/addflight',flightdetails).then((res)=>{
            if(res.data.status){
                toast.success(res.data.msg)
            }
            else{
                toast.warning(res.data.msg)
            }
        }).catch((err)=>{
            toast.error('Internal Server Error')
        })
        e.preventDefault()
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
            <h1 className="title" style={{textAlign:"center"}}><RiFlightTakeoffFill/> Fly Easy</h1>
            <br></br>
            <div className="row">
                    <br></br>
                    <div className="col-md-4"></div>
                    <div className="col-md-4">
                        <form onSubmit={addschedule}>
                                <div className='form-group'>
                                    <label>Flight ID :</label>
                                    <input type="text" className='form-control' onChange={(e)=>setId(e.target.value)} required></input>
                                </div>
                                <br></br>
                                <div className='form-group'>
                                    <label>Flight Name :</label>
                                    <input type="text" className='form-control' value={name} onChange={(e)=>setName(e.target.value)} required></input>
                                </div>
                                <br></br>
                                <div className='form-group'>
                                    <label>Description :</label>
                                    <input type="text" className='form-control' value={description} onChange={(e)=>setDescription(e.target.value)} required></input>
                                </div>
                                <br></br>
                                <div className='form-group'>
                                    <label>From :</label>
                                    <input type="text" className='form-control'value={fromlocation} onChange={(e)=>setFromLocation(e.target.value)} required></input>
                                </div>
                                <br></br>
                                <div className='form-group'>
                                    <label>To :</label>
                                    <input type="text" className='form-control' value={tolocation} onChange={(e)=>setToLocation(e.target.value)} required></input>
                                </div>
                                <br></br>
                                <div className='form-group'>
                                    <label>Departure Time :</label>
                                    <input type="datetime-local" className='form-control' value={departuretime} onChange={(e)=>setDepartureTime(e.target.value)} required></input>
                                </div>
                                <br></br>
                                <div className='form-group'>
                                    <label>Arrival Time :</label>
                                    <input type="datetime-local" className='form-control' value={arrivaltime} onChange={(e)=>setArrivalTime(e.target.value)} required></input>
                                </div>
                                <br></br>
                                <div className='form-group'>
                                    <label>Ticket Price :</label>
                                    <input type="number" className='form-control' onChange={(e)=>setPrice(e.target.value)} required></input>
                                </div>
                                
                                <br></br>
                                <center>
                                    <button className='btn btn-primary' type="submit">Add Schedule</button>
                                </center>
                                <br></br>
                        </form>
                        </div>
                    <div className='col-md-4'></div>
            </div>
            </div>:<UnAuthorized/>}
            </div>}
            <ToastContainer/>
        </div>
    )
}


export const AddExistingFlightSchedule=()=>{

    const navigate=useNavigate()
    const [loading,setLoading]=useState(false)

    const [id,setId]=useState(0)
    const [fromlocation,setFromLocation]=useState("")
    const [tolocation,setToLocation]=useState("")
    const [departuretime,setDepartureTime]=useState("")
    const [arrivaltime,setArrivalTime]=useState("")
    const [price,setPrice]=useState(0)

    useEffect(()=>{
        if(!localStorage.getItem("airlines_token")){
            setLoading(false)
            setTimeout(()=>{
                navigate("/login")
            },3000)
        }
    },[])

    //To calculate duration between departure and arrival time
    const calculateDuration = () => {
        const start = new Date(departuretime)
        const end = new Date(arrivaltime)
        const durationInMilliseconds = end - start
        const millisecondsPerMinute = 1000 * 60
        const millisecondsPerHour = 1000 * 60 * 60
        const millisecondsPerDay = 1000 * 60 * 60 * 24

        const days = Math.floor(durationInMilliseconds / millisecondsPerDay)
        const hours = Math.floor((durationInMilliseconds % millisecondsPerDay) / millisecondsPerHour)
        const minutes = Math.floor((durationInMilliseconds % millisecondsPerHour) / millisecondsPerMinute)

        let durationString = ""
        if (days > 0) {
            durationString += days + " day" + (days > 1 ? "s" : "") + " "
        }
        if (hours > 0) {
            durationString += hours + " hour" + (hours > 1 ? "s" : "") + " "
        }
        if (minutes > 0) {
            durationString += minutes + " minute" + (minutes > 1 ? "s" : "") + " "
        }
        console.log(durationString)
        return durationString.trim()
    }



    const addschedule=(e)=>{
        const flightdetails={
            flight_id:id,
            from_location:fromlocation,
            to_location:tolocation,
            departure_time:departuretime,
            arrival_time:arrivaltime,
            duration:calculateDuration(),
            ticket_price:price
        }

        axios.post('/admin/flight/addschedule',flightdetails).then((res)=>{
            if(res.data.status){
                toast.success(res.data.msg)
            }
            else{
                toast.warning(res.data.msg)
            }
        }).catch((err)=>{
            toast.error('Internal Server Error')
        })
        e.preventDefault()
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
            <h1 className="title" style={{textAlign:"center"}}><RiFlightTakeoffFill/> Fly Easy</h1>
            <br></br>
            <div className="row">
                    <br></br>
                    <div className="col-md-4"></div>
                    <div className="col-md-4">
                        <form onSubmit={addschedule}>
                                <div className='form-group'>
                                    <label>Flight ID :</label>
                                    <input type="text" className='form-control' onChange={(e)=>setId(e.target.value)} required></input>
                                </div>
                                <br></br>
                                <div className='form-group'>
                                    <label>From :</label>
                                    <input type="text" className='form-control'value={fromlocation} onChange={(e)=>setFromLocation(e.target.value)} required></input>
                                </div>
                                <br></br>
                                <div className='form-group'>
                                    <label>To :</label>
                                    <input type="text" className='form-control' value={tolocation} onChange={(e)=>setToLocation(e.target.value)} required></input>
                                </div>
                                <br></br>
                                <div className='form-group'>
                                    <label>Departure Time :</label>
                                    <input type="datetime-local" className='form-control' value={departuretime} onChange={(e)=>setDepartureTime(e.target.value)} required></input>
                                </div>
                                <br></br>
                                <div className='form-group'>
                                    <label>Arrival Time :</label>
                                    <input type="datetime-local" className='form-control' value={arrivaltime} onChange={(e)=>setArrivalTime(e.target.value)} required></input>
                                </div>
                                <br></br>
                                <div className='form-group'>
                                    <label>Ticket Price :</label>
                                    <input type="number" className='form-control' onChange={(e)=>setPrice(e.target.value)} required></input>
                                </div>
                                
                                <br></br>
                                <center>
                                    <button className='btn btn-primary' type="submit">Add Schedule</button>
                                </center>
                                <br></br>
                        </form>
                        </div>
                    <div className='col-md-4'></div>
            </div>
            </div>:<UnAuthorized/>}
            </div>}
            <ToastContainer/>
        </div>
    )
}


