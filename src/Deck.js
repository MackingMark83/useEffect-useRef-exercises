import React, { useEffect, useState, useRef } from "react";
import Card from "./Card";
import axios from "axios";
import './App.css';



function Deck() {
  const [deck, setDeck] = useState(null);
  const [pick, setpick] = useState([]);
  const [autoPick, setAutoPick] = useState(false);
  const timer = useRef(null);

  
  useEffect(() => {
    async function getData() {
      let d = await axios.get('http://deckofcardsapi.com/api/deck/new/shuffle/');
      setDeck(d.data);
    }
    getData();
  }, [setDeck]);

  
  useEffect(() => {
   
    async function getCard() {
      let { deck_id } = deck;

      try {
        let drawRes = await axios.get(`http://deckofcardsapi.com/api/deck/${deck_id}/draw/`);

        if (drawRes.data.remaining === 0) {
          setAutoPick(false);
          throw new Error("no cards remaining!");
        }

        const card = drawRes.data.cards[0];

        setpick(d => [
          ...d,
          {
            id: card.code,
            name: card.suit + " " + card.value,
            image: card.image
          }
        ]);
      } catch (err) {
        alert(err);
      }
    }

    if (autoPick && !timer.current) {
      timer.current = setInterval(async () => {
        await getCard();
      }, 1000);
    }

    return () => {
      clearInterval(timer.current);
      timer.current = null;
    };
  }, [autoPick, setAutoPick, deck]);

  const toggleAutoDraw = () => {
    setAutoPick(auto => !auto);
  };

  const cards = pick.map(c => (
    <Card key={c.id} name={c.name} image={c.image} />
  ));

  return (
    <div className="Deck">
      {deck ? (
        <button className="Deck-gimme" onClick={toggleAutoDraw}>
          {autoPick ? "Stop" : "Keep"} Picking for me
        </button>
      ) : null}
      <div className="Deck-cardarea">{cards}</div>
    </div>
  );
}

export default Deck;
