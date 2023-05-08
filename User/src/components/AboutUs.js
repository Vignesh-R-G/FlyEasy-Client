import React,{useState,useEffect} from 'react'
import {RiFlightTakeoffFill} from 'react-icons/ri'
import { NavigationBar } from './Navbar'
import flight_image from '../images/flight.webp'
import flight_image2 from '../images/flightimage2.jpg'
import flight_image3 from '../images/flightimage3.jpg'
import { Loading } from './Loading'

export const AboutUs=()=>{
    const [loading,setLoading]=useState(true)
    useEffect(()=>{
        setTimeout(()=>{
            setLoading(false)
        },1000)
    },[])
    return(
        <div className='container-fluid'>
                {loading?
                <Loading/>
                :<div>
                <NavigationBar/>
                <br></br>
                <br></br>
                <br></br>
                <h1 className="title"><RiFlightTakeoffFill/> Fly Easy</h1>
                <br></br>
                <br></br>
                <p>Welcome to our flight booking application! Our mission is to make it easy and affordable for you to travel the world. Whether you're planning a family vacation, a romantic getaway, or a business trip, we've got you covered.
                Our team is made up of experienced travelers who understand the challenges of booking flights and navigating the travel industry. We've used our knowledge and expertise to create a platform that simplifies the process and helps you find the best deals on flights and travel packages.
                At our core, we are committed to providing you with a seamless and enjoyable travel experience. We believe that travel should be accessible to everyone, regardless of budget or background. That's why we offer a range of services and resources to help you plan your trip and make the most of your travel budget.
                Our platform features a powerful search engine that allows you to quickly compare prices and find the best deals on flights from hundreds of airlines and travel agencies around the world. We also offer a range of additional services, including hotel bookings, car rentals, and travel insurance, to help you plan your entire trip from start to finish.
                We know that travel plans can change, which is why we offer a flexible cancellation policy and 24/7 customer support. Our team is always available to answer your questions and help you navigate any issues that may arise during your travels.
                Thank you for choosing our flight booking application. We look forward to helping you plan your next adventure!

                </p>
                <div className='row'>
                    <div className='col-md-4'>
                        <img src={flight_image} className='image' width="400" height="300"/>
                    </div>
                    <div className='col-md-4'>
                        <img src={flight_image2} className='image' width="400" height="300"/> 
                    </div>
                    <div className='col-md-4 image'>
                        <img src={flight_image3} className='image' width="400" height="300"/>
                    </div>
                </div>
                </div>}
        </div>
    )
}