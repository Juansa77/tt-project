

import styled from 'styled-components';
import { FaPlus, FaMinus } from 'react-icons/fa';

const CardContainer = styled.div`
  width: 9vw;
  height: 27vh;
  border-radius:10px;
  background-color: transparent;
  border:1px solid rgba(195, 198, 211, 0.315);
  color: #fff;
  margin-top: 4vh;
  position: relative;
  transition: 0.2s ease-in-out;
  cursor: pointer;
  overflow: hidden;
  box-shadow: 0 0px 5px grey;

  @media (max-width: 768px) {
    width: 32vw;
    height: 20vh;
    font-size: 1px;
  }

  &:hover {
    border: 3px solid beige;
    box-shadow: 0 5px 50px black;
    overflow: hidden;
  }
`;

const Image = styled.img`
  width:100%;
  height: 19vh;
  object-fit: cover;

  opacity: 80%;
  transition: 0.2s ease-in-out;

  &:hover {
    opacity: 100%;
  }
`;

const TitleContainer = styled.div`
padding:0.5rem;
  display: flex;
  justify-content: center; /* Cambio aquí para centrar horizontalmente */
  align-items: center;
  width: 100%;
  height: 20%; /* Cambio aquí para determinar la altura del título */
  background-color: transparent;
  
`;

const Title = styled.h2`
  font-size: 1.7vh;
  text-align: left; /* Cambio aquí para centrar el texto */
  margin: 0;
  width: 100%;
  white-space: nowrap; /* Evita que el texto se divida en varias líneas */
  overflow: hidden;
  text-overflow: ellipsis; /* Agrega puntos suspensivos si el texto es demasiado largo */
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

const UserCard = ({ image, title, onClickAdd, onClickRemove }) => {
  return (
    <CardContainer>
      <Image src={image} alt="Imagen" />
      <TitleContainer>
        <Title>{title}</Title>
      </TitleContainer>
    </CardContainer>
  );
};

export default UserCard;