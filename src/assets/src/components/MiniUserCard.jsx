/* eslint-disable react/prop-types */
import styled from "styled-components";
import { FaPlus, FaMinus } from "react-icons/fa";

const CardContainer = styled.div`
display:flex;
flex-direction: column;
  width: 6.5vw;
  height: 20vh;
  background-color: transparent;
  color: #fff;
 
  overflow: hidden;
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
    transform: scale(1.05);
    overflow:hidden;
    
  }
`;

const Image = styled.img`
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  opacity: 80%;
  transition: 0.2s ease-in-out;
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

  margin-top: 10px;
`;

const Title = styled.h2`
  font-size: 1.7vh;
width:100%;
  margin-bottom: 2vh;
  margin-top: 0.1vh;
`;

const MiniUserCard = ({ image, title }) => {
  return (
    <CardContainer>
      <Image src={image} alt="Imagen" />
      <TitleContainer>
        <Title>{title}</Title>
      </TitleContainer>
    </CardContainer>
  );
};

export default MiniUserCard;
