# Reactime End-to-End Testing

This folder contains automated tests as well as manual tests. The automated Jest / Puppeteer tests can be run by issuing the npm test command from within the root of the automated-tests directory.

Manual tests have been created for both Concurrent Mode and NextJS. These sandboxes can be launched by issuing the npm start command from within either of the directories inside of the manual-tests folder. Note that for the NextJS sandbox, npm run build should be issued before npm start. These manual sandboxes can also be automated by using the same approach as the automated testing sandboxes.

Automated Tests

- useState
- useEffect
- useContext
- useMemo
- Redux
- React Router
- setState
- Conditional setState
- componentDidMount

Manual Tests

- Concurrent Mode / Suspense
- Next.js
