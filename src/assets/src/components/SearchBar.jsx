
import { useState } from 'react';
import styled from 'styled-components';
import { FaSearch } from 'react-icons/fa';
useState

const SearchBarContainer = styled.div`
  display: flex;
  align-items: center;
  width: 33vw;
  height: 50px;
  background-color: #000;
  border-radius: 20px;
  padding: 0 10px;
`;

const SearchInput = styled.input`
  flex: 1;
  height: 100%;
  background-color: transparent;
  border: none;
  outline: none;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  ::placeholder {
    color: #999;
  }
`;

const SearchButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  margin-left: 10px;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;

const SearchBar = ({ placeholder, searchTerm, handleChange, handleSearch }) => {
  


  return (
    <SearchBarContainer>
      <SearchInput
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleChange}
      />
      <SearchButton onClick={handleSearch}><FaSearch size="25px"/></SearchButton>
    </SearchBarContainer>
  );
};

export default SearchBar;