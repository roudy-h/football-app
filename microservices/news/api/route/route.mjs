"use strict";
import express from 'express';
import newsController from '../controller/newsController.mjs';

const router = express.Router();

router.route('/news')
    .get(async (req, res) => {
        // #swagger.tags = ['News']
        // #swagger.summary = 'Tous les articles'
        // #swagger.description = 'Tous les articles disponibles'
        res.status(200).send(await newsController.findAllNews());
    });


export default router;