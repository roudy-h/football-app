"use strict";
import express from 'express';
import userController from "../controller/userController.mjs";
import jwt from 'jsonwebtoken';
import authenticateToken from '../../jwt.mjs';

const router = express.Router();

router.
    route('/user')
        .get(async (req, res) => {
            // #swagger.tags = ['User']
            // #swagger.summary = 'Tous les utilisateurs'
            // #swagger.description = 'Tous les utilisateurs inscrits'
            res.status(200).send((await userController.findAll()).map(user => user.getInfos()));
        })
        .post(async (req, res) => {
            // #swagger.tags = ['User']
            // #swagger.summary = 'Créer un utilisateur'
            // #swagger.description = 'Créer un nouvel utilisateur'
            /* #swagger.parameters['body'] = {
            in: 'body',
            description: 'Informations de l\'utilisateur',
            schema: {
                $firstName: 'Albert',
                $lastName: 'Dupont',
                $email: 'albert.dupont@mail.com',
                $password: 'password'
                }
            } */
            try {
                const user = await userController.add(req.body);
                // #swagger.responses[201] = {description: 'L\'utilisateur a été créé.'}
                // #swagger.responses[201] = {schema: {user: 'l\'utilisateur', accessToken: 'accessToken'}}
                const accessToken = jwt.sign({email: user.email}, process.env.ACCESS_TOKEN_SECRET);
                res.status(201).send({user: user, accessToken: accessToken});
            } catch (error) {
                // #swagger.responses[400] = {description: 'Erreur lors de la création de l\'utilisateur.'}
                res.status(400).send({message: "Error while creating user"});
            }
        })
        .put(authenticateToken, async (req, res) => {
            // #swagger.tags = ['User']
            // #swagger.summary = 'Modifier un utilisateur'
            // #swagger.description = 'Modifier un utilisateur'
            /* #swagger.parameters['Authorization'] = {
              in: 'header',
              description: 'JWT Bearer token',
              required: true,
              type: 'string',
              default: 'Bearer <token>'
            }*/
            /* #swagger.parameters['body'] = {
                in: 'body',
                description: 'Informations de l\'utilisateur',
                schema: {
                    $firstName: 'Albert',
                    $lastName: 'Dupont',
                    $email: 'albert.dupont@mail.com'
                }
                } */
            try {
                const user = await userController.update(req.body);
                // #swagger.responses[200] = {description: 'L\'utilisateur a été modifié.'}
                res.status(200).send({user: user.getInfos()});
            } catch (error) {
                // #swagger.responses[400] = {description: 'Erreur lors de la modification de l\'utilisateur.'}
                res.status(400).send({message: error});
            }
        })
        .delete(authenticateToken, async (req, res) => {
            // #swagger.tags = ['User']
            // #swagger.summary = 'Supprimer un utilisateur'
            // #swagger.description = 'Supprimer un utilisateur'
            /* #swagger.parameters['Authorization'] = {
                  in: 'header',
                  description: 'JWT Bearer token',
                  required: true,
                  type: 'string',
                  default: 'Bearer <token>'
            }*/
            /*  #swagger.parameters['body'] = {
            in: 'body',
            description: 'Informations de l\'utilisateur',
            schema: {
                $email: 'albert.dupont@mail.com',
              }
            } */
            // #swagger.parameters['authorization'] = {description: 'Bearer accessToken', type: 'string'}
            const response = await userController.removeByEmail(req.user.email);
            if (response) {
                // #swagger.responses[200] = {description: 'L\'utilisateur a été supprimé.'}
                res.status(200).send({message: 'User deleted'});
            } else {
                // #swagger.responses[404] = {description: 'L\'utilisateur n\'existe pas.'}
                res.status(404).send({message: 'User does not exist'});
            }
        });

router
    .route('/login')
        .post(async (req, res) => {
            // #swagger.tags = ['User']
            // #swagger.summary = 'Se connecter'
            // #swagger.description = 'Se connecter à son compte'
            /*  #swagger.parameters['body'] = {
                in: 'body',
                description: 'Informations de connexion',
                schema: {
                    $email: 'alice@mail.com',
                    $password: 'password'
                    }
                }
             */
            try {
                const user = await userController.login(req.body);
                // #swagger.responses[200] = {description: 'Connexion réussie.'}
                // #swagger.responses[200] = {schema: {accessToken : 'accessToken'}}
                const accessToken = jwt.sign({email: user.email}, process.env.ACCESS_TOKEN_SECRET);
                res.status(200).send({user: user, accessToken: accessToken});
            } catch (error) {
                // #swagger.responses[400] = {description: 'Erreur lors de la connexion.'}
                res.status(400).send({message: "Invalid credentials"});
            }
        });

router.route('/account')
    .get(authenticateToken, async (req, res) => {
        // #swagger.tags = ['User']
        // #swagger.summary = 'Informations d\'un utilisateur'
        // #swagger.description = 'Informations d\'un compte utilisateur'
        /* #swagger.parameters['Authorization'] = {
          in: 'header',
          description: 'JWT Bearer token',
          required: true,
          type: 'string',
          default: 'Bearer <token>'
        }*/
        res.status(200).send(await userController.findUserByEmail(req.user.email));
    })

export default router;