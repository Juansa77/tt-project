/* eslint-disable react/prop-types */
import styled from 'styled-components';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { useState, useEffect, useRef } from 'react';

const GameSelectionContainer = styled.div`
display:flex;
position: relative;
min-height:50vh;
width:100%;
gap:3vw;
align-content:center;
align-items:center;
overflow:hidden;
`


const CardContainerSelection = styled.div`
  min-width: 14vw;
  min-height: 40vh;
max-height:40vh;
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

const ImageSelection = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 80%;
  transition:  0.2s ease-in-out;
  &:hover {
    opacity: 100%;
  

  }
`;

const TitleContainerSelection = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 10px;

`;

const TitleSelection = styled.h2`
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

const ScrollButtonLeft = styled.button`
  position: absolute;
  width:4vw;
  height:2vh;
  top: 50%;
  left: 0;
z-index:3;
  border: none;
  cursor: grab;
  transform: translateY(-50%);
  color: #fff;
`;

const ScrollButtonRight = styled.button`
  position: absolute;
  width:2vw;
  top: 50%;
  right: 0;
  z-index:3;
  border: none;
  cursor:grab;
  transform: translateY(-50%);
  color: #fff;
`;

const ScrollButtonsContainer = styled.div`
  position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    transform: translateY(-50%);
`;


const GameSelection=({searchFunction, searchTerm, onClickAdd, onClickRemove}) => {

    const [response, setResponse] = useState([]);
    const containerRef = useRef(null) 


    const search = searchTerm
    useEffect(()=>{
        const fetchData = async()=>{
        const data =  await searchFunction(search)
        setResponse(data)}
        fetchData()
      },[])
    
      const handleScrollLeft = (element, scroll) => {
       
     
          console.log("el boton funciona")
          element.scrollLeft +=scroll
        
      };
      
      const handleScrollRight = (element, scroll) => {
   
          console.log("el boton funciona")
          element.scrollLeft +=scroll
          console.log("el boton funciona")
        
      };
  return (
    <div>
    <GameSelectionContainer ref={containerRef}>
    {response?.data?.map((game, index) =>
    index < 5 &&
        <CardContainerSelection  key={index}>
    <AddButton onClick={onClickAdd}>
        <FaPlus />
      </AddButton>
      <RemoveButton onClick={onClickRemove}>
        <FaMinus />
      </RemoveButton>
      <ImageSelection src={game.image} alt={`${game.title} cover`} />
      <TitleContainerSelection>
        <TitleSelection>{game.title}</TitleSelection>
      </TitleContainerSelection>
    </CardContainerSelection>
    )
   
    }
    </GameSelectionContainer>

        <ScrollButtonsContainer>
          <ScrollButtonLeft onClick={()=>handleScrollLeft(containerRef.current, 100)}>&lt;</ScrollButtonLeft>
          <ScrollButtonRight onClick={()=>handleScrollRight(containerRef.current, 100)}>&gt;</ScrollButtonRight>
        </ScrollButtonsContainer>
     
    </div>
  );
}

export default GameSelection;
