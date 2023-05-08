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


export const MyBookings=()=>{
    const [loading,setLoading]=useState(true)
    const [details,setDetails]=useState([])
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
            setDetails([])
            getAllBookings()
        }
    },[])


    const getAllBookings=()=>{
        setLoading(true)
        axios.get(`/user/history/getbookinghistory/${cont.useremail}`).then((res)=>{
            if(res.data.status){
                getBookingDetails(res.data.msg)
            }
            else{
                toast.warning(res.data.msg)
                setLoading(false)
            }
        }).catch((err)=>{
            console.log(err)
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

      
    const clearhistory=(booking_id)=>{
        axios.delete(`/user/history/clearspecificbookinghistory/${booking_id}`).then((res)=>{
            if(res.data.status){
                toast.success('History Cleared Successfully')
                setDetails([])
                getAllBookings()
            }
        }).catch((err)=>{
            toast.error('Internal Server Error')
        })
    }

    const clearEntireHistory=()=>{
        axios.delete(`/user/history/clearbookinghistory/${cont.useremail}`).then((res)=>{
            if(res.data.status){
                toast.success('History Cleared Successfully')
                setDetails([])
                getAllBookings()
            }
        }).catch((err)=>{
            toast.error('Internal Server Error')
        })
    }

    const modifyseats=(schedule_id,number_of_persons)=>{
        const data={
            schedule_id:schedule_id,
            number_of_persons:number_of_persons
        }
        axios.put('/admin/seating/modifyseatswhencancelling',data).then((res)=>{
            if(res.data.status){
                setDetails([])
                getAllBookings()
            }
        }).catch((err)=>{
            toast.error('Internal Server Error')
        })
    }

    const cancelbooking=(booking_id,schedule_id,number_of_persons)=>{
        axios.delete(`/user/passenger/cancelticket/${booking_id}`).then((res)=>{
            if(res.data.status){
                toast.success('Booking cancelled successfully')
                modifyseats(schedule_id,number_of_persons)
            }
        }).catch((err)=>{
            toast.error('Internal Server Error')
        })
    }

      console.log(details)
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
                {details.length===0?<h3 style={{textAlign:"center",color:"blueviolet"}}>No Bookings Found</h3>:<div>
                <center>
                    <div className='passenger'>
                        <h5 className='title'>Need to Clear Entire History ?</h5>
                        <button onClick={clearEntireHistory} className='btn btn-success'>Clear Entire History</button>
                    </div>
                </center>
                <br></br>
                <br></br>
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
                    <Table responsive striped bordered hover>
                        <thead>
                            <tr>
                                <th style={{color:"green"}}>Action :</th>
                                <th><button onClick={()=>clearhistory(x[0].Booking_Id)} className='btn btn-primary'>Clear History</button></th>
                                <th><button onClick={()=>cancelbooking(x[0].Booking_Id,x[0].Schedule_Id,x[0].Number_Of_Passengers)} className='btn btn-success'>Cancel Booking</button></th>
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