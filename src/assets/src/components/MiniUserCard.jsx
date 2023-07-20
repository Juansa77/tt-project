/* eslint-disable react/prop-types */
import styled from 'styled-components';
import { FaPlus, FaMinus } from 'react-icons/fa';

const CardContainer = styled.div`
display:flex;
flex-direction: column;
  width: 6.5vw;
  height: 16vh;
  background-color: rgba(0,0,0,0.5);
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
  width: 100%%;
  height: 70%;
  object-fit: cover;
  border-radius: 8px;
  opacity: 80%;
  transition:  0.2s ease-in-out;
  &:hover {
    opacity: 100%;
  

  }
`;

const TitleContainer = styled.div`

  display:flex;
  width:100%;
  height:100%;
  align-content:center;
  align-items:center;
  background-color: #121b27;
 
  margin-top:10px;

`;

const Title = styled.h2`
  font-size: 1.3vh;
  text-align: left;
  margin-left:10px;
  margin-bottom:2vh;
  margin-top:1vh;


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



const MiniUserCard=({image, title, onClickAdd, onClickRemove}) => {
  return (
    <CardContainer>
    <AddButton onClick={onClickAdd}>
        <FaPlus />
      </AddButton>
      <RemoveButton onClick={onClickRemove}>
        <FaMinus />
      </RemoveButton>
      <Image src={image} alt="Imagen" />
      <TitleContainer>
        <Title>{title}</Title>
      </TitleContainer>
    </CardContainer>
  );
}

export default MiniUserCard;
