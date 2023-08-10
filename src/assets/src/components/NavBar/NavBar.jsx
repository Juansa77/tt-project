/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unknown-property */

import Hamburger from "./Hamburger";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import { useUserContext } from "../../contexts/UserContext";
import { getAllChats } from "../../services/API_USER/message.service";
import "./NavBar.css";

const NavBar = () => {
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const { user, logOut } = useAuth();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false); //
  const { totalMessages, setTotalMessages } = useUserContext();
  const [responseChats, setResponseChats] = useState();

  console.log(totalMessages);

  //* ---LÓGICA PARA CONTAR EL NÚMERO DE MENSAJES SIN LEER EN CASO QUE SEA NULL--------

  useEffect(() => {
    if (totalMessages == null && user?.id) {
      console.log("hace la llmada");
      const fetchChats = async (user) => {
        const responseChats = await getAllChats(user);
        setResponseChats(responseChats);
      };

      fetchChats(user.id);
    }
  }, []);
  if (totalMessages == null && user?.id) {
    const countUnreadMessages = responseChats?.reduce((count, mensaje) => {
      if (mensaje?.receiver === user?.id && mensaje?.isRead === false) {
        return count + 1;
      }
      return count;
    }, 0);

    setTotalMessages(countUnreadMessages);

console.log(responseChats)
  }
  console.log(totalMessages);
  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
  };
  console.log(user);

  const toogleHamburger = () => {
    setHamburgerOpen(!hamburgerOpen);
  };
  useEffect(() => {
    setProfileMenuOpen(!true);
  }, []);

  return (
    <div className="navigation">
      <ul>
        <li>
          <NavLink to="/">
            <h3>HOME</h3>
          </NavLink>
        </li>

        <li>
          <NavLink to="/games">
            <h3>GAME SEARCH</h3>
          </NavLink>
        </li>
        <li>
          <NavLink to="/search-friends">
            <h3>SEARCH FRIENDS</h3>
          </NavLink>
        </li>

        <li>
          {!user && (
            <NavLink to="/register">
              <h3>REGISTER</h3>
            </NavLink>
          )}
        </li>
        {user !== null ? (
          <li>
            <div className="profileContainer2">
              <div className="userProfileBadge">
                <img
                  className="userProfilePic"
                  src={user.image}
                  onClick={toggleProfileMenu}
                />
                {totalMessages > 0 && (
                  <div className="contentBadge">
                    <p>{totalMessages}</p>
                  </div>
                )}
              </div>
              {profileMenuOpen && (
                <div
                  className={`profileSubMenu ${
                    profileMenuOpen ? "active" : ""
                  }`}
                >
                  <NavLink to="/profile" onClick={toggleProfileMenu}>
                    Profile
                  </NavLink>
                  <NavLink
                    to={`/messages/${user.id}`}
                    onClick={toggleProfileMenu}
                  >
                    Messages{" "}
                    {totalMessages > 0 && (
                      <p className="MsgAnchorText">{totalMessages} new</p>
                    )}
                  </NavLink>
                  <NavLink to="/passwordchange" onClick={toggleProfileMenu}>
                    Account
                  </NavLink>

                  <span className="logOutText" onClick={() => logOut()}>
                    Log out
                  </span>
                </div>
              )}
            </div>
          </li>
        ) : (
          <li>
            <NavLink to="/login">
              <h3>LOGIN</h3>
            </NavLink>
          </li>
        )}
      </ul>
      <div onClick={toogleHamburger}>
        <Hamburger isOpen={hamburgerOpen} />
      </div>

      <style jsx>{`
        .navigation {
        
          min-width: 100vw;
          height: 7vh;
          margin-bottom: 10vh;
          color:beige;
          background: #363636;
          -webkit-backdrop-filter: blur(5px);
          position:fixed;
          font-weight: 900;
          top:0;
          margin-bottom: 5%;
          z-index:1;
          padding:1vh;
          font-size:1.5vh;
        
        }

.logOutText{
  cursor:pointer;
}

.logOutText:hover {
     
     color:#33FCFF;
                 }

.profileSubMenu{
  position: absolute;
  top: 90%;
  background-color: #363636;
  color: beige;
  border-radius: 0 0 5px 5px; /* Aplicar border-radius en las esquinas de abajo */

  z-index: 10;
  display: flex;
  flex-direction: column;
  padding: 15px;
  gap: 3vh;
  width: 9vw;
  padding:2rem;
  opacity: 0; /* Agregamos esto para controlar la opacidad */
  transform: translateY(10px); 
  transition: opacity 0.9s ease, transform 0.3s ease;
  border-left:1px solid beige;
  border-bottom:1px solid beige;

  
 
}


.profileSubMenu.active{
  transition: opacity 0.9s ease, transform 0.9s ease;
  opacity: 1; /* Cambiar la opacidad al estar activo */
  transform: translateY(0); /* Cambiar la posición al estar activo */
}
        .userProfilePic{
          border-radius:50%;
          height:5vh;
          cursor:pointer;
          margin-left:6vw;
          
        
        }


        .profileContainer2{
  position: relative;
  display: inline-block;
  margin-left:30vw;

  width:9vw;
  
}
        .navigation ul {
          display: flex;
          
       
              justify-content: space-around;
              aling-content:center:
              align-items:center;
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
          transition: color 0.9s ease; 
         
        }

        .navigation li a:hover {
     
  color:#33FCFF;
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
