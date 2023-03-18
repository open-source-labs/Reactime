/**
 * @class Route instances are created by the addRoute method on Routes. A Route instance has two properties: the url of the route and a unique id.
 */

export class Route {
  constructor(public url: string, public id: number) {
    this.url = url;
    this.id = id;
  }
}

/**
 * @class An instance of this class is the default export from routes.ts. It includes the logic that allows Reactime to work with target applications built with React Router. The addRoute method is invoked in linkFiber.ts within the sendSnapshot function. The navigate method is invoked in timeJump.ts immediately before invoking jump.
 */

export class Routes {
  /**
   * @property A stack of visited routes that matches the browser history stack.
   * The dummyURL is used to initialize the routeHistory array with a default route at index 0, which serves as
  a placeholder. This is necessary because the routeHistory array needs to mirror the browser's history
  stack, and the browser's history stack always has at least one entry when the page is loaded. Once the user
  navigates to a new route, the dummyURL will be replaced with the first real route.
   */

  routeHistory: Route[] = [new Route('dummyURL', 0)];

  /**
   * @property When a new route is added to the history, a new Route object is created with a unique id value, which is incremented for each new route. This is useful because it allows us to compare routes in a more robust way, using both the URL and the ID to ensure that we're looking at the correct route in the history array. In the navigate method, for example, the targetIndex is found by searching for the index of the route with the matching url and id
   */
  id = 0;

  /**
   * @property Tracks the index of the current route in the routeHistory stack. This property is used to ensure that the routeHistory stack always matches the browser history stack. When a user navigates to a new route, the current property is updated to reflect the new index of the current route in the routeHistory stack. When a user performs a time jump, the current property is updated to reflect the new index of the current route in the routeHistory stack as well.
   */
  current = 0;

  /**
   * @method addRoute - Method to add a new route to the route history array. Also ensures that the `routeHistory` stack always matches the browser history stack.
   * @param url - A url string.
   * @returns Either the current route if the user has not navigated away from it or a new instance of a route constructed from the url.
   *
   *
   */

  addRoute(url: string): Route {
    // Get the current route
    const currentRoute: Route = this.routeHistory[this.current];
    // Check if the new url is different from the current url
    const isNavigating = currentRoute.url !== url;

    if (isNavigating) {
      // Check if current is not equal to routeHistory.length - 1 becuase if it doesnt, we need to rebuild history
      if (this.current !== this.routeHistory.length - 1) {
        // Rebuild the browser history with the new url
        this.rebuildHistory(url);
      }
      // Create a new Route object with the new url and id
      const newRoute = new Route(url, ++this.id);
      // Add the new Route object to the route history array
      this.routeHistory.push(newRoute);
      // Update the current index to pointer to the new Route object
      this.current = this.routeHistory.length - 1;
      // Return the new Route object
      return newRoute;
    }
    // If the new url is the same as the current url, return the current route
    return currentRoute;

    // Create a new Route

    // // Obtain the last visited route within routeHistory stack
    // let route: Route = this.routeHistory[this.current];

    // // If the passed in window url does not match with the last visited route
    // // => user has navigated to another route
    // if (route.url !== url) {
    //   // If the last visited index is not the last position in routeHistory stack. This happens when user uses the timeJump functionality.
    //   // => Rebuild the browserHistory
    //   if (this.current !== this.routeHistory.length - 1) {
    //     this.rebuildHistory(url);
    //   }
    //   // Create a new route instance from the passed in url.
    //   route = new Route(url, (this.id += 1));
    //   // Push the new route to routeHistory stack.
    //   this.routeHistory.push(route);
    //   // Update the last visited index.
    //   this.current = this.routeHistory.length - 1;
    // }
    // return route;
  }

  /**
   * @method rebuildHistory
   * @param url - A url string.
   *
   * Rebuilds the browser history stack using the copy of the stack maintained in the `routeHistory` stack. https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState, https://developer.mozilla.org/en-US/docs/Web/API/History/pushState
   */
  private rebuildHistory(url: string): void {
    // Replace window history with the next route
    window.history.replaceState('', '', this.routeHistory[this.current + 1].url);
    // For each route in routeHistory after the next route, add to window history
    for (let i = this.current + 2; i < this.routeHistory.length; i += 1) {
      window.history.pushState('', '', this.routeHistory[i].url);
    }
    // Add the new url to window history
    window.history.pushState('', '', url);
  }

  /**
   * This method will perform the following:
   * 1. Evaluate if user need to navigate to another route
   * 2. If navigation is needed, perform navigation and return true
   * 3. Else return false
   * @param route - The target route in the `routeHistory` stack that is being navigated to.
   * @returns A boolean indicating whether or not a new route was navigated to.
   *
   * Invokes history.go passing in the delta between the current route and the target route. https://developer.mozilla.org/en-US/docs/Web/API/History/go
   */
  navigate(targetRoute: Route): boolean {
    // Find the index of the target route in the route history array
    const targetIndex: number = this.routeHistory.findIndex(
      (route) => route.url === targetRoute.url && route.id === targetRoute.id,
    );
    // If the target route is not found, throw an error
    if (targetIndex === -1) {
      throw Error('Error at Routes.navigage: targetIndex is undefined');
    }
    // Calculate the difference in index between the current route and the target route
    const delta: number = targetIndex - this.current;
    // Update the current route index to the index of the target route
    this.current += delta;
    // If the difference is not 0, navigate to the target route using window.history.go() method
    if (delta !== 0) {
      window.history.go(delta);
      // Return true to indicate that the navigation was successful
      return true;
    }
    // If the difference is 0, return false to indicate that no navigation occurred
    return false;

    // let targetIndex: number | undefined;
    // // Loop through the routeHistory stack
    // for (let i = 0; i < this.routeHistory.length; i += 1) {
    //   // If within the route history, found a match of url & id from the passed in route, update `targetIndex`
    //   if (this.routeHistory[i].url === route.url && this.routeHistory[i].id === route.id) {
    //     targetIndex = i;
    //   }
    // }

    // if (typeof targetIndex === 'undefined') {
    //   throw Error('Error at Routes.navigage: targetIndex is undefined');
    // }
    // /**
    //  * The position in the window history to which you want to move, relative to the current page. A negative value moves backwards, a positive value moves forwards.
    //  */
    // console.log({ targetIndex, current: this.current, history: this.routeHistory });
    // const delta: number = targetIndex - this.current;

    // // Update the position within routeHistory stack
    // this.current += delta;

    // // if delta != 0 => need to navigate to another page
    // if (delta !== 0) {
    //   // Navigate to that page based on delta steps
    //   window.history.go(delta);
    //   return true;
    // }
    // return false;
  }
}

export default new Routes();
