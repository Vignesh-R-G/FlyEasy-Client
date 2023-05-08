import React,{useContext, useEffect,useState} from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';

import { ToastContainer, toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import '../bootstrap.min.css'
import {context} from './Context';
import '../css/Navbar.css'
import {FiLogIn} from 'react-icons/fi'
import {BiUser} from 'react-icons/bi'
import {BiLogOut} from 'react-icons/bi'
import axios from "../axios/Axios";

export const NavigationBar=()=> {

  const navigate=useNavigate()
  const cont=useContext(context)
  
  useEffect(()=>{
    if(!cont.verifylogin){
      cont.setVerifyLogin(!cont.verifylogin)
      if(localStorage.getItem("airlinesuser_token")){
        const token_user=localStorage.getItem("airlinesuser_token")
        axios.get(`/user/auth/verifytoken/${token_user}`).then((res)=>{
          console.log(res.data)
          if(res.data.status){
            cont.setUserName(res.data.name)
            console.log(res.data.name)
            cont.setUserEmail(res.data.email)
          }
          else{ 
            toast.warning("Session Expired")
            localStorage.removeItem("airlines_token")
            navigate("/login")
          }
        })
      }
    }
  },[])

   return (
    <div className="container-fluid navbar">
    <Navbar bg="light" expand="lg" fixed="top">
      <div className='container-fluid'>
      <LinkContainer to="/">
        <Navbar.Brand>Fly Easy</Navbar.Brand>
      </LinkContainer>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto my-2 my-lg-0">
          <LinkContainer to="/">
            <Nav.Link>BookFlight</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/mybookings">
            <Nav.Link>MyBookings</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/aboutus">
            <Nav.Link>About Us</Nav.Link>
          </LinkContainer>
          </Nav>
          
          <div className="d-flex gap-3">
            {localStorage.getItem("airlinesuser_token")?
                   <span id="username">Hello {cont.username}</span> :""}
            {localStorage.getItem("airlinesuser_token")?
            "":
            <LinkContainer to="/register">
                <Nav.Link><FiLogIn/>SignUp</Nav.Link>
            </LinkContainer>
            }
            {localStorage.getItem("airlinesuser_token")?
            <LinkContainer to="/logout" id="logout">
                <Nav.Link><BiLogOut/>Logout</Nav.Link>
            </LinkContainer>:
            <LinkContainer to="/login">
                <Nav.Link><FiLogIn/>Login</Nav.Link>
            </LinkContainer>
            }
            
            
            
            
            
          </div>
        
      </Navbar.Collapse>
      </div>
      <ToastContainer/>
    </Navbar>
    </div>
  );
}




