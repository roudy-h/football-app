import React, { useState, useEffect } from 'react';
import MatchDAO from '../../dao/DAOMatch.mjs';
import NewsDao from '../../dao/DAOnews.mjs';
import { useNavigate } from 'react-router-dom'; 
import TeamDAO from '../../dao/DAOTeam.mjs';
import Classement from '../Classement/Classement'; 
import { Tbody } from '../Classement/Classement';
import "./Home.css"
import Footer from '../Footer/footer';

/**
 * Composant pour afficher les positions des joueurs
 * @param position : position du joueur
 * @param nb_points : nombre de points du joueur
 * @param name : nom du joueur
 * @returns {Element}
 * @constructor
 */
function PositionInput({ position, nb_points, name }) {
  return (
    <div className="position">
      <h1>{name}</h1>
      <h2>{position}</h2>
      <p>{nb_points}</p>
    </div>
  );
}

/**
 * Composant pour afficher le podium
 * @returns {Element}
 * @constructor
 */
function Podium() {
  const positions = [
    { position: "2nd Place", nb_points: "40 points", name: "Nathan" },
    { position: "1st Place", nb_points: "45 points", name: "Swann" },
    { position: "3rd Place", nb_points: "35 points", name: "Titouan" }
  ];

  return (
    <div className="podium">
      <div className="background-image"></div>
      <div className="positions">
        {positions.map((position, index) => (
          <PositionInput
            key={index}
            position={position.position}
            nb_points={position.nb_points}
            name={position.name}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Composant pour afficher un match
 * @param match : match à afficher
 * @returns {Element}
 * @constructor
 */
function Match({ match }) {
    return (
        <div className="match2">
            <div className="team">
                <img src={match.homeTeam.crest} alt="Team Crest"></img>
                <h2>{match.homeTeam.name}</h2>

            </div>
            <div className="informations_match">
                <h1>vs</h1>
                <p>{match.date}</p>
                <p>{match.hour}</p>
            </div>
            <div className="team">
                <img src={match.awayTeam.crest} alt="Team Crest"></img>
                <h2>{match.awayTeam.name}</h2>

            </div>
        </div>
    );
}

/**
 * Composant pour afficher les matchs du moment
 * @returns {Element}
 * @constructor
 */
function MatchPart() {
  const [data, setData] = useState([]);
  const navigate = useNavigate(); // Utilisation de useNavigate pour la navigation

  useEffect(() => {
    const fetchData = async () => {
      try {
        const matchData = await MatchDAO.returnCurrentMatch();
        setData(matchData);
      } catch (error) {
        console.error('Error fetching match data:', error);
      }
    };

    fetchData();
  }, []);

  const handleVoirAutresMatchs = () => {
    navigate('/calendrier-resultats');
  };

  return (
    <div>
      <h1>Les matchs du moment</h1>
      <div className='AllMatches'>
        {data.map((match, index) => (
          index <= 3 && <Match key={index} match={match} />
        ))}
        <button className='button_match' onClick={handleVoirAutresMatchs}>Voir plus de matchs</button>

        {/* <div className='match2 moreMatch'> 
          <h2>Envie de voir les matchs ?</h2>
          <button onClick={handleVoirAutresMatchs}>Voir les autres matchs</button>
        </div> */}
      </div>
    
    </div>
  );
}

/**
 * Composant pour afficher une actualité
 * @param title : titre de l'actualité
 * @param author : auteur de l'actualité
 * @param url : url de l'actualité
 * @param image : image de l'actualité
 * @param publishedAt : date de publication de l'actualité
 * @returns {Element}
 * @constructor
 */
const Neww = ({ title, author, url, image, publishedAt }) => {
  return (
    <div className="new">
      <img src={image} alt="News" className="new_image" />
      <div className="new_details">
        <h3 className="new_title">{title}</h3>
        <p className="new_author">Par {author}</p>
        <p className="new_published">Publié le {publishedAt.substring(0, 10)} à {publishedAt.substring(11, 16)}</p>
        <a href={url} className="new_link" target="_blank" rel="noopener noreferrer">Read more</a>
      </div>
    </div>
  );
};

/**
 * Composant pour afficher les actualités du moment
 * @returns {Element}
 * @constructor
 */
function NewsPart() {
  const [data, setData] = useState([]);
  const navigate = useNavigate(); // Utilisation de useNavigate pour la navigation

  useEffect(() => {
    const fetchData = async () => {
      try {
        const newsData = await NewsDao.returnAllArticles();
        setData(newsData);
      } catch (error) {
        console.error('Error fetching match data:', error);
      }
    };

    fetchData();
  }, []);



  return (
    <div>
      <div className='AllNews'>
        {data.map((article, index) => (
          index <= 2 && <Neww
          key={index}
          title={article.source.title}
          author={article.source.author}
          url={article.source.url}
          image={article.source.urlToImage}
          publishedAt={article.source.publishedAt}
      />
        ))}
      </div>
    
    </div>
  );
}

/**
 * Composant pour afficher les 3 meilleures équipes du classement
 * @param classement : classement des équipes
 * @returns {Element}
 * @constructor
 */
const ThreeBetters = ({ classement }) => {
  return (
    <div className="equipe-container">
      {classement.map((equipe, index) => (
        <div key={index} className="equipe">
          <img src={equipe.logo} alt={equipe.name} />
          <h3>{equipe.name}</h3>
          <p>Score: {equipe.score}</p>
          <p>Victoires: {equipe.win}</p>
          <p>Nuls: {equipe.draw}</p>
          <p>Défaites: {equipe.loose}</p>
        </div>
      ))}
    </div>
  );
};

/**
 * Composant pour afficher les 3 meilleures équipes du classement
 * @returns {Element}
 * @constructor
 */
function ClassementPart() {
  const [data, setData] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const classement = await TeamDAO.returnRanks();
    
        setData(classement);
      } catch (error) {
        console.error('Error fetching match data:', error);
      }
    };

    fetchData();
  }, []);

  const handleVoirClassement = () => {
    navigate('/classement');
  };

  return (
    <div className='test'>
      <div>
        <ThreeBetters
          classement={data.slice(0,3)}
        />
        <div className="button-container">
          <button onClick={handleVoirClassement}>Voir le classement</button>
        </div>
      </div>
    </div>
  );
}

/**
 * Composant pour afficher la page d'accueil
 * @returns {Element}
 * @constructor
 */
export default function PageHome() {
    return (
        <div>
            <MatchPart />
            <div className="bande-annonce">
              <h2>Pariez sur les matchs à venir</h2>
              <p>afin de remporter des points et d'apparaître sur le classement !</p>
            </div>
            <Podium />
            <div className="bande-annonce">
              <h2>Les Actualités du moments ! </h2>
            </div>
            <NewsPart />
            <div className="bande-annonce">
              <h2>Les 3 meilleurs équipes du classement !</h2>
            </div>
            <ClassementPart />
            <Footer></Footer>

        </div>
    );
}

