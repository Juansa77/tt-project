/* eslint-disable react/no-unknown-property */

import Hamburger from "./Hamburger";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";

const NavBar = () => {
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const { user, logOut } = useAuth();
  console.log(user);

  const toogleHamburger = () => {
    setHamburgerOpen(!hamburgerOpen);
  };

  return (
    <div className="navigation">
      <ul>
        <li>
          <NavLink to="/"><h3>Home</h3></NavLink>
        </li>

        <li>
          <NavLink to="/games"><h3>Game search</h3></NavLink>
        </li>
        <li>
          <NavLink to="/search-friends"><h3>Search friends</h3></NavLink>
        </li>
        <li>
          <NavLink to="/places"><h3>Places to play</h3></NavLink>
        </li>
        <li>
          <NavLink to="/register"><h3>Register</h3></NavLink>
        </li>
        {user !== null ? (
          <li>
            <NavLink to="/profile"><h3>Profile</h3></NavLink>
          </li>
        ) : (
          <li>
            <NavLink to="/login"><h3>Login</h3></NavLink>
          </li>
        )}
        {user !== null && (
          <li>
            <h3 className="iconNav iconLogout" onClick={() => logOut()}>
              Log out
            </h3>
          </li>
        )}
      </ul>
      <div onClick={toogleHamburger}>
        <Hamburger isOpen={hamburgerOpen} />
      </div>

      <style jsx>{`
        .navigation {
        
          min-width: 100vw;
          height: 5vh;
          margin-bottom: 10vh;
          color:beige;
          background-color: transparent;
          position:fixed;
          font-weight: 900;
          top:0;
          margin-bottom: 5%;
          z-index:1;
          padding:1vh;
          font-size:1.5vh;
        
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

     h3{cursor:pointer;}

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
