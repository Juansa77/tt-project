/* eslint-disable react/prop-types */
import styled from 'styled-components';
import { FaPlus, FaMinus } from 'react-icons/fa';

const CardContainer = styled.div`
  width: 9vw;
  border-radius: 50%;
  height: 20vh;
  background-color: transparent;
  color: #fff;
  margin-top:4vh;


  position: relative;
  transition:  0.2s ease-in-out;
  cursor:pointer;


  @media (max-width: 768px) {
    width: 35vw;
    height:20vh;
    font-size:1px:
  }

  
  &:hover {
 
    border: 3px solid beige;
    box-shadow: 0 5px 50px black;

    overflow:hidden;
    
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  opacity: 80%;
  transition:  0.2s ease-in-out;
  &:hover {
    opacity: 100%;
  

  }
`;

const TitleContainer = styled.div`
  display: flex;
  text-align: center;
  width: 100%;
  height: 100%;
  align-content: center;
  align-items: center;
  background-color: transparent;
  margin-top:-7vh;

`;

const Title = styled.h2`
  font-size: 2.3vh;
  text-align: center;
  margin: 0;
  margin-bottom:2vh;
  width:100%;



`;


const AddButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
  background: none;
  border: none;
  cursor: pointer;
  color: #fff;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 10px;
  right: 40px;
  z-index: 2;
  background: none;
  border: none;
  cursor: pointer;
  color: #fff;
`;



const UserCard=({image, title, onClickAdd, onClickRemove}) => {
  return (
    <CardContainer>
      <Image src={image} alt="Imagen" />
      <TitleContainer>
        <Title>{title}</Title>
      </TitleContainer>
    </CardContainer>
  );
}

export default UserCard;
