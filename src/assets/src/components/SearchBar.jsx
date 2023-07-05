
import { useState } from 'react';
import styled from 'styled-components';
useState

const SearchBarContainer = styled.div`
  display: flex;
  align-items: center;
  width: 30vw;
  height: 40px;
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

const SearchBar = ({ placeholder, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <SearchBarContainer>
      <SearchInput
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
      />
      <SearchButton onClick={handleSearch}>Buscar</SearchButton>
    </SearchBarContainer>
  );
};

export default SearchBar;