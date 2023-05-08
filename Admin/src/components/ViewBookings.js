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

export const ViewBookings=()=>{
    const [loading,setLoading]=useState(true)
    const [details,setDetails]=useState([])
    const [flightid,setFlightId]=useState(0)
    const [date,setDate]=useState("")
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
            cont.setFilterDetails([])
            setDetails([])
            getAllBookings()
        }
    },[])

    const getAllBookings=()=>{
        axios.get('/admin/booking/getallbookingdetails').then((res)=>{
            if(res.data.status){
                getBookingDetails(res.data.msg)
            }
            else{
                toast.warning(res.data.msg)
                setLoading(false)
            }
        }).catch((err)=>{
            toast.error('Internal Server Error')
            setLoading(false)
        })
    }

    const getBookingDetails = async (data) => {
        const lst = []
        let count = 0
        for (const x of data) {
          for (const y of x) {
            try {
              const res1 = await axios.get(`/user/passenger/getbookingdetails/${y.Booking_Id}`)
              if (res1.data.status) {
                y.Booking_Email = res1.data.msg.Booking_Email
                y.Number_Of_Passengers = res1.data.msg.Number_Of_Passengers
                y.Schedule_Id = res1.data.msg.Schedule_Id
                y.Booking_Date = res1.data.msg.Booking_Date
      
                try {
                  const res2 = await axios.get(`/admin/flight/getscheduledetails/${y.Schedule_Id}`)
                  if (res2.data.status) {
                    console.log(res2.data)
                    y.From_Location = res2.data.msg.From_Location
                    y.To_Location = res2.data.msg.To_Location
                    y.Flight_Name = res2.data.msg.Flight_Name
                    y.Flight_Id = res2.data.msg.Flight_Id
                    y.Departure_Time=res2.data.msg.Departure_Time
                    y.Ticket_Price=res2.data.msg.Ticket_Price
                  } else {
                    setLoading(false)
                  }
                } catch (err) {
                  toast.error("Internal Server Error");
                  setLoading(false)
                }
              } else {
                setLoading(false)
              }
            } catch (err) {
              toast.error("Internal Server Error")
              setLoading(false)
            }
          }
          lst.push(x)
          count = count + 1
          if (count === data.length) {
            setDetails(lst)
            setLoading(false)
          }
        }
      }

      const getFilterBookingDetails = async (data) => {
        const lst = []
        let count = 0
        for (const x of data) {
          for (const y of x) {
            try {
              const res1 = await axios.get(`/user/passenger/getbookingdetails/${y.Booking_Id}`)
              if (res1.data.status) {
                y.Booking_Email = res1.data.msg.Booking_Email
                y.Number_Of_Passengers = res1.data.msg.Number_Of_Passengers
                y.Schedule_Id = res1.data.msg.Schedule_Id
                y.Booking_Date = res1.data.msg.Booking_Date
      
                try {
                  const res2 = await axios.get(`/admin/flight/getscheduledetails/${y.Schedule_Id}`)
                  if (res2.data.status) {
                    console.log(res2.data)
                    y.From_Location = res2.data.msg.From_Location
                    y.To_Location = res2.data.msg.To_Location
                    y.Flight_Name = res2.data.msg.Flight_Name
                    y.Flight_Id = res2.data.msg.Flight_Id
                    y.Departure_Time=res2.data.msg.Departure_Time
                    y.Ticket_Price=res2.data.msg.Ticket_Price
                  } else {
                    setLoading(false)
                  }
                } catch (err) {
                  toast.error("Internal Server Error");
                  setLoading(false)
                }
              } else {
                setLoading(false)
              }
            } catch (err) {
              toast.error("Internal Server Error")
              setLoading(false)
            }
          }
          lst.push(x)
          count = count + 1
          if (count === data.length) {
            cont.setFilterDetails(lst)
            navigate('/filterbookings')
            setLoading(false)
          }
        }
      }
      
    const isflightexist=(e)=>{
        axios.get(`/admin/flight/isflightexist/${flightid}`).then((res)=>{
            if(res.data.status){
                filter()
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
    
    const filter=()=>{
        axios.get(`/admin/booking/getspecificbookings/${flightid}/${date}`).then((res)=>{
            if(res.data.status){
                getFilterBookingDetails(res.data.msg)
            }
            else{
                toast.warning(res.data.msg)
                setLoading(false)
            }
        }).catch((err)=>{
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
                <div className="row">
                            <div className='col-md-4'></div>
                            <div className='col-md-4 filter'>
                                <br></br>
                                <form onSubmit={isflightexist}>
                                <div className='form-group'>
                                    <label style={{color:'green',fontWeight:'bold',fontFamily:'sans-serif'}}> Flight ID : </label>
                                    <input type="number" placeholder='Enter Flight ID' onChange={(e)=>setFlightId(e.target.value)} className="form-control" required></input>
                                </div>
                                <br></br>
                                <div className='form-group'>
                                    <label style={{color:'green',fontWeight:'bold',fontFamily:'sans-serif'}}> Departure Time : </label>
                                    <input type="datetime-local" placeholder='Enter departure Date-Time' onChange={(e)=>setDate(e.target.value)} className="form-control" required></input>
                                </div>
                                <br></br>
                                <button className='btn btn-success'>Filter</button>
                                </form>
                            </div>
                            <div className='col-md-4'></div>
                </div>
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
                                <th style={{color:"blue"}}>₹ {x[0].Ticket_Price}</th>
                                <th style={{color:"green"}}>Total Price</th>
                                <th style={{color:"blue"}}>₹ {x[0].Ticket_Price*x[0].Number_Of_Passengers}</th>
                            </tr>
                        </thead>
                    </Table>
                    <br></br>
                    <br></br>
                </div>)}
                </div>}
                </div>:<UnAuthorized/>}
            </div>}
            <ToastContainer/>
        </div>
    )
}