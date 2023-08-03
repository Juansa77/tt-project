/* eslint-disable react/prop-types */

import styled from 'styled-components';

const CategoryTextContainer = styled.div`
  bottom: 0;
  left: 0;
  min-width: 100%;
  overflow:hidden;
  height:4vh;
 color:beige;
  display:flex;
  margin-top:5vh;

  justify-content:center;
  margin-bottom:-10vh;

  
  

`;

const CategoryText = styled.h2`
  font-size: 2.9vh;
  min-width:100%;

  color:beige;
  text-align:left;
  margin-left:22vw;
  height:4vh;


`;



const CategorySplitter = ({title}) => {
  return (
    <CategoryTextContainer>
        <CategoryText>{title}</CategoryText>
    </CategoryTextContainer>
  )
}

export default CategorySplitter