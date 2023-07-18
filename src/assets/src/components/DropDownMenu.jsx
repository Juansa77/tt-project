/* eslint-disable react/display-name */
import React, { forwardRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/authContext';

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
`;

const DropdownButton = styled.button`
  background-color: #f9f9f9;
  color: #333;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
`;

const DropdownContent = styled.div`
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  width: 100%;
`;

const DropdownOption = styled.div`
  padding: 12px 16px;
  color: #333;
  cursor: pointer;
  width: 100%;

  &:hover {
    background-color: #ddd;
    width: 100%;
  }
`;

const DropDownMenu = forwardRef(({ setSelectedCity }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [option, setOption] = useState('');
  const { selectedCity } = useAuth();

  useEffect(() => {
    setOption(selectedCity || '');
  }, [selectedCity]);

  const handleOptionSelect = (selectedOption) => {
    setOption(selectedOption);
    setSelectedCity(selectedOption);
    setIsOpen(false);
  };

  return (
    <DropdownContainer>
      <DropdownButton ref={ref} onClick={() => setIsOpen(!isOpen)}>
        {option || 'Select a city'}
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
});

export default DropDownMenu;