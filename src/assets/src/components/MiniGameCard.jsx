/* eslint-disable react/prop-types */
import styled from 'styled-components';
import { FaPlus, FaMinus } from 'react-icons/fa';

const CardContainer = styled.div`
   width: 5.5vw;
  height: 12vh;
  background-color: #141414;
  color: #fff;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  transition:  0.2s ease-in-out;
  cursor:pointer;
  box-shadow: 5px 2px 20px black;

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
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 80%;
  transition:  0.2s ease-in-out;
  &:hover {
    opacity: 100%;
  

  }
`;

const TitleContainer = styled.div`
  position: absolute;
  bottom: -200px;
  left: 0;
  width: 100%;
  padding: 10px;

`;

const Title = styled.h2`
  font-size: 2.3vh;
  text-align: left;
  margin: 0;
  margin-bottom:2vh;


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



const MiniGameCard=({image, title}) => {
  return (
    <CardContainer>

      <Image src={image} alt="Imagen" />

    </CardContainer>
  );
}

export default MiniGameCard;
