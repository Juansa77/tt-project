/* eslint-disable react/prop-types */

import styled from 'styled-components';

const CategoryTextContainer = styled.div`
  bottom: 0;
  left: 0;
  min-width: 110%;
  overflow:hidden;
  height:6.7vh;
 color:beige;
  display:flex;
  margin-top:6vh;
  margin-bottom:5vh;
  justify-content:center;

  
  

`;

const CategoryText = styled.h2`
  font-size: 3.2vh;
  min-width:100%;
  margin-bottom:2vh;
  color:beige;
  text-align:left;
  margin-left:32vw;
  height:7vh;

`;



const CategorySplitter = ({title}) => {
  return (
    <CategoryTextContainer>
        <CategoryText>{title}</CategoryText>
    </CategoryTextContainer>
  )
}

export default CategorySplitter