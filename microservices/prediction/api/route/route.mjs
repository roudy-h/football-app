"use strict";
import express from 'express';
import predictionController from "../controller/predictionController.mjs";

const router = express.Router();

router.route('/prediction')
    .get(async (req, res) => {
        // #swagger.tags = ['Prediction']
        // #swagger.summary = 'Toutes les prédictions'
        // #swagger.description = 'Toutes les prédictions des utilisateurs pour les matchs'
        // #swagger.responses[200] = {description: 'Les prédictions ont été trouvées'}
        res.status(200).send(await predictionController.findAll());
    })
    .post(async (req, res) => {
        // #swagger.tags = ['Prediction']
        // #swagger.summary = 'Ajouter une prédiction'
        // #swagger.description = 'Ajouter une prédiction pour un match'
        /* #swagger.parameters['Authorization'] = {
          in: 'header',
          description: 'JWT Bearer token',
          required: true,
          type: 'string',
          default: 'Bearer <token>'
        }*/
        /* #swagger.parameters['body'] = {
            in: 'body',
            description: 'Informations de la prédiction',
            schema: {
                $matchId: 1,
                $prediction: 'home'
            }
        } */
        try {
            // #swagger.responses[201] = {description: 'La prédiction a été ajoutée.'}
            res.status(201).send(await predictionController.add(req.body, req.headers.authorization.split(' ')[1]));
        } catch (error) {
            // #swagger.responses[400] = {description: 'Erreur lors de l\'ajout de la prédiction.'}
            res.status(400).send({message: error});
        }
    });

router.route('/prediction/match/:id')
    .get(async (req, res) => {
        // #swagger.tags = ['Prediction']
        // #swagger.summary = 'Prédictions d\'un match'
        // #swagger.description = 'Prédictions d\'un match'
        // #swagger.parameters['id'] = {description: 'Identifiant du match', type: 'integer'}
       try {
           // #swagger.responses[200] = {description: 'Les prédictions du match ont été trouvées.'}
           res.status(200).send(await predictionController.findPredictionsByMatchId(req.params.id));
       } catch (error) {
              // #swagger.responses[400] = {description: 'Erreur lors de la recherche des prédictions du match.'}
           res.status(400).send({message: error});
       }
    });

router.route('/prediction/user')
    .get(async (req, res) => {
        // #swagger.tags = ['Prediction']
        // #swagger.summary = 'Prédictions d\'un utilisateur'
        // #swagger.description = 'Prédictions d\'un utilisateur'
        /* #swagger.parameters['Authorization'] = {
          in: 'header',
          description: 'JWT Bearer token',
          required: true,
          type: 'string',
          default: 'Bearer <token>'
        }*/
        try {
            // #swagger.responses[200] = {description: 'Les prédictions de l\'utilisateur ont été trouvées.'}
            res.status(200).send(await predictionController.findPredictionsByUser(req.headers.authorization.split(' ')[1]));
        } catch (e) {
            res.status(400).send({message: e});
        }
    })

export default router;