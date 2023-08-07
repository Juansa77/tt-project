/* eslint-disable react/prop-types */

import styled from 'styled-components';

const CategoryTextContainer = styled.div`
  bottom: 0;
  left: 0;
  min-width: 100%;
  overflow:hidden;
  height:7vh;
 color:beige;
  display:flex;
  flex-direction:column;
  margin-top:5vh;

  justify-content:center;
  margin-bottom:-15vh;

  
  

`;

const CategoryText = styled.h2`
  font-size: 2.9vh;
  min-width:100%;

  color:beige;
  text-align:left;
  margin-left:6vw;
  height:4vh;


`;

const CategorySubText = styled.h4`
  font-size: 1.6vh;
  min-width:100%;

  color:beige;
  text-align:left;
  margin-left:6vw;
  height:4vh;


`;


const CategorySplitter = ({title, text}) => {
  return (
    <CategoryTextContainer>
        <CategoryText>{title}</CategoryText>
        <CategorySubText>{text}</CategorySubText>
    </CategoryTextContainer>
  )
}

export default CategorySplitter