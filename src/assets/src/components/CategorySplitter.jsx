/* eslint-disable react/prop-types */

import styled from 'styled-components';

const CategoryTextContainer = styled.div`
  bottom: 0;
  left: 0;
  min-width: 110%;
  overflow:hidden;
  height:3.7vh;
 color:beige;
  display:flex;
  margin-top:6vh;
  margin-bottom:5vh;
  background: beige;
  justify-content:center;
  
  

`;

const CategoryText = styled.h2`
  font-size: 2.5vh;
  margin: 0;
  margin-bottom:2vh;
  color:#FF4500;

`;



const CategorySplitter = ({title}) => {
  return (
    <CategoryTextContainer>
        <CategoryText>{title}</CategoryText>
    </CategoryTextContainer>
  )
}

export default CategorySplitter