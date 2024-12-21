import React, { useState, useEffect } from 'react';
import NewsDao from '../../dao/DAOnews.mjs';
import "./Actualite.css";

/**
 * Composant New : affiche une actualité sous forme de carte
 * @param title
 * @param image
 * @param author
 * @param url
 * @param publishedAt
 * @returns {Element}
 * @constructor
 */
export function New({ title, image, author, url, publishedAt }) {
    return (
        <div className="container2">
        
            <div className="details">
                <h3 className="titre">{title}</h3>
                <img className="image" src={image} width="800px" alt="image"/>
                <p>Date de publication : {publishedAt.substring(0, 10)} à {publishedAt.substring(11, 16)}</p>
                <p className="author">Auteur : {author}</p>
                <button className='button'><a href={url} target='_blank'>Lire cet article</a></button>
            </div>
        </div>
    );
}

export default function PageNews() {
    const [data, setData] = useState([]);


    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const data = await NewsDao.returnAllArticles()
                setData(data)
            } catch (error) {
                console.error('Erreur lors du chargement des actualités:', error);
            }
        };

        fetchArticles();
    }, []);

    return (
        <div>
            <h1>Actualités du moment</h1>
            {data.length > 0 ? (
                <div>
                    {data.map((article, index) => (
                        <New
                            key={index}
                            title={article.source.title}
                            image={article.source.urlToImage}
                            author={article.source.author}
                            url={article.source.url}
                            publishedAt={article.source.publishedAt}
                        />
                    ))}
                </div>
            ) : (
                <p>Monsieur Berdjugin cherche vos actualités à travers un bon café...</p>
            )}
        </div>
    );
}
