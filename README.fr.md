<h1 align="center">
  <br>
    <img src ="./assets/readme-logo-300-no-version.png" width="300"/>
    <br>
    <br>
  Outil de Performance pour React
    <br>
    <a href="https://osawards.com/react/"> Nominé aux React Open Source Awards 2020 </a>
  <br>
</h1>

<h4 align="center"> Reactime est un outil de performance et de débogage pour les développeurs React. Reactime enregistre un snapshot à chaque fois que l'état d'une application cible est modifié et permet à l'utilisateur de passer à tout état précédemment enregistré. </h4>

<br>
<p align="center">
  <a href="https://github.com/oslabs-beta/reactime">
    <img src="https://img.shields.io/github/license/oslabs-beta/reactime" alt="GitHub">
  </a>
  <a href="https://travis-ci.com/oslabs-beta/reactime">
    <img src="https://travis-ci.com/oslabs-beta/reactime.svg?branch=master" alt="Build Status">
  </a>  
  <a href="http://badge.fury.io/js/reactime">
    <img src="https://badge.fury.io/js/reactime.svg" alt="npm version">
  </a>  
    <img src="https://img.shields.io/badge/babel%20preset-airbnb-ff69b4" alt="BabelPresetPrefs">
    <img src="https://img.shields.io/badge/linted%20with-eslint-blueviolet" alt="LintPrefs">
</p>

