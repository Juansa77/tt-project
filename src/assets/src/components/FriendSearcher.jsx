
import { useState } from 'react';
import styled from 'styled-components';


const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;

  @media (max-width: 767px){
    width:100%;
  }
`;

const DropdownButton = styled.button`
  background-color: #f9f9f9;
  color: #333;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width:14vw;

  @media (max-width: 767px){
    width:100%;
   
  }
`;

const DropdownContent = styled.div`
  position: absolute;
  background-color: #f9f9f9;
 
  width:100%;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
`;

const DropdownOption = styled.div`
  padding: 12px 16px;
  color: #333;
  cursor: pointer;

  &:hover {
    background-color: #ddd;
  }
`;


const FriendSearcher = ({setSelectedCity}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    console.log(option)
    setIsOpen(false);
    setSelectedCity(option)
  };



  return (
    <DropdownContainer>
      <DropdownButton onClick={() => setIsOpen(!isOpen)}>
        {selectedOption || 'Click to select a city'}
      </DropdownButton>
      {isOpen && (
        <DropdownContent>
          <DropdownOption onClick={() => handleOptionSelect('Sevilla')}>
            Sevilla
          </DropdownOption>
          <DropdownOption onClick={() => handleOptionSelect('Madrid')}>
            Madrid
          </DropdownOption>
          <DropdownOption onClick={() => handleOptionSelect('Barcelona')}>
            Barcelona
          </DropdownOption>
        </DropdownContent>
      )}
     
    </DropdownContainer>
  );
};

export default FriendSearcher;