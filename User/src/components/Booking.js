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

export const Booking=()=>{

    const [loading,setLoading]=useState(true)
    const [numberofpassengers,setNumberOfPassengers]=useState(0)
    const passengerlist=[]
    const [name,setName]=useState("")
    const [email,setEmail]=useState("")
    const [age,setAge]=useState(0)
    const [mno,setMno]=useState(0)
    const [flag,setFlag]=useState(false)
    const navigate=useNavigate()
    const cont=useContext(context)
    const passengers=[]
    const details=cont.bookdetails

    console.log(details)

    useEffect(()=>{
        if(!localStorage.getItem("airlinesuser_token")){
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

    const changePassenger=(index,value,field)=>{
        passengerlist[index][field]=value
    }

    const makehistory=(x)=>{
        const data={
            booking_email:cont.useremail,
            booking_id:x
        }
        axios.post('/user/history/addbookinghistory',data).then((res)=>{
            if(res.data.status)
                console.log('History Added Successfully')
        }).catch((err)=>{
            toast.error('Internal Server Error')
        })
    }

    const book=()=>{
        const data={
            booking_email:cont.useremail,
            number_of_passengers:numberofpassengers,
            schedule_id:details[0]._id,
            booking_details:passengerlist
        }
        axios.post('/user/passenger/booktickets',data).then((res)=>{
            if(res.data.status){
                toast.success(res.data.msg)
                makehistory(res.data.booking_id)
            }
        }).catch((err)=>{
            toast.error('Internal Server Error')
        })
    }

    const updateSeating=()=>{
        const data={
            schedule_id:details[0]._id,
            number_of_persons:numberofpassengers
        }
        axios.put('/admin/seating/modifyseatswhenbooking',data).then((res)=>{
            if(res.data.status){
                book()
            }
            else{
                toast.warning(res.data.msg)
            }
        }).catch((err)=>{
            toast.error('Internal Server Error')
        })
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
                <br></br>
                {details.length===0?<h3 style={{textAlign:"center",color:"blueviolet"}}>No Flights Found</h3>:
                    <div>
                        {details.map((x,index)=><div>
                            <h3 className='title'>Flight Details</h3>
                            <br></br>
                            <br></br>
                            <Table responsive striped bordered hover>
                                <thead>
                                    <tr>
                                        <th style={{color:"green"}}>Flight ID</th>
                                        <th style={{color:"green"}}>Flight Name</th>
                                        <th style={{color:"green"}}>Details</th>
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
                                    </tr>
                                    
                                </thead>
                            </Table>
                            <Table responsive striped bordered hover>
                                <thead>
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
                        <br></br>
                        <h3 className='title'>Passenger Details</h3>
                        <br></br>
                        {flag?
                        <div className='row'>
                        <div className='col-md-2'></div>
                        <div className='col-md-8'>
                        <div className='passenger'>
                                    { 
                                        (() => {
                                            for (let i = 0; i < numberofpassengers; i++) {
                                              passengers.push(
                                                <div>
                                                  <h3 className='title'>Passenger {i+1} Details :</h3>
                                                  <br></br>
                                                  <label>Passenger {i+1} Name:</label>
                                                  <input type="text" onChange={(e)=>changePassenger(i,e.target.value,"person_name")} placeholder="Required" className='form-control' required/>
                                                  <label>Passenger {i+1} Email:</label>
                                                  <input type="text" onChange={(e)=>changePassenger(i,e.target.value,"person_email")} className='form-control'/>
                                                  <label>Passenger {i+1} MobileNumber:</label>
                                                  <input type="text" onChange={(e)=>changePassenger(i,e.target.value,"mobile_num")} className='form-control'/>
                                                  <label>Passenger {i+1} Age:</label>
                                                  <input type="text" onChange={(e)=>changePassenger(i,e.target.value,"age")} placeholder="Required" className='form-control' required/>
                                                  <br></br>
                                                </div>
                                              )
                                              const obj={}
                                              passengerlist.push(obj)
                                            }
                                            return passengers
                                          })()
                                    }
                                    <center>
                                        <h5 className='title'>Total Price ₹ {numberofpassengers*details[0].Ticket_Price}</h5>
                                        <br></br>
                                        <button className='btn btn-success' onClick={updateSeating}>Book Ticket</button>
                                    </center>
                                </div>
                                </div>
                        </div>:
                        <div className='row'>
                            <div className='col-md-4'></div>
                            <div className='col-md-4'>
                                <form onSubmit={()=>setFlag(true)} className='passenger'>
                                    <div className='form-group'>
                                        <label style={{color:'green',fontWeight:'bold',fontFamily:'sans-serif'}}>Number of Passengers :</label>
                                        <input type="number" onChange={(e)=>setNumberOfPassengers(e.target.value)} placeholder="Enter the number of Passengers" className='form-control'></input>
                                    </div>
                                    <br></br>
                                    <button type="submit" className='btn btn-success'>Submit</button>
                                </form>
                            </div>
                            <div className='col-md-4'></div>
                        </div>}
                        <br></br>
                    </div>}
                    </div>:<UnAuthorized/>}
            </div>}
            <ToastContainer/>
        </div>
    )
}