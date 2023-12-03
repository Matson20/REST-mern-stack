import React, { useState, useEffect } from 'react';
// We import bootstrap to make our application look better.
import "bootstrap/dist/css/bootstrap.css";
 // We import NavLink to utilize the react router.
import { NavLink, useNavigate } from "react-router-dom";
import axios from 'axios';
import Login from "./login"
import { Typography, Button } from "@mui/material";

 // Here, we display our Navbar
export default function Navbar() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  let navigate = useNavigate();

  useEffect(() => {
    const retrieveUser = async () => {
      try {
        const user = await localStorage.getItem('user');
        const username = JSON.parse(user);
        setCurrentUser(username?.username || null);
        setLoading(false);
        return username;
      } catch (error) {
        console.error('Error retrieving id:', error);
        setLoading(false);
        return null;
      }
    };

    retrieveUser();
  }, []);

  const routeChange = () => {
    let path = '/login';
    navigate(path);
  };

  const routeCreate = () => {
    let path = '/create';
    navigate(path);
  };

 return (
   <div>
     <nav className="navbar navbar-expand-lg navbar-light bg-light">
       <NavLink className="navbar-brand" to="/">
       <img style={{"width" : 25 + '%'}} src="https://d3cy9zhslanhfa.cloudfront.net/media/3800C044-6298-4575-A05D5C6B7623EE37/4B45D0EC-3482-4759-82DA37D8EA07D229/webimage-8A27671A-8A53-45DC-89D7BF8537F15A0D.png"></img>
       </NavLink>
       <Typography variant='h4'>Hello {currentUser}</Typography>
       <Button variant="contained"
        onClick={routeChange}>
          Login
       </Button>
       <Button variant="contained"
        onClick={routeCreate}>
          Create Record
       </Button>
     </nav>
   </div>
 );
}