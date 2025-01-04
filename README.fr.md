<!-- Fichier : README.fr.md -->
<h1 align="center">
    <img src ="./assets/logos/marqueePromoTitle.png"/>
  Outil de Performance React
    <br>
    <a href="https://osawards.com/react/">🏆 Nominé pour les React Open Source Awards 2020</a>
  <br>
</h1>

<h4 align="center">Une puissante extension Chrome qui améliore le développement React grâce au débogage avec retour dans le temps et à la surveillance avancée des performances</h4>
<br>

<p align="center">
  <a href="https://chrome.google.com/webstore/detail/reactime/cgibknllccemdnfhfpmjhffpjfeidjga">
    <img src="https://img.shields.io/chrome-web-store/v/cgibknllccemdnfhfpmjhffpjfeidjga" alt="Chrome Web Store" />
  </a>
  <a href="https://chrome.google.com/webstore/detail/reactime/cgibknllccemdnfhfpmjhffpjfeidjga">
    <img src="https://img.shields.io/chrome-web-store/users/cgibknllccemdnfhfpmjhffpjfeidjga" alt="Utilisateurs sur le Chrome Web Store" />
  </a>
  <a href="https://chrome.google.com/webstore/detail/reactime/cgibknllccemdnfhfpmjhffpjfeidjga">
    <img src="https://img.shields.io/chrome-web-store/rating/cgibknllccemdnfhfpmjhffpjfeidjga" alt="Évaluation sur le Chrome Web Store" />
  </a>
</p>

<h5 align="center">
<br>
  <a href="./README.rus.md">🇷🇺  &nbsp; РУССКАЯ ВЕРСИЯ</a> &nbsp; • &nbsp;  <a href="./README.md">🇺🇸  &nbsp; ENGLISH VERSION </a> &nbsp; • &nbsp; <a href='./src/DEVELOPER_README.md'>👩‍💻 README Développeur</a>
  <br>
</h5>
<br>

<p align="center">
<img src="./assets/gifs/GeneralDemoGif_V26.gif" />
</p>

## <h1>✨ Fonctionnalités Clés</h1>

### 🔍 Visualisation de l'État

- **Vues Multiples** : Visualisez l’état de votre application via des Graphiques de Composants, des Arborescences JSON, des Graphiques de Performances et des Arbres d’Accessibilité
- **Historique Chronologique** : Suivez l’évolution de l’état dans le temps grâce à une représentation intuitive de l’historique
- **Métriques Web** : Surveillez en temps réel les métriques de performance essentielles
- **Aperçus d’Accessibilité** : Analysez l’arbre d’accessibilité de votre application pour chaque changement d’état
  <br>

<p>Sur la page principale, vous disposez de deux choix principaux depuis le menu déroulant :</p>

- **Timejump** : Consultez et naviguez dans l’historique des snapshots de l’état de votre application. Vous pouvez revenir à n’importe quel point dans le temps pour observer l’évolution de l’état au fil des modifications. Vous pouvez également utiliser le bouton de lecture pour rejouer chaque changement d’état automatiquement.
- **Providers / Consumers** : Comprenez mieux les dépendances de contexte de votre application et leurs interactions grâce à une visualisation des relations entre fournisseurs et consommateurs.
  <br>

<p align="center">
<img src="./assets/gifs/ProviderConsumer_V26.gif" />
</p>
<br>

### ⏱️ Débogage avec Retour dans le Temps

- **Snapshots d’État** : Capturez et naviguez à travers l’historique d’état de votre application
- **Commandes de Lecture** : Rejouez automatiquement les changements d’état avec une vitesse ajustable
- **Points de Saut** : Naviguez instantanément vers n’importe quel état antérieur
- **Comparaisons Diff** : Comparez l’état entre différents snapshots
  <br>

<p align="center">
<img src="./assets/gifs/TimeTravelGif_V26.gif" />
</p>
<br>

### 📊 Analyse de Performance

- **Métriques de Composants** : Mesurez les temps de rendu et identifiez les goulets d’étranglement
- **Comparaison de Séries** : Comparez les performances sur différentes séries de changements d’état
- **Détection de Re-rendu** : Identifiez et corrigez les rendus inutiles
- **Web Vitals** : Surveillez les Core Web Vitals et d’autres métriques de performance
  <br>
  <br>

