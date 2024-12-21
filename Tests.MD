# Tests

D'abord, il faut se placer dans le dossier `microservices` :

## Tests des micro-services News

Pour lancer les tests des micro-services News, il faut se placer dans le
dossier `news` et exécuter la commande suivante :

```bash
npm install
npm test
```

## Tests des micro-services Match

Pour lancer les tests des micro-services Match, il faut se placer dans le
dossier `match` et exécuter les commandes suivantes :

```bash
npm install
npm test
```

## Tests des micro-services User

Pour lancer les tests des micro-services User, il faut se placer dans le
dossier `user` et exécuter les commandes suivantes :

```bash
npm install
npm test
```

## Tests des micro-services Team

Pour lancer les tests des micro-services Team, il d'abord lancé le micro-service
`match` en se plaçant dans le dossier `match` et en exécutant les commandes suivantes :

```bash
npm install # Si ce n'est pas déjà fait
npm start
```

Puis, il faut se placer dans le dossier `team` et exécuter les 
commandes suivantes :

```bash
npm install
npm test
```

## Tests des micro-services Prediction

Pour lancer les tests des micro-services Prediction, il faut avoir 
lancé les micro-services `match` et `user` en se plaçant dans 
les dossiers respectifs et en exécutant les commandes suivantes :

```bash
npm install # Si ce n'est pas déjà fait
npm start
```

Puis, il faut se placer dans le dossier `prediction` et exécuter les commandes suivantes :

```bash
npm install
npm test
```