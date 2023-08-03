import { useState } from "react";
import { SliderData } from "./SliderData";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./SliderGallery.css"
import { useNavigate } from "react-router-dom";



const SliderGallery = ({ slides }) => {
  //* Instanciamos la imagen actual
  const [current, setCurrent] = useState(0);
  //* La longitud de los datos
  const length = slides.length;

  const navigate = useNavigate()
  const [selectedElement, setSelectedElement] = useState(null)


  //* Si la imagen actual es la última, no hagas nada, si no, añade 1
  const nextSlide = () => {
    setCurrent(current === length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  if (!Array.isArray(slides) || slides.length <= 0) {
    return null;
  }

//* ---lógica de navigate----

const handleSelectElement = (element) => {
    console.log(element)
    setSelectedElement(element);
    // Redirige a la página de detalles del juego seleccionado
    navigate(`/games/${element._id}`);

  };



  return (
    <section className="slider">
      <div className="sliderBtnWrapper">
        <FaChevronLeft className="left-arrow" onClick={prevSlide} />
        <FaChevronRight className="right-arrow" onClick={nextSlide} />
      </div>
      {SliderData.map((slide, index) => {
        return (
          <div
            className={index === current ? "slide active" : "slide"}
            key={index}
          >
            {index === current && (
              <img src={slide.image} alt="travel image" className="image" />
            )}
          </div>
        );
      })}
    </section>
  );
};

export default SliderGallery;