### 🔄 Prise en Charge des Frameworks Modernes

<ul>
  <li>
    Compatibilité complète avec <strong>Gatsby, Next.js et Remix</strong>
  </li>
    <li>
Prise en charge de TypeScript pour les composants de classe et fonctionnels
  </li>
    <li>
Prise en charge des Hooks et de l’API Context de React
  </li>
</ul>
<br>

### 💾 Persistance & Partage d’État

Reactime facilite la sauvegarde et le partage de l’historique d’état de votre application :

- **Exporter l’Historique d’État** : Enregistrez vos snapshots sous forme de fichier JSON pour une analyse ultérieure ou pour les partager
- **Importer des Sessions Précédentes** : Chargez des snapshots enregistrés précédemment pour comparer les changements d’état entre différentes sessions
- **Analyse Inter-Session** : Comparez les performances et les changements d’état entre différentes sessions de développement
  <br>

<p align="center">
<img src="./assets/gifs/ImportExportGif_V26.gif" />
</p>
<br>

### 📚 Documentation Interactive

Reactime propose une documentation complète pour aider les développeurs à comprendre son architecture et ses APIs.  
Après avoir cloné ce référentiel, les développeurs peuvent simplement exécuter `npm run docs` à la racine et servir le fichier `/docs/index.html` généré dynamiquement, offrant :

<ul>
  <li>
  Des diagrammes interactifs de composants
  </li>
    <li>
Des définitions de types et interfaces
  </li>
    <li>
Une vue d’ensemble de l’architecture du code
  </li>
      <li>
Des références d’API et des exemples
  </li>
</ul>
<br>

<h1>🎉 Nouveautés !</h1>

La version 26.0 de Reactime propose une refonte complète de l’expérience de débogage React, avec :

- **Nouvelle Visualisation des Données de Contexte**

  - Première visualisation des changements d’état du hook useContext
  - Cartographie claire des relations fournisseur-consommateur
  - Surveillance en temps réel de la valeur d’état du contexte
  - Visualisation détaillée des données du fournisseur

- **Débogage avec Retour dans le Temps Amélioré**

  - Interface du curseur de temps repensée, positionnée à côté des snapshots
  - Contrôles de vitesse de lecture variables
  - Navigation plus intuitive dans l’état
  - Visualisation de snapshot améliorée

- **Refonte Complète de l’UI Moderne**

  - Design élégant et contemporain avec composants arrondis
  - Améliorations de la disposition pour une meilleure intuitivité
  - Nouveau mode sombre
  - Hiérarchie visuelle améliorée

- **Améliorations Techniques Majeures**
  - Correction de la persistance de connexion lors de périodes d’inactivité et de changements d’onglet
  - Restauration de la visualisation de l’arbre d’accessibilité
  - Résolution de problèmes de capture d’état pour les hooks useState basés sur des fonctions
  - Fiabilité et performance globales de l’extension grandement améliorées

Ces mises à jour rendent Reactime plus puissant, plus fiable et plus convivial que jamais, établissant un nouveau standard pour les outils de débogage React.

Pour en savoir plus sur les versions précédentes, cliquez <a href="https://github.com/open-source-labs/reactime/releases">ici</a> !
<br>
<br>

<h1>🚀 Bien Commencer</h1>

### Installation

