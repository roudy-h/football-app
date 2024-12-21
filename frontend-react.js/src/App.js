import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Actualites from './components/Actualite/Actualites';
import CalendrierResultats from './components/CalendrierResultats/CalendrierResultats';
import Classement from './components/Classement/Classement';
import Equipes from './components/Equipes/Equipes';
import Equipe from './components/Equipe/Equipe';
import Header from "./components/Header/Header";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Account from "./components/Account/Account";
import Logout from "./Logout/Logout";
import {useState} from "react";

/**
 * Fonction qui permet de gérer les routes de l'application
 * @returns {JSX.Element}
 * @constructor
 */
function App() {
    const [connected, setConnected] = useState(false)

  return (
    <Router>
      <div>
          <Header>
              <Header connected={connected} />
          </Header>
          <Routes>
              <Route path="/" element={<Navigate to="/home" />} />
              <Route path="/home" element={<Home />} />
              <Route path="/actualites" element={<Actualites />} />
              <Route path="/calendrier-resultats" element={<CalendrierResultats />} />
              <Route path="/classement" element={<Classement />} />
              <Route path="/equipes" element={<Equipes />} />
              <Route path='/equipe/:code' element={<Equipe />}/>
              <Route path="/register" element={<Register setConnected={setConnected} />} />
              <Route path="/login" element={<Login connected={connected} setConnected={setConnected} />} />
              <Route path="/account" element={<Account />} />
              <Route path="/logout" element={<Logout setConnected={setConnected} />} />
          </Routes>
      </div>
    </Router>
  );
}

export default App;
