import React, { useState } from "react";
import './App.css';



function Card({name, image}) {

  const [{angle, PosX, PosY}] = useState({
    angle: Math.random() * 180 - 90,
    PosX: Math.random() * 85 - 30,
    PosY: Math.random() * 85 - 30
  });

  const transform = `translate(${PosX}px, ${PosY}px) rotate(${angle}deg)`;

  return <img className="Card" alt={name} src={image} style={{transform}} />;
}

export default Card
