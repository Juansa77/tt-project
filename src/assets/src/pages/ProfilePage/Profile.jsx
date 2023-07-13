import { useState } from "react";
import GameCard from "../../components/GameCard";
import { useAuth } from "../../contexts/authContext";
import { gameByID } from "../../services/API_USER/game.service";
import ChangePassword from "../ChangePassword/ChangePassword";
import FormProfile from "../../components/FormProfile";
import { Link } from "react-router-dom";




const Profile = () => {

 

  const { user, setUser } = useAuth();
  console.log("user",user);
  return (
    <div className="profile-main">
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <h2 className="username">{user.user}</h2>
          </div>
          <img className="profile-image" src={user.image} alt="Profile" />
        
          <div className="profile-content">
            <div className="profile-section">
              <h3 className="section-title">Friends</h3>
              
              <ul className="friends-list">
                {user?.friends?.map((friend, index) => (
                  <li key={index}>{friend}</li>
                ))}
              </ul>
            </div>
            <div className="profile-section">
              <h3 className="section-title">Games</h3>
              <ul className="games-list">
                {user?.games?.map((game, index) => (
                  <li key={index}>{game}</li>
                ))}
              </ul>
              <p className="bottom-text">
            <small>
            
              <Link to="/passwordchange" className="anchorCustom-profileLink">
                Manage your account
              </Link>
            </small>
          </p>
            </div>
          </div>
          <div className="fluidContainerProfile">
        
      </div>
        </div>
        

        <style jsx>{`
          .profile-main {
            display: flex;
            width: 100vw;
            justify-content: center;
            background-color: #363636;
          }

          .profile-container {
            background: #363636;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 70vh;
            width: 70vw;

            font-family: Arial, sans-serif;
          }

          .profile-card {
            min-height: 50vh;
            width: 70vw;
            background-color: #121b27;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            color: #ffffff;
          }

          .profile-header {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 20px;
          }

          .username {
            font-size: 24px;
            margin-bottom: 8px;
          }

          .city {
            font-size: 14px;
          }

          .profile-image {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            object-fit: cover;
            margin-bottom: 20px;
          }

          .profile-section {
            margin-bottom: 20px;
          }

          .section-title {
            font-size: 18px;
            margin-bottom: 10px;
          }

          .friends-list,
          .games-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }

          .friends-list li,
          .games-list li {
            margin-bottom: 6px;
          }
        `}</style>
      </div>
    </div>
  );
};

export default Profile;
