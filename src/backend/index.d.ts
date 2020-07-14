// Type definitions for reactime v3.1
// Project: <https://github.com/open-source-labs/reactime>
// Definitions by: Abaas Khorrami <https://github.com/dubalol>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/**
 * The 'reactime' module has one export:
 * --> the async @function returned from linkFiber.js
 * @param {container} --> the div element corresponding to your root container
 * @returns {void} --> no return value
 *
 * Reactime contributors:
    "Abaas Khorrami",
    "Andy Wong",
    "Bryan Lee",
    "Carlos Perez",
    "Chris Flannery",
    "David Chai",
    "Edwin Menendez",
    "Ergi Shehu",
    "Gabriela Jardim Aquino",
    "Gregory Panciera",
    "Josh Kim",
    "Joshua Howard",
    "Nathanael Wa Mwenze",
    "Prasanna Malla",
    "Rajeeb Banstola",
    "Raymond Kwan",
    "Rocky Lin",
    "Ruth Anam",
    "Ryan Dang",
    "Sierra Swaby",
    "Yujin Kang"
 *
 *
 * NOTE: TypeScript support is in beta and still experimental.
 *
 */

declare module "reactime" {
  function linkFiber(
    container: HTMLElement,
  ): void;
  export = linkFiber;
}
