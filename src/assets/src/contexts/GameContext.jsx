import { createContext, useContext, useState } from "react";

const GameContext = createContext();

export const useGameContext = () => useContext(GameContext);

export const GameContextProvider = ({ children }) => {
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [selectedCollection1, setSelectedCollection1] = useState(null);
  const [selectedCollection2, setSelectedCollection2] = useState(null);
  const [selectedCollection3, setSelectedCollection3] = useState(null);
  const [selectedCollection4, setSelectedCollection4] = useState(null);
  const [selectedCollection5, setSelectedCollection5] = useState(null);
  const [selectedCollection6, setSelectedCollection6] = useState(null);
  const [selectedCollection7, setSelectedCollection7] = useState(null);

  return (
    <GameContext.Provider
      value={{
        selectedGame,
        setSelectedGame,
        selectedCollection,
        setSelectedCollection,
        selectedCollection1,
        setSelectedCollection1,
        selectedCollection2,
        setSelectedCollection2,
        selectedCollection3,
        setSelectedCollection3,
        selectedCollection4,
        setSelectedCollection4,
        selectedCollection5,
        setSelectedCollection5,
        selectedCollection6,
        setSelectedCollection6,
        selectedCollection7,
        setSelectedCollection7,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};