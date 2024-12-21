"use strict";
//pour lire le .env
import dotenv from 'dotenv'
dotenv.config()

import {HttpsProxyAgent} from 'https-proxy-agent';
import fetch from 'node-fetch';

import mongoose from "mongoose";
import Article from '../model/newsModel.mjs';

const proxy = process.env.https_proxy;
let agent = null;

if (proxy !== undefined) {
    console.log(`Le proxy est ${proxy}`);
    agent = new HttpsProxyAgent(proxy);
} else {
    // Pour pouvoir consulter un site avec un certificat invalide
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    console.log("Pas de proxy trouvé");
}

const NEWS_API_KEY = process.env.NEWS_API_KEY


const headers = {
    'x-api-key': NEWS_API_KEY
};

const requestOptions = {
    method: 'GET',
    headers: headers,
    agent: agent
};


const articleSchema = new mongoose.Schema({
    source: {
      id: String,
      name: String
    },
    author: String,
    title: String,
    description: String,
    url: String,
    urlToImage: String,
    publishedAt: Date,
    content: String
  });
  
  // Création du modèle à partir du schéma
  const ArticleModel = mongoose.model('newsCollections', articleSchema);



const url = `https://newsapi.org/v2/top-headlines?country=fr&category=sports&q=foot`;



const images = [
    "https://dicodusport.fr/blog/wp-content/uploads/2024/02/Transferts-OM-Tensions-autour-du-cas-Jonathan-Clauss-Marseille-le-pousse-vers-la-sortie.png",
    "https://img.20mn.fr/UoBWfA0VRb-2eE7HWMF-Tik/640x408_l-ol-n-a-perdu-qu-un-match-depuis-le-26-janvier-contre-8-victoires-toutes-competitions-confondues-et-renait-de-ses-cendres",
    "https://production-livingdocs-bluewin-ch.imgix.net/2023/09/01/c95907b3-29f4-4af1-bbfb-64c8b5a763f9.png?w=994&auto=format",
    "https://media1.woopic.com/api/v1/images/504%2Fsport%2FMedia365-Sport-News%2Fc3c%2Fc59%2F0f3b96d724daa6af6da672733c%2Fligue-1-j20-rennes-continue-sa-remontee-apres-son-succes-face-au-mhsc%7Cicon_r6gl5857-1024x538.jpg?facedetect=1&quality=85",
    "https://media2.woopic.com/api/v1/images/504%2Fsport%2FMedia365-Sport-News%2F257%2Fa8b%2F498b47280d9e12d9011cb53219%2Fligue-1-tonnerre-de-brest-en-alsace%7Cicon_sac_3961-1-1024x538.jpg?facedetect=1&quality=85",
    "https://madeinfoot.ouest-france.fr/photos/ligue-1/2023/une/l1-20231008182723-7422.jpg",
    "https://img.20mn.fr/m_gIMtr4SFGbauo-TG3tbSk/1444x920_lyon-s-brazilian-defender-21-henrique-silva-milagres-r-shoots-the-ball-during-the-french-ligue-1-football-match-between-olympique-lyonnais-ol-and-clermont-foot-63-at-groupama-stadium-in-lyon-central-eastern-france-on-october-22-2023-photo-by-arnaud-finistre-afp",
    "https://images2.minutemediacdn.com/image/upload/c_crop,w_5304,h_2983,x_0,y_62/c_fill,w_720,ar_16:9,f_auto,q_auto,g_auto/images/GettyImages/mmsport/90min_fr_international_web/01h1pj9a7r7dtt2jj5rg.jpg",
    "https://www.challenges.fr/assets/img/2023/11/02/cover-r4x3w1200-653a54e864624-sipa-01127152-000127.jpg",
    "https://static.actu.fr/uploads/2023/12/31b956be5928a15b41e196104984e74642680006.jpg",
    "https://dicodusport.fr/blog/wp-content/uploads/2024/02/Transferts-OM-Tensions-autour-du-cas-Jonathan-Clauss-Marseille-le-pousse-vers-la-sortie.png",
    "https://img.20mn.fr/UoBWfA0VRb-2eE7HWMF-Tik/640x408_l-ol-n-a-perdu-qu-un-match-depuis-le-26-janvier-contre-8-victoires-toutes-competitions-confondues-et-renait-de-ses-cendres",
    "https://production-livingdocs-bluewin-ch.imgix.net/2023/09/01/c95907b3-29f4-4af1-bbfb-64c8b5a763f9.png?w=994&auto=format",
    "https://media1.woopic.com/api/v1/images/504%2Fsport%2FMedia365-Sport-News%2Fc3c%2Fc59%2F0f3b96d724daa6af6da672733c%2Fligue-1-j20-rennes-continue-sa-remontee-apres-son-succes-face-au-mhsc%7Cicon_r6gl5857-1024x538.jpg?facedetect=1&quality=85",
    "https://media2.woopic.com/api/v1/images/504%2Fsport%2FMedia365-Sport-News%2F257%2Fa8b%2F498b47280d9e12d9011cb53219%2Fligue-1-tonnerre-de-brest-en-alsace%7Cicon_sac_3961-1-1024x538.jpg?facedetect=1&quality=85",
    "https://madeinfoot.ouest-france.fr/photos/ligue-1/2023/une/l1-20231008182723-7422.jpg",
    "https://img.20mn.fr/m_gIMtr4SFGbauo-TG3tbSk/1444x920_lyon-s-brazilian-defender-21-henrique-silva-milagres-r-shoots-the-ball-during-the-french-ligue-1-football-match-between-olympique-lyonnais-ol-and-clermont-foot-63-at-groupama-stadium-in-lyon-central-eastern-france-on-october-22-2023-photo-by-arnaud-finistre-afp",
    "https://images2.minutemediacdn.com/image/upload/c_crop,w_5304,h_2983,x_0,y_62/c_fill,w_720,ar_16:9,f_auto,q_auto,g_auto/images/GettyImages/mmsport/90min_fr_international_web/01h1pj9a7r7dtt2jj5rg.jpg",
    "https://www.challenges.fr/assets/img/2023/11/02/cover-r4x3w1200-653a54e864624-sipa-01127152-000127.jpg",
    "https://static.actu.fr/uploads/2023/12/31b956be5928a15b41e196104984e74642680006.jpg"
]

let selectedIndices = [];

// Fonction pour générer un index aléatoire non répété
export function generateUniqueRandomIndex(maxIndex) {
    let randomIndex = Math.floor(Math.random() * maxIndex);
    
    while (selectedIndices.includes(randomIndex)) {
        randomIndex = Math.floor(Math.random() * maxIndex); 
    }
    
    selectedIndices.push(randomIndex);
    
    if (selectedIndices.length === maxIndex) {
        selectedIndices = [];
    }
    
    return randomIndex;
}

async function fetchData() {
    try {
        const response = await fetch(url, requestOptions);
        if (!response.ok) {
            throw new Error(`Erreur lors de la requête: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();

        

    

        for (let news of data.articles) {
            const randomIndex = generateUniqueRandomIndex(images.length);
            news.urlToImage = images[randomIndex];
            const newMatch = new ArticleModel(new Article(
                    news.source,
                    news.author,
                    news.title,
                    news.description,
                    news.url,
                    news.urlToImage,
                    news.publishedAt,
                    news.content));
                    await newMatch.save();
        }
        console.log("Tous les articles ont été filtrés et traités avec succès.");
    } catch (error) {
        console.error('Erreur:', error);
        throw error;
    }
}

fetchData();


const newsDao = {
    findAllNews: async () => {
        const matches = await ArticleModel.find({});
        return matches.map(news => new Article(news));
    },
    removeAll: async () => {
        await ArticleModel.deleteMany({});
        console.log("Tous les articles ont été supprimés avec succès.");
    },
    add: async (articleData) => {
        const newArticle = new ArticleModel(articleData);
        await newArticle.save();
        console.log("L'article a été ajouté avec succès.");
        return newArticle;
    }
};

export default newsDao;






