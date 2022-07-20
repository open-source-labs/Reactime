<div>
<h1>Development Enviroment Setup</h1>

<h2>Getting Started</h2>

<b>1. <a href="https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en">Download React Dev Tools from the Chrome Webstore Here</a></>

2. Clone down the Reactime repo onto your machine.

```
git clone https://github.com/open-source-labs/reactime.git
```

3. Install dependencies and build.

```
cd reactime
npm install --force
npm run build
```

4. Spin up the demo application.

```
cd demo-app
npm install
npm start
```

5. Add Reactime to your Chrome extensions.

-   Navigate to chrome://extensions
-   Select “Load Unpacked”
-   Choose reactime > src > extension > build
-   Navigate to http://localhost:8080/ to inspect the demo application using Reactime!
    <br>

<p align="center">
  <img src="./assets/reactime-dev-setup.gif" />
</p>

<h2>Documentation for Consideration</h2>
<h4>Can Reactime be integrated with Redux compatibility so applications using Redux can track state in Reactime?</h4>
Yes, but it would be very time-consuming and not the most feasible option while Redux devtools exists already. With how Redux devtools is currently set up, a developer is unable to use Redux devtools as a third-party user and integrate its functionality into their own application, as Redux devtools is meant to be used directly on an application using Redux for state-tracking purposes. Since the devtools do not appear to have a public API for integrated use in an application or it simply does not exist, Redux devtools would need to be rebuilt from the ground up and then integrated into Reactime, or built into Reactime directly still from scratch.
