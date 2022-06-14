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
  values: Route[] = [new Route(null, null)];

  /**
   * @property Used to assign unique ids to routes in the values stack in case the same route is added to the stack more than once.
   */
  id = 0;

  /**
   * @property The index of the current route in the values stack.
   */
  current: number | null = 0;

  /**
   * @method addRoute
   * @param url - A url string.
   * @returns Either the current route if the user has not navigated away from it or a new instance of a route constructed from the url.
   *
   * Ensures that the values stack always matches the browser history stack.
   */

  addRoute(url: string): Route {
    let route: Route = this.values[this.current];

    if (this.values[this.current].url !== url) {
      if (this.current !== this.values.length - 1) {
        this.rebuildHistory(url);
      }

      route = new Route(url, (this.id += 1));
      this.values.push(route);

      this.current = this.values.length - 1;
    }

    return route;
  }

  /**
   * @method rebuildHistory
   * @param url - A url string.
   *
   * Rebuilds the browser history stack using the copy of the stack maintained in the values stack. https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState, https://developer.mozilla.org/en-US/docs/Web/API/History/pushState
   */
  private rebuildHistory(url: string): void {
    window.history.replaceState('', '', this.values[this.current + 1].url);

    for (let i = this.current + 2; i < this.values.length; i += 1) {
      window.history.pushState('', '', this.values[i].url);
    }

    window.history.pushState('', '', url);
  }

  /**
   * @method navigate
   * @param route - The target route in the values stack that is being navigated to.
   * @returns A boolean indicating whether or not a new route was navigated to.
   *
   * Invokes history.go passing in the delta between the current route and the target route. https://developer.mozilla.org/en-US/docs/Web/API/History/go
   */
  navigate(route: Route): boolean {
    let targetIndex: number | null = null;

    for (let i = 0; i < this.values.length; i += 1) {
      if (this.values[i].url === route.url && this.values[i].id === route.id) {
        targetIndex = i;
      }
    }

    const delta: number = targetIndex - this.current;

    this.current += delta;

    if (delta !== 0) {
      window.history.go(delta);
      return true;
    }
    return false;
  }
}

export default new Routes();
