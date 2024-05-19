import React,{useState,useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import {useCookies} from 'react-cookie';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

const NavbarDetail = () => {
  const history = useHistory();
  const [token,setToken,removeToken]=useCookies(["access_token"])
  const [tokenR,setTokenR,removeTokenR]=useCookies(["refresh_token"])



  const logginOut = () =>{
    

    
    fetch('http://127.0.0.1:8000/logout',{
      method:'POST',
      headers:{
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token['access_token']}`
      },
      body:JSON.stringify({
        refresh_token:` ${tokenR['refresh_token']}`
      })
    })
    .then(() => {
      
      console.log("Before Refresh:",tokenR['refresh_token'])
      
      removeToken('access_token',{path:'/'});
      removeTokenR('refresh_token',{path:'/'});
      
      console.log("After Refresh:",tokenR['refresh_token'])
      
      window.location.replace('http://localhost:3000/');
      

        
    })
    .catch(error=>console.log(error))
   
  }

  


return(
  <div>
     <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home">Rentify</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">

          <Nav.Link  onClick={  ()=>{
        history.push('/profile/')
        window.location.reload()
      }}>Profile</Nav.Link>
        <Nav.Link  onClick={  ()=>{
        history.push('/properties/')
        window.location.reload()
      }}>Properties</Nav.Link>
        <Nav.Link onClick={logginOut}>Logout</Nav.Link>


            
            {/* <NavDropdown title="Profile" id="basic-nav-dropdown">
             <NavDropdown.Item href="#action/3.1" onClick={  ()=>{
        history.push('/profile/')
        window.location.reload()
      }}>Profile</NavDropdown.Item>
              
              <NavDropdown.Divider />
              <NavDropdown.Item>
                
                  <button className="btn btn-secondary" onClick={logginOut}>Logout</button>
               
              </NavDropdown.Item>
            </NavDropdown> */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
     
  </div>
)
}

export default NavbarDetail