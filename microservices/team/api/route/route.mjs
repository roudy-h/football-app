"use strict";
import express from 'express';
import teamController from "../controller/teamController.mjs";

const router = express.Router();

router.route('/team')
    .get(async (req, res) => {
        // #swagger.tags = ['Team']
        // #swagger.summary = 'Toutes les équipes'
        // #swagger.description = 'Toutes les équipes du championnat de Ligue 1 de la saison actuelle'
        // #swagger.responses[200] = {description: 'Les équipes ont été trouvées.'}
        res.status(200).send(await teamController.findAll());
    })

router.route('/team/ranks')
    .get(async (req, res) => {
        // #swagger.tags = ['Team']
        // #swagger.summary = 'Le classement des équipes'
        // #swagger.description = 'Le classement actuel de toutes les équipes de Ligue 1 selon les résutats de leurs matchs finis'
        // #swagger.responses[200] = {description: 'Le classement à été créé.'}
        res.status(200).send(await teamController.findRank())
    })

  
router.route('/team/:code')
    .get(async (req, res) => {
        // #swagger.tags = ['Team']
        // #swagger.summary = 'Une équipe par son code'
        // #swagger.description = 'Une équipe du championnat de Ligue 1 de la saison actuelle par son code'
        try {
            const team = await teamController.findTeamByCode(req.params.code);
            if (team) {
                // #swagger.responses[200] = {description: 'L\'équipe a été trouvée.'}
                res.status(200).send(team)
            } else {
                // #swagger.responses[404] = {description: 'L\'équipe avec le code {code} n\'existe pas.'}
                res.status(404).send({message: "Team not found"})
            }
        } catch (e) {
            // #swagger.responses[404] = {description: 'L\'équipe avec le code {code} n\'existe pas.'}
            res.status(400).send({message: e});
        }
    });

export default router;