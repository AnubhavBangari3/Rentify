
import Button from 'react-bootstrap/Button';

import React,{useState,useEffect} from 'react';
import { useHistory } from 'react-router-dom'
import {useCookies} from 'react-cookie';

function Login() {
    let history=useHistory();

    const [username,setUsername]=useState('');
    const [password,setPassword]=useState('');

    const [token,setToken]=useCookies(["access_token"])
    const [tokenR,setTokenR]=useCookies(["refresh_token"])

    const loginButton = async () =>{
        //if (existProfile.includes(username)){
    
          try{
          
    
            const data={
              username:username,
              password:password
            }
    
            console.log("Data login:",data)
    
            const response = await fetch('http://127.0.0.1:8000/api/token/',{
              method:"POST",
              headers: {
                  'Content-Type': 'application/json',
                },
                body:JSON.stringify(data),
            });
            console.log("response:",response)
    
            if (response.ok){
              const responseData = await response.json();
              setToken("access_token", responseData.access);
              setTokenR("refresh_token", responseData.refresh);
              //alert("Login Successful")
              console.log(token)
              // if (responseData['access_token']){
              //   history.push('/profile/')
              // }
              history.push('/profile/');
              window.location.reload();
          }
          else{
              alert("Login Failed")
              console.log("Error while login 1")
          }
    
          }
          catch{
            alert("Login error")
            console.log("Error while login 2")
          }
    
    
        // }
        // else{
        //   alert("Username is Incorrect")
        // }
    
    
    
      }
    

    return (
        <div className="Login">
            <div className="logintop">
                <h1><b>RENTIFY LOGIN</b></h1>
            </div>
            <div className="loginMiddle my-4">

            <div>
                <input type="text" className="form-control" name="username" id="username" value={username}
            onChange={e => setUsername(e.target.value)}  placeholder="Username"/>
            </div>
            <br/>
            <div>
                <input type="password" className="form-control" name="password" id="password" alue={password}
            onChange={e=>setPassword(e.target.value)} placeholder="Password"/>
            </div>

            <br/>

            
          <br/>

            </div>
            <div className="loginBottom my-2">
            <div>
            {(username && password)?<button className="loginButton btn btn-primary w-100" onClick={()=>loginButton()}>Login</button>:<button className="loginButton btn btn-warning w-100">Please fill the details</button>}

            </div>
            <div className="or-divider my-2">
                    <span className="line"></span>
                    <span className="text">OR</span>
                    <span className="line"></span>
            </div>
            <div>
            <Button className="btn my-2 w-100" variant="dark" onClick={() => 
            {history.push('/register/')
            window.location.reload()}}>Register</Button>
            </div>

            </div>

        </div>
    )
}

export default Login