<!-- [![GitHub](https://img.shields.io/github/license/oslabs-beta/reactime)](https://github.com/oslabs-beta/reactime) [![Build Status](https://travis-ci.com/oslabs-beta/reactime.svg?branch=master)](https://travis-ci.com/oslabs-beta/reactime) [![npm version](https://badge.fury.io/js/reactime.svg)](http://badge.fury.io/js/reactime) ![BabelPresetPrefs](https://img.shields.io/badge/babel%20preset-airbnb-ff69b4) ![LintPrefs](https://img.shields.io/badge/linted%20with-eslint-blueviolet) -->

<h5 align="center">
<br>
  <a href="./README.rus.md">🇷🇺  &nbsp; РУССКАЯ ВЕРСИЯ</a> &nbsp; • &nbsp;  <a href="./README.md">🇺🇸  &nbsp; ENGLISH VERSION </a>
  <br>
</h5>
<br>

<p align="center">
<img src="./assets/new-reactime.gif" />
</p>

<p align="center">
  <a href="#how-to-use">Manuel</a> • <a href="#features">Caractéristiques</a> • <a href="https://reactime.io">Website</a> • <a href="#readmore">En savoir plus</a>
</p>

Actuellement, Reactime est compatible avec les applications React qui utilisent des composants à état (stateful) et Hooks, avec un support en version bêta de Recoil et de pour le Context API.

<b>Reactime version 7.0</b> beta peut vous aider à éviter les ré-rendus inutiles. Identifier les rendus inutiles dans vos applications React est le point de départ idéal pour identifier la plupart des problèmes de performances.
La version beta 7.0 de Reactime corrige les bugs des anciennes versions et intègre des visualisations améliorées pour les relations entre les composants.
Reactime 7.0 inclut également une documentation [typedoc](https://typedoc.org/api/) plus approfondie pour les développeurs souhaitant contribuer au code source.

Après avoir installé Reactime, vous pouvez tester ses fonctionnalités avec votre application React en mode développement.

Veuillez noter que la fonction de saut de temps fonctionnera UNIQUEMENT lorsque votre application s'exécute en mode développement. En mode production, vous pouvez afficher la carte des composants de votre application, mais aucune fonctionnalité supplémentaire.

## <b>Installation</b>

Pour commencer, installer l’[extension](https://chrome.google.com/webstore/detail/reactime/cgibknllccemdnfhfpmjhffpjfeidjga) Reactime depuis le Chrome Web Store.

REMARQUE: L'[extension](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en) React Developer Tools est également requise pour que Reactime s'exécute, si vous ne l'avez pas déjà installé sur votre navigateur.

### <b>Installation Alternative</b>

Utilisez `src/extension/build/build.zip` pour une installation manuelle en [mode Développeur](https://developer.chrome.com/extensions/faq#faq-dev-01). Activez "Autoriser l'accès aux URL de fichiers" dans la page des détails de l'extension si vous effectuez un test local.

## <b>Manuel</b>

Après avoir installé l’extension Chrome Reactime, ouvrez votre application dans le navigateur.

Ensuite, ouvrez vos Chrome DevTools et accédez au panneau Reactime.

## <b>Diagnostic des anomalies</b>

### <b>Que faire quand Reactime ne trouve pas d’application React?</b>

Reactime s'exécute initialement à l'aide du hook global des outils de développement de l'API Chrome. Leur chargement dans Chrome peut prendre du temps. Essayez d'actualiser votre application plusieurs fois jusqu'à ce que Reactime s'exécute.

### <b>Un écran noir s’affiche à la place de l’extension Reactime</b>

Essayez d'actualiser l'application que vous souhaitez tester et actualisez les DevTools en cliquant sur le bouton droit de la souris «Recharger le cadre».

### <b>J’ai trouvé un bug dans Reactime</b>

Reactime est un projet open source, et toute aide de vore part sera grandement appréciée pour nous aider à améliorer l'expérience utilisateur. Veuillez créer une pull request (ou un problème) pour proposer et collaborer sur les modifications apportées à un référentiel.

## <b>Caractéristiques</b>

### Optimisation du rendu

L'un des problèmes les plus courants qui affectent les performances dans React est les cycles de rendu inutiles. Ce problème peut être résolu en vérifiant vos rendus dans l'onglet Performances de Chrome DevTools sous le panneau Reactime.

### Enregistrement

Chaque fois que l'état est changé (chaque fois que setState, useState est appelé), cette extension crée un snapshot de l'arbre d'état actuelle et l'enregistre. Chaque instantané sera affiché dans Chrome DevTools sous le panneau Reactime.

### Visualisation

Vous pouvez cliquer sur un snapshot pour afficher l'état de votre application. L'état peut être visualisé dans un graphique de composants, une arbre JSON ou un graphique de performances. Les snapshots peuvent être différents d'un snapshot précédent, et peut être visualisé en mode Diff.

### Jumping

À l'aide de la barre latérale des actions, un utilisateur peut accéder à n'importe quel snapshot enregistré précédemment. Appuyer sur le bouton de saut sur n'importe quel snapshot permettra à un utilisateur d'afficher les données d'état à tout moment dans l'historique de l'application cible.

### Support pour TypeScript

Reactime propose un support bêta pour les applications TypeScript utilisant des composants de classe avec état et des composants fonctionnels. Des tests et un développement supplémentaires sont nécessaires pour les hooks personnalisés, l'API de contexte et le mode Concurrent.

### Documentation

Après avoir cloné ce référentiel, les développeurs peuvent simplement exécuter `npm run docs` au niveau racine et servir le fichier `/docs/index.html` généré dynamiquement sur un navigateur. Cela fournira une vue GUI lisible, extensible et interactive de la structure et des interfaces de la base de code.

### <b>Caractéristiques supplémentaires</b>

- identifier les rendus inutiles
- fonctionnalité de survol pour afficher les détails des info-bulles sur les visualisations d'état
- possibilité de panoramique et de zoom sur les visualisations d'état
- une liste déroulante pour prendre en charge le développement de projets sur plusieurs onglets
- un curseur pour parcourir rapidement les snapshots
- un bouton de lecture pour se déplacer automatiquement dans les snapshots
- un bouton de verrouillage, qui arrête l'enregistrement de chaque snapshot
- un bouton persister pour conserver les snapshots lors de l'actualisation (pratique lors du changement de code et du débogage)
- télécharger les snapshots actuels en mémoire
- titres déclaratifs dans la barre latérale des actions

## <b>En savoir plus</b>

- [Time-Travel State with Reactime](https://medium.com/better-programming/time-traveling-state-with-reactime-6-0-53fdc3ae2a20)
- [React Fiber and Reactime](https://medium.com/@aquinojardim/react-fiber-reactime-4-0-f200f02e7fa8)
- [Meet Reactime - a time-traveling State Debugger for React](https://medium.com/@yujinkay/meet-reactime-a-time-traveling-state-debugger-for-react-24f0fce96802)
- [Deep in Weeds with Reactime, Concurrent React_fiberRoot, and Browser History Caching](https://itnext.io/deep-in-the-weeds-with-reactime-concurrent-react-fiberroot-and-browser-history-caching-7ce9d7300abb)

## <b>Auteurs</b>

- **Kris Sorensen** - [@kris-sorensen](https://github.com/kris-sorensen)
- **Daljit Gill** - [@dgill05](https://github.com/dgill05)
- **Ben Michareune** - [@bmichare](https://github.com/bmichare)
- **Dane Corpion** - [@danecorpion](https://github.com/danecorpion)
- **Becca Viner** - [@rtviner](https://github.com/rtviner)
- **Caitlin Chan** - [@caitlinchan23](https://github.com/caitlinchan23)
- **Kim Mai Nguyen** - [@Nkmai](https://github.com/Nkmai)
- **Tania Lind** - [@lind-tania](https://github.com/lind-tania)
- **Alex Landeros** - [@AlexanderLanderos](https://github.com/AlexanderLanderos)
- **Chris Guizzetti** - [@guizzettic](https://github.com/guizzettic)
- **Jason Victor** - [@theqwertypusher](https://github.com/Theqwertypusher)
- **Sanjay Lavingia** - [@sanjaylavingia](https://github.com/sanjaylavingia)
- **Vincent Nguyen** - [@VNguyenCode](https://github.com/VNguyenCode)
- **Haejin Jo** - [@haejinjo](https://github.com/haejinjo)
- **Hien Nguyen** - [@hienqn](https://github.com/hienqn)
- **Jack Crish** - [@JackC27](https://github.com/JackC27)
- **Kevin Fey** - [@kevinfey](https://github.com/kevinfey)
- **Carlos Perez** - [@crperezt](https://github.com/crperezt)
- **Edwin Menendez** - [@edwinjmenendez](https://github.com/edwinjmenendez)
- **Gabriela Jardim Aquino** - [@aquinojardim](https://github.com/aquinojardim)
- **Greg Panciera** - [@gpanciera](https://github.com/gpanciera)
- **Nathanael Wa Mwenze** - [@nmwenz90](https://github.com/nmwenz90)
- **Ryan Dang** - [@rydang](https://github.com/rydang)
- **Bryan Lee** - [@mylee1995](https://github.com/mylee1995)
- **Josh Kim** - [@joshua0308](https://github.com/joshua0308)
- **Sierra Swaby** - [@starkspark](https://github.com/starkspark)
- **Ruth Anam** - [@peachiecodes](https://github.com/peachiecodes)
- **David Chai** - [@davidchaidev](https://github.com/davidchai717)
- **Yujin Kang** - [@yujinkay](https://github.com/yujinkay)
- **Andy Wong** - [@andywongdev](https://github.com/andywongdev)
- **Chris Flannery** - [@chriswillsflannery](https://github.com/chriswillsflannery)
- **Rajeeb Banstola** - [@rajeebthegreat](https://github.com/rajeebthegreat)
- **Prasanna Malla** - [@prasmalla](https://github.com/prasmalla)
- **Rocky Lin** - [@rocky9413](https://github.com/rocky9413)
- **Abaas Khorrami** - [@dubalol](https://github.com/dubalol)
- **Ergi Shehu** - [@Ergi516](https://github.com/ergi516)
- **Raymond Kwan** - [@rkwn](https://github.com/rkwn)
- **Joshua Howard** - [@Joshua-Howard](https://github.com/joshua-howard)

## <b>License </b>

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails
