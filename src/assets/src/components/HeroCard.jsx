/* eslint-disable react/prop-types */

import styled from "styled-components";

const CardContainer = styled.div`
  width: 90%;
  height: 50vh;
  background-color: #141414;
  color: #fff;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  transition: 0.2s ease-in-out;
  cursor: pointer;
  box-shadow: 5px 2px 20px black;
  margin-top: 10vh;

  @media (max-width: 768px) {
    width: 100%;
  }

  &:hover {
    border: 3px solid beige;
    box-shadow: 0 5px 50px black;
  }
`;
const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 60%;
  transition:  0.2s ease-in-out;
  &:hover {
    opacity: 100%;
  
    transform: scale(1.15);
    overflow:hidden;
    
  }
`;

const TitleContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 10px;
  min-width:10vw;
  max-width:50vw;
  min-height:5vh;
  max-height:min-content;
  margin-bottom: 25vh;
 
`;

const Title = styled.h2`
  font-size: 5vh;
  text-align: left;
  margin-left: 3vw;

`;

const HeroCard = ({ image, title }) => {
  return (
    <CardContainer>
      <Image src={image} alt="Imagen" />
      <TitleContainer>
        <Title>{title}</Title>
      </TitleContainer>
    </CardContainer>
  );
};

export default HeroCard;
