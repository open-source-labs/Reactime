<div>
<h1>
Development Enviroment Setup
<h1>

<h2>
Getting Started 
<h2>

<h4>1. Download React Dev Tools from the Chrome Webstore <a href=https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en>
Click Here To Download
</a></h4>

<h4>2. Clone down the Reactime repo onto your machine.</h4>

`````
git clone https://github.com/open-source-labs/reactime.git
`````

<h4> 3. Install dependencies and build.</h4>

`````
cd reactime
npm install --force
npm run build
`````
<h4> 4. Spin up the demo application. </h4>

`````
cd demo-app
npm install
npm start
`````
<br>

<h4>
5. Add Reactime to your Chrome extensions.
<br>
- Navigate to chrome://extensions
<br>
- Select “Load Unpacked”
<br>
- Choose reactime > src > extension > build
<br>
Navigate to http://localhost:8080/ to inspect the demo application using Reactime!
<br>
<br>
<h4>
<p align="center">
<img src="./assets/reactime-dev-setup.gif" />
</p>