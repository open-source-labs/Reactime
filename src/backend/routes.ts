/* eslint-disable max-classes-per-file */

class Route {
  url: string;

  id: number;

  constructor(url: string, id: number) {
    this.url = url;
    this.id = id;
  }
}

class Routes {
  values: Route[] = [new Route(null, null)];

  id = 0;

  current: number | null = 0;

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

  rebuildHistory(url: string): void {
    window.history.replaceState('', '', this.values[this.current + 1].url);

    for (let i = this.current + 2; i < this.values.length; i += 1) {
      window.history.pushState('', '', this.values[i].url);
    }

    window.history.pushState('', '', url);
  }

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
