import React from 'react'
import { BarLoader } from 'react-spinners';
import '../css/UnAuthorized.css'

export const UnAuthorized=()=>{
    return(
        <div>
                <br></br>
                <br></br>
                <br></br>
                <center>
                        <div className='unauth'>
                            <h2>Please Login to Proceed !</h2>
                            <br></br>
                            <h2>Redirecting to Login Page !</h2>
                            <br></br>
                            <br></br>
                            <div className="bar_loading">
                                <BarLoader
                                size={100}
                                color="green"
                                />
                            </div>
                        </div>
                </center>
        </div>
    )
}