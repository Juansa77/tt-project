/* eslint-disable react/no-unknown-property */

import Hamburger from "./Hamburger";
import { useState } from "react";
import { NavLink } from 'react-router-dom';

const NavBar = () => {
  const [hamburgerOpen, setHamburgerOpen] = useState(false);

  const toogleHamburger = () => {
    setHamburgerOpen(!hamburgerOpen);
  };

  return (
    <div className="navigation">
      <ul>
      
        <li><NavLink to="/">HOME</NavLink></li>
        
        <li><NavLink to="/games">GAME SEARCH</NavLink></li>
        <li><NavLink to="/search-friends">SEARCH FRIENDS</NavLink></li>
        <li><NavLink to="/places">PLACES TO PLAY</NavLink></li>
        <li><NavLink to="/register">REGISTER</NavLink></li>
        <li><NavLink to="/login">LOGIN</NavLink></li>
      </ul>
      <div  onClick={toogleHamburger}>
        <Hamburger isOpen={hamburgerOpen} />
      </div>

      <style jsx>{`
        .navigation {
        
          min-width: 100vw;
          height: 5vh;
          margin-bottom: 10vh;
          color:beige;
          background-color: #FF4500;
          position:fixed;
          top:0;
          margin-bottom: 5%;
          z-index:1;
        
        }

        .navigation ul {
          display: flex;
              justify-content: space-around;
              aling-content:center:
              margin: 0 20px;
              padding: 0 25px;
              transition:  0.2s ease-in-out;
       
        }
        .navigation ul li {
          list-style-type: none;
              max-width: 100%;
             
           
        }

        .navigation li a{
          color:beige;
          text-decoration:none;
        }

        .navigation li a:hover {
          text-decoration: underline;
              }

     

        @media (max-width: 767px) {
          .hamburger {
            display: fixed;
            float: right;
            padding-top: 10px;
            width:5vw;
            z-index: 6;
          }

       
          .navigation ul {
            display: ${hamburgerOpen ? "inline" : "none"};
            text-align:left;
            padding:5vh;
            background: #363636; 
            color: beige;
            z-index:10;
            height: 100vh;
            width: 70vw;
            margin-top: 56px;
            position: fixed;
            transition: all 0.3s linear;
          
          }

          .navigation ul li{
            margin-top:1vh;
          }

          .navigation ul li:hover{
            background-color: white;
            color:black;
 
          }

          .burger{

            width:${hamburgerOpen ? "3rem" : "3rem"};
            transition:  0.2s ease-in-out;


          }
        }
      `}</style>
    </div>
  );
};

export default NavBar;