1. Installez l’[extension Reactime](https://chrome.google.com/webstore/detail/reactime/cgibknllccemdnfhfpmjhffpjfeidjga) depuis le Chrome Web Store
2. Installez l’extension requise [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en) si vous ne l’avez pas déjà

### Prérequis

- Votre application React doit fonctionner en **mode développement**
- L’extension React Developer Tools doit être installée
- Navigateur Chrome (version 80 ou supérieure recommandée)

### Lancer Reactime

Il existe deux manières d’ouvrir le panneau Reactime :

1. **Menu Contextuel**

   - Faites un clic droit n’importe où dans votre application React
   - Sélectionnez "Reactime" dans le menu contextuel

2. **DevTools**
   - Ouvrez les DevTools de Chrome (F12 ou ⌘+⌥+I)
   - Naviguez jusqu’à l’onglet "Reactime"

Une fois lancé, Reactime commencera automatiquement à surveiller les changements d’état et les métriques de performance de votre application.
<br>
<br>

<h1>🤝 Contribuer à Reactime</h1>

Nous accueillons avec joie les contributions de développeurs de tous niveaux ! Voici comment vous pouvez aider à améliorer Reactime: <a href='./CONTRIBUTING.md'>🙋 Contributing README</

1. **Commencer**

   - Forkez le dépôt
   - Consultez notre README Développeur détaillé
   - Mettez en place votre environnement de développement local

2. **Processus de Build**

   - Suivez les instructions de build dans le README Développeur
   - Testez soigneusement vos modifications
   - Soumettez une Pull Request

Rejoignez notre communauté grandissante de contributeurs et participez à façonner l’avenir des outils de débogage React ! Pour des lignes directrices de contribution plus détaillées et des informations sur l’architecture du projet, veuillez vous référer à notre <a href='./src/DEVELOPER_README.md'>👩‍💻 README Développeur</a>.
<br>
<br>

<h1>🛠️ Dépannage</h1>

### ❓ <b>Pourquoi Reactime n’enregistre-t-il pas les nouveaux changements d’état ?</b>

Reactime a perdu sa connexion avec l’onglet que vous surveillez ; il vous suffit de cliquer sur le bouton "reconnecter"
pour reprendre votre travail.

### ❓ <b>Pourquoi Reactime ne trouve-t-il pas mes hooks ?</b>

Reactime détecte et surveille les hooks en parcourant le code React non minifié de votre application en mode développement. Si votre processus de build minifie ou "uglifie" votre code — même pour les builds de développement — Reactime risque de ne pas pouvoir localiser et suivre correctement vos hooks. Pour résoudre ce problème :

1. **Assurez-vous d’une vraie build de développement** : Vérifiez la configuration de votre bundler ou outil de build (par ex. Webpack, Babel, Vite, etc.) pour vous assurer que votre application n’est pas minimisée ou "uglifiée" en mode développement.

   - Par exemple, avec Webpack, assurez-vous d’exécuter le mode : 'development', ce qui devrait désactiver la minification par défaut.
   - Dans un projet Create React App, il suffit d’exécuter `npm start` ou `yarn start` pour configurer automatiquement une build de développement non minifiée.

2. **Vérifiez les surcharges** : Assurez-vous qu’aucun plugin Babel ou Webpack personnalisé ne minifie votre code, surtout si vous utilisez des frameworks comme Next.js ou Gatsby. Parfois, des plugins ou scripts supplémentaires peuvent s’exécuter en arrière-plan.

3. **Redémarrez & recompilez** : Après avoir modifié toute configuration de build, recompilez ou redémarrez votre serveur de développement pour vous assurer que la nouvelle configuration est prise en compte. Ensuite, rafraîchissez l’onglet de votre navigateur afin que Reactime puisse détecter vos hooks non minifiés.

Après avoir modifié toute configuration de build, recompilez ou redémarrez votre serveur de développement pour vous assurer que la nouvelle configuration est prise en compte. Ensuite, rafraîchissez l’onglet de votre navigateur afin que Reactime puisse détecter vos hooks non minifiés.

### ❓ <b>Pourquoi Reactime m’indique qu’aucune application React n’a été trouvée ?</b>

Reactime s’exécute initialement grâce au hook global des dev tools de Chrome.  
Il faut du temps à Chrome pour le charger. Essayez de rafraîchir votre application plusieurs fois jusqu’à ce que vous voyiez Reactime en fonctionnement.

### ❓ <b>Pourquoi dois-je avoir les React Dev Tools activées ?</b>

Reactime fonctionne de concert avec les React Developer Tools pour accéder à l’arbre Fiber d’une application React ; en interne, Reactime parcourt l’arbre Fiber via le hook global des React Dev Tools, récupérant toutes les informations pertinentes à afficher au développeur.

### ❓ <b>J’ai trouvé un bug dans Reactime</b>

Reactime est un projet open-source, et nous serions ravis d’avoir vos retours pour améliorer l’expérience utilisateur. Veuillez consulter le <a href='./src/DEVELOPER_README.md'>👩‍💻 README Développeur</a>,
et créer une Pull Request (ou une issue) pour proposer et collaborer sur des modifications de Reactime.

### ❓ <b>Compatibilité avec les versions Node</b>

Depuis la sortie de Node v18.12.1 (LTS) le 04/11/22, le script a été mis à jour avec
`npm run dev` | `npm run build` pour assurer une rétrocompatibilité.<br/>  
Pour la version Node v16.16.0, veuillez utiliser les scripts `npm run devlegacy` | `npm run buildlegacy`
<br>
<br>

<h1>✍️ Auteurs</h1>

- **Garrett Chow** - [@garrettlchow](https://github.com/garrettlchow)
- **Ellie Simens** - [@elliesimens](https://github.com/elliesimens)
- **Ragad Mohammed** - [@ragad-mohammed](https://github.com/ragad-mohammed)
- **Daniel Ryczek** - [@dryczek14](https://github.com/dryczek01)
- **Patrice Pinardo** - [@pinardo88](https://github.com/pinardo88)
- **Haider Ali** - [@hali03](https://github.com/hali03)
- **Jose Luis Sanchez** - [@JoseSanchez1996](https://github.com/JoseSanchez1996)
- **Logan Nelsen** - [@ljn16](https://github.com/ljn16)
- **Mel Koppens** - [@MelKoppens](https://github.com/MelKoppens)
- **Amy Yang** - [@ay7991](https://github.com/ay7991)
- **Eva Ury** - [@evaSUry](https://github.com/evaSUry)
- **Jesse Guerrero** - [@jguerrero35](https://github.com/jguerrero35)
- **Oliver Cho** - [@Oliver-Cho](https://github.com/Oliver-Cho)
- **Ben Margolius** - [@benmarg](https://github.com/benmarg)
- **Eric Yun** - [@ericsngyun](https://github.com/ericsngyun)
- **James Nghiem** - [@jemzir](https://github.com/jemzir)
- **Wilton Lee** - [@wiltonlee948](https://github.com/wiltonlee948)
- **Louis Lam** - [@llam722](https://github.com/llam722)
- **Samuel Tran** - [@leumastr](https://github.com/leumastr)
- **Brian Yang** - [@yangbrian310](https://github.com/yangbrian310)
- **Emin Tahirov** - [@eminthrv](https://github.com/eminthrv)
- **Peng Dong** - [@d28601581](https://github.com/d28601581)
- **Ozair Ghulam** - [@ozairgh](https://github.com/ozairgh)
- **Christina Or** - [@christinaor](https://github.com/christinaor)
- **Khanh Bui** - [@AndyB909](https://github.com/AndyB909)
- **David Kim** - [@codejunkie7](https://github.com/codejunkie7)
- **Robby Tipton** - [@RobbyTipton](https://github.com/RobbyTipton)
- **Kevin HoEun Lee** - [@khobread](https://github.com/khobread)
- **Christopher LeBrett** - [@fscgolden](https://github.com/fscgolden)
- **Joseph Park** - [@joeepark](https://github.com/joeepark)
- **Kris Sorensen** - [@kris-sorensen](https://github.com/kris-sorensen)
- **Daljit Gill** - [@dgill05](https://github.com/dgill05)
- **Ben Michareune** - [@bmichare](https://github.com/bmichare)
- **Dane Corpion** - [@danecorpion](https://github.com/danecorpion)
- **Harry Fox** -
  [@StackOverFlowWhereArtThou](https://github.com/StackOverFlowWhereArtThou)
- **Nathan Richardson** - [@BagelEnthusiast](https://github.com/BagelEnthusiast)
- **David Bernstein** - [@dangitbobbeh](https://github.com/dangitbobbeh)
- **Joseph Stern** - [@josephiswhere](https://github.com/josephiswhere)
- **Dennis Lopez** - [@DennisLpz](https://github.com/DennisLpz)
- **Cole Styron** - [@colestyron](https://github.com/C-STYR)
- **Ali Rahman** - [@CourageWolf](https://github.com/CourageWolf)
- **Caner Demir** - [@demircaner](https://github.com/demircaner)
- **Kevin Ngo** - [@kev-ngo](https://github.com/kev-ngo)
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
- **Ruth Anam** - [@nusanam](https://github.com/nusanam)
- **David Chai** - [@davidchaidev](https://github.com/davidchai717)
- **Yujin Kang** - [@yujinkay](https://github.com/yujinkay)
- **Andy Wong** - [@andynullwong](https://github.com/andynullwong)
- **Chris Flannery** -
  [@chriswillsflannery](https://github.com/chriswillsflannery)
- **Rajeeb Banstola** - [@rajeebthegreat](https://github.com/rajeebthegreat)
- **Prasanna Malla** - [@prasmalla](https://github.com/prasmalla)
- **Rocky Lin** - [@rocky9413](https://github.com/rocky9413)
- **Abaas Khorrami** - [@dubalol](https://github.com/dubalol)
- **Ergi Shehu** - [@Ergi516](https://github.com/ergi516)
- **Raymond Kwan** - [@rkwn](https://github.com/rkwn)
- **Joshua Howard** - [@joshua-howard](https://github.com/joshua-howard)
- **Lina Shin** - [@rxlina](https://github.com/rxlina)
- **Andy Tsou** - [@andytsou19](https://github.com/andytsou19)
- **Feiyi Wu** - [@FreyaWu](https://github.com/FreyaWu)
- **Viet Nguyen** - [@vnguyen95](https://github.com/vnguyen95)
- **Alex Gomez** - [@alexgomez9](https://github.com/alexgomez9)
- **Edar Liu** - [@liuedar](https://github.com/liuedar)
- **Kristina Wallen** - [@kristinawallen](https://github.com/kristinawallen)
- **Quan Le** - [@Blachfog](https://github.com/Blachfog)
- **Robert Maeda** - [@robmaeda](https://github.com/robmaeda)
- **Lance Ziegler** - [@lanceziegler](https://github.com/lanceziegler)
- **Ngoc Zwolinski** - [@ngoczwolinski](https://github.com/ngoczwolinski)
- **Peter Lam** - [@dev-plam](https://github.com/dev-plam)
- **Zachary Freeman** - [@zacharydfreeman](https://github.com/zacharydfreeman/)
- **Jackie Yuan** - [@yuanjackie1](https://github.com/yuanjackie1)
- **Jasmine Noor** - [@jasnoo](https://github.com/jasnoo)
- **Minzo Kim** - [@minzo-kim](https://github.com/minzo-kim)
- **Mark Teets** - [@MarkTeets](https://github.com/MarkTeets)
- **Nick Huemmer** - [@NickHuemmer](https://github.com/ElDuke717)
- **James McCollough** - [@j-mccoll](https://github.com/j-mccoll)
- **Mike Bednarz** - [@mikebednarz](https://github.com/mikebednarz)
- **Sergei Liubchenko** - [@sergeylvq](https://github.com/sergeylvq)
- **Yididia Ketema** - [@yididiaketema](https://github.com/yididiaketema)
- **Morah Geist** - [@morahgeist](https://github.com/morahgeist)
- **Eivind Del Fierro** - [@EivindDelFierro](https://github.com/EivindDelFierro)
- **Kyle Bell** - [@KyEBell](https://github.com/KyEBell)
- **Sean Kelly** - [@brok3turtl3](https://github.com/brok3turtl3)
- **Christopher Stamper** - [@ctstamper](https://github.com/ctstamper)
- **Jimmy Phy** - [@jimmally](https://github.com/jimmally)
- **Andrew Byun** - [@AndrewByun](https://github.com/AndrewByun)
- **Kelvin Mirhan** - [@kelvinmirhan](https://github.com/kelvinmirhan)
- **Jesse Rosengrant** - [@jrosengrant](https://github.com/jrosengrant)
- **Liam Donaher** - [@leebology](https://github.com/leebology)
- **David Moore** - [@Solodt55](https://github.com/Solodt55)
- **John Banks** - [@Jbanks123](https://github.com/Jbanks123)
  <br>

<h1>⚖️ Licence </h1>

Ce projet est distribué sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.
