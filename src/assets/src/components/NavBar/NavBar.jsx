/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unknown-property */

import Hamburger from "./Hamburger";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import { useUserContext } from "../../contexts/UserContext";
import { getAllChats } from "../../services/API_USER/message.service";
import { FaHome } from 'react-icons/fa';
import { FaDice } from 'react-icons/fa';
import { FaUserFriends } from 'react-icons/fa';
Logo



import "./NavBar.css";
import Logo from "../Logo/Logo";

const NavBar = () => {
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const { user, logOut } = useAuth();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false); //
  const { totalMessages, setTotalMessages, totalRequests, setTotalRequests } =
    useUserContext();
  const [responseChats, setResponseChats] = useState();

  console.log(totalMessages);
  console.log(totalRequests);

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

    //* Lógoca para las friends requests 
    if (user && totalRequests == null) {
      const friendRequestsCount = user?.friendRequests.reduce(
        (count, request) => {
          if (request?.isSender == false) {
            return count + 1;
          }
          return count;
        },
        0
      );
      setTotalRequests(friendRequestsCount);
    }

    console.log(responseChats);
  }

  console.log(totalMessages);

  //* Lógica para el toogle de los menús 
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
    <Logo/>
      <ul>
        <li>
          <NavLink to="/">
          <div className="iconWrapNav"> <FaHome size="25px" />
            <h3>HOME</h3>
            </div>
          </NavLink>
        </li>

        <li>
          <NavLink to="/games">
          <div className="iconWrapNav">
<FaDice size="25px"/>
            <h3>GAME SEARCH</h3>
            </div>
          </NavLink>
        </li>
        <li>
          <NavLink to="/search-friends">
          <div className="iconWrapNav">
          <FaUserFriends size="25px"/>
            <h3>SEARCH FRIENDS</h3>
            </div>
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
                {hamburgerOpen == true ? (
                  <h3
                    className="AccountTextResponsive"
                    onClick={toggleProfileMenu}
                  >
                    ACCOUNT
                  </h3>
                ) : (
                  <img
                    className="userProfilePic"
                    src={user.image}
                    onClick={toggleProfileMenu}
                  />
                )}

                {totalMessages > 0 && (
                  <div className="contentBadgeMessages">
                    <p>{totalMessages}</p>
                  </div>
                )}
                {totalRequests > 0 && (
                  <div className="contentBadgeRequest">
                    <p>{totalRequests}</p>
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
                    {totalRequests > 0 && (
                      <p className="MsgAnchorText">
                        {totalRequests} new friend request
                      </p>
                    )}
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
          backdrop-filter: blur(3px);
          min-width: 100vw;
          height: 7vh;
          margin-bottom: 10vh;
          color:beige;
          display:flex;
          justify-content: space-between;
          background: transparent;
          -webkit-backdrop-filter: blur(5px);
          position:fixed;
          font-weight: 900;
          top:0;
          margin-bottom: 5%;
          z-index:200;
          padding:1vh;
          font-size:1.5vh;
          font-family: "SF Pro Text", "Helvetica Neue", sans-serif;
        
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

  
  color: beige;
  border-radius: 0 0 5px 5px; /* Aplicar border-radius en las esquinas de abajo */

  z-index: 200;
  display: flex;
  flex-direction: column;
  padding: 15px;
  gap: 3vh;
  width: 30vw;
  padding:2rem;

  transform: translateY(10px); 
  transition: opacity 0.9s ease, transform 0.3s ease;
  border-left:1px solid beige;
  border-bottom:1px solid beige;
  backdrop-filter: blur(100px);


  
 
}

@media (max-width: 767px){
  .profileSubMenu{
    max-width: 30vw;
  }

}


.profileSubMenu.active{
  transition: opacity 0.9s ease, transform 0.9s ease;
  opacity: 1; /* Cambiar la opacidad al estar activo */
  transform: translateY(0); /* Cambiar la posición al estar activo */
  backdrop-filter: blur(100px);
}
        .userProfilePic{
          border-radius:50%;
          height:5vh;
          z-index:6;
          cursor:pointer;
          margin-left:6vw;
          
        
        }


        .profileContainer2{
  position: relative;
  display: inline-block;
  
  margin-left:30vw;
 

  width:12vw;
  
}
        .navigation ul {
          display: flex;
          
     
              justify-content: space-around;
              aling-content:flex-start:
              align-items:flex-start;
         
              padding: 0 25px;
              gap:7vh;
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
     
  color:#0096c7;
              }

              h3:hover{
                color:#0096c7;
            
              }

     h3{cursor:pointer;
      font-size:1.5vh;
     }

        @media (max-width: 767px) {
          .AccountTextResponsive{

          }
.profileContainer2{

width:70vw;
position:absolute;

left:-138px;;


  
}


          .profileSubMenu{
   


  background-color: #363636;
  color: beige;
  border-radius: 0 0 5px 5px; /* Aplicar border-radius en las esquinas de abajo */

  z-index: 10;
  display: flex;
  flex-direction: column;
  padding: 15px;
  gap: 3vh;
  width: 100%;
  padding:2rem;
  opacity: 0; /* Agregamos esto para controlar la opacidad */
  transform: translateY(10px); 


  
 
}

          .hamburger {
            display: fixed;
            float: right;
            padding-top: 10px;
            width:3vw;
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
            width: 50vw;
            margin-left:10px;
            margin-top: 56px;
            position: fixed;
            transition: all 0.3s linear;
          
          }

          .navigation ul li{
            margin-top:1vh;
          }

       

          .burger{

            width:${hamburgerOpen ? "2.8rem" : "3.1rem"};
            transition:  0.2s ease-in-out;


          }
        }
      `}</style>
    </div>
  );
};

export default NavBar;