/* eslint-disable max-classes-per-file */
/* eslint-disable max-len */

/**
 * @class Route instances are created by the addRoute method on Routes. A Route instance has two properties: the url of the route and a unique id.
 */
class Route {
  url: string;

  id: number;

  constructor(url: string, id: number) {
    this.url = url;
    this.id = id;
  }
}

/**
 * @class An instance of this class is the default export from routes.ts. It includes the logic that allows Reactime to work with target applications built with React Router. The addRoute method is invoked in linkFiber.ts within the sendSnapshot function. The navigate method is invoked in timeJump.ts immediately before invoking jump.
 */

class Routes {
  /**
   * @property A stack of visited routes that matches the browser history stack.
   */
  // TODO: Think about how to remove this dummy URL
  routeHistory: Route[] = [new Route('dummyURL', 0)];

  /**
   * @property Used to assign unique ids to routes in the `routeHistory` stack in case the same route is added to the stack more than once.
   */
  id = 0;

  /**
   * @property The index of the current route in the `routeHistory` stack.
   */
  current = 0;

  /**
   * @method addRoute
   * @param url - A url string.
   * @returns Either the current route if the user has not navigated away from it or a new instance of a route constructed from the url.
   *
   * Ensures that the `routeHistory` stack always matches the browser history stack.
   */

  addRoute(url: string): Route {
    // Obtain the last visited route within routeHistory stack
    let route: Route = this.routeHistory[this.current];

    // If the passed in window url does not match with the last visited route
    // => user has navigated to another route
    if (this.routeHistory[this.current].url !== url) {
      // If the last visited index is not the last position in routeHistory stack. This happens when user use the timeJump functionality.
      // => Rebuild the browserHistory
      if (this.current !== this.routeHistory.length - 1) {
        console.log('Rebuild browser history');
        this.rebuildHistory(url);
      }
      // Create a new route instance from the passed in url.
      route = new Route(url, (this.id += 1));
      // Push the new route to routeHistory stack.
      this.routeHistory.push(route);
      // Update the last visited index.
      this.current = this.routeHistory.length - 1;
    }
    console.log('Route History', this.routeHistory, this.current);
    console.log('History length', window.history.length);
    return route;
  }

  /**
   * @method rebuildHistory
   * @param url - A url string.
   *
   * Rebuilds the browser history stack using the copy of the stack maintained in the `routeHistory` stack. https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState, https://developer.mozilla.org/en-US/docs/Web/API/History/pushState
   */
  private rebuildHistory(url: string): void {
    window.history.replaceState('', '', this.routeHistory[this.current + 1].url);

    for (let i = this.current + 2; i < this.routeHistory.length; i += 1) {
      window.history.pushState('', '', this.routeHistory[i].url);
    }

    window.history.pushState('', '', url);
  }

  /**
   * @method navigate
   * @param route - The target route in the `routeHistory` stack that is being navigated to.
   * @returns A boolean indicating whether or not a new route was navigated to.
   *
   * Invokes history.go passing in the delta between the current route and the target route. https://developer.mozilla.org/en-US/docs/Web/API/History/go
   */
  navigate(route: Route): boolean {
    let targetIndex: number | undefined;

    // Loop through the routeHistory stack
    for (let i = 0; i < this.routeHistory.length; i += 1) {
      // If within the route history, found a match of url & id from the passed in route, update `targetIndex`
      if (this.routeHistory[i].url === route.url && this.routeHistory[i].id === route.id) {
        targetIndex = i;
      }
    }

    if (typeof targetIndex === 'undefined') {
      throw Error('Error at Routes.navigage: targetIndex is undefined');
    }
    /**
     * The position in the window history to which you want to move, relative to the current page. A negative value moves backwards, a positive value moves forwards.
     */
    const delta: number = targetIndex - this.current;

    // Update the position within routeHistory stack
    this.current += delta;

    // if delta != 0 => need to navigate to another page
    if (delta !== 0) {
      // Navigate to that page based on delta steps
      window.history.go(delta);
      return true;
    }
    return false;
  }
}

export default new Routes();
