
// GameContext.js
import { createContext, useContext, useState } from "react";

const GameContext = createContext();

export const useGameContext = () => useContext(GameContext);

export const GameContextProvider = ({ children }) => {
  const [selectedGame, setSelectedGame] = useState(null);

  return (
    <GameContext.Provider value={{ selectedGame, setSelectedGame }}>
      {children}
    </GameContext.Provider>
  );
};