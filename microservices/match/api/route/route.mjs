"use strict";
import express from 'express';
import matchController from "../controller/matchController.mjs";

const router = express.Router();

router.route('/match')
    .get(async (req, res) => {
        // #swagger.tags = ['Match']
        // #swagger.summary = 'Tous les matches de la saison'
        // #swagger.description = 'Tous les matches de la saison du championnat de Ligue 1'
        // #swagger.responses[200] = {description: 'Les matches ont été trouvés.'}
        res.status(200).send(await matchController.findAllMatch());
    });

router.route('/match/current')
    .get(async (req, res) => {
        // #swagger.tags = ['Match']
        // #swagger.summary = 'Tous les matches en cours ou à venir'
        // #swagger.description = 'Tous les matches en cours ou à venir du championnat de Ligue 1 de la saison courante'
        // #swagger.responses[200] = {description: 'Les matches en cours ou à venir ont été trouvés.'}
        res.status(200).send(await matchController.findCurrentMatch());
    });


router.route('/match/day/:day')
    .get(async (req, res) => {
        // #swagger.tags = ['Match']
        // #swagger.summary = 'Tous les matches d\'une journée'
        // #swagger.description = 'Tous les matches d\'une journée du championnat de Ligue 1 de la saison actuelle'
        // #swagger.parameters['day'] = {description: 'Numéro de la journée', type: 'integer'}
        try {
            // #swagger.responses[200] = {description: 'Les matches de la journée {day} ont été trouvés.'}
            res.status(200).send(await matchController.findMatchByDay(req.params.day));
        } catch (e) {
            // #swagger.responses[400] = {description: 'Le numéro de journée doit être compris entre 1 et 34.'}
            res.status(400).send({message: e});
        }
    })

router.route('/match/:id')
    .get(async (req, res) => {
        // #swagger.tags = ['Match']
        // #swagger.summary = 'Un match par son id'
        // #swagger.description = 'Un match du championnat de Ligue 1 de la saison actuelle par son id'
        // #swagger.parameters['id'] = {description: 'Identifiant du match', type: 'integer'}
        try {
            const match = await matchController.findMatchById(req.params.id);
            if (match) {
                // #swagger.responses[200] = {description: 'Le match a été trouvé.'}
                res.status(200).send(match);
            } else {
                // #swagger.responses[404] = {description: 'Le match avec l\'id {id} n\'existe pas.'}
                res.status(404).send({message: `Match with id ${req.params.id} does not exist`});
            }
        } catch (e) {
            // #swagger.responses[400] = {description: 'L\'id du match doit être un entier.'}
            res.status(400).send({message: e});
        }
    });

export default router;