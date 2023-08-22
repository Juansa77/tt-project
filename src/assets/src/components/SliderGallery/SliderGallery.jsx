import { useEffect, useState } from "react";
import { SliderData } from "./SliderData";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./SliderGallery.css";
import { useNavigate } from "react-router-dom";
import { useGameContext } from "../../contexts/GameContext";

const SliderGallery = ({ slides }) => {
  //* Instanciamos la imagen actual
  const [current, setCurrent] = useState(0);
  const [slideType, setSlideType] = useState(null);
  //* La longitud de los datos
  const length = slides.length;

  const navigate = useNavigate();
  const [selectedElement, setSelectedElement] = useState(null);
  const { setSelectedGame } = useGameContext();




  //* Si la imagen actual es la última, no hagas nada, si no, añade 1
  const nextSlide = () => {
    setCurrent(current === length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  //* Lçogica para que la imagen cambie cada tres segundos y medio
  useEffect(() => {
    const interval = setInterval(() => nextSlide(), 3500);
    return () => {
      clearInterval(interval);
    };
  }, [current]);

  //* ---lógica de navigate----
  const handleSelectElement = async (slide, event) => {
    if (event.target.tagName === "IMG") {
      // Verificar que se hizo clic directamente en la imagen
      console.log(slide.type);

      if (slide.type === "game") {
        setSelectedGame(null);
        // Redirige a la página de detalles del juego seleccionado
        navigate(`/games/${slide._id}`);
      } else if (slide.type === "ownPage") {
        navigate(`${slide.link}`);
      }
    }
  };
  return (
    <section className="slider">
      <div className="sliderBtnWrapper">
        <FaChevronLeft className="left-arrow" onClick={prevSlide} />
        <FaChevronRight className="right-arrow" onClick={nextSlide} />
      </div>
      {slides.map((slide, index) => {
        return (
          <div
            onClick={(event) => handleSelectElement(slide, event)}
            className={index === current ? "slide active" : "slide"}
            key={index}
          >
            <div className="sliderImageContainer">
              {index === current && (
                <img src={slide.image} alt="travel image" className="image" />
              )}
            </div>
            <div className="slideTextWrapper">
              <h1 className="slideText">{slide.text}</h1>
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default SliderGallery;
