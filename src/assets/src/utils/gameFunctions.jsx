
//*---FUNCIÓN PARA SELECCIONAR JUEGO

export const handleSelectGame = (game, setSelectedGame, navigate) => {
  
    setSelectedGame(game);
    // Redirige a la página de detalles del juego seleccionado
    navigate(`/games/${game._id}`);
    window.scrollTo(0, 0);
  };
