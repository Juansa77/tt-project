

const Hamburger = ({ isOpen }) => {
  return (
    <>
      <div className="hamburger">
        <div className="burger burger1" />
        <div className="burger burger2" />
        <div className="burger burger3" />
        <style jsx>{`
          .hamburger {
            width: 3.5vw;
            height: 5.5vh;

            justify-content: space-evenly;
            flex-direction: column;
            flex-wrap: nowrap;
            z-index: 10;
            display: none;
            margin-top: -1.1vh;
          }

          .burger {
            width: 10rem;
            height: 0.3rem;
            border-radius: 10px;
            background-color: #0096c7;
            transform-origin: 1px;
            transition: all 0.3s linear;
            
          }

          .burger1 {
            transform: ${isOpen ? "rotate(45deg)" : "rotate(0)"};
            z-index: 1;
          }
          .burger2 {
            transform: ${isOpen ? "translateX(100%)" : "translateX(0)"};
            opacity: ${isOpen ? 0 : 1};
            z-index: 1;
          }
          .burger3 {
            transform: ${isOpen ? "rotate(-45deg)" : "rotate(0)"};
            z-index: 1;
          }

          @media (max-width: 800px) {
            .hamburger {
              display: flex;

              margin-right: 7vh;
              z-index: 10;
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default Hamburger;
