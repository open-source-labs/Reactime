import { Routes, Route } from '../models/routes';

describe('Route class', () => {
  it('should create a new instance of Route class', () => {
    const route = new Route('/home', 1);
    expect(route.url).toBe('/home');
    expect(route.id).toBe(1);
  });
});

describe('Routes class', () => {
  let routes: Routes;

  beforeEach(() => {
    routes = new Routes();
  });

  it('should add a new route to the route history array', () => {
    const route = routes.addRoute('/home');
    expect(route.url).toBe('/home');
    expect(routes.routeHistory).toHaveLength(2);
  });

  it('should return the current route if the user has not navigated away from it', () => {
    const route = routes.addRoute('/home');
    const currentRoute = routes.addRoute('/home');
    expect(currentRoute).toEqual(route);
    expect(routes.routeHistory).toHaveLength(2);
  });

  it('should rebuild the browser history when adding a new route', () => {
    window.history.pushState = jest.fn();
    window.history.replaceState = jest.fn();
    routes.addRoute('/home');
    expect(window.history.replaceState).toHaveBeenCalled();
    expect(window.history.pushState).toHaveBeenCalled();
  });

  it('should navigate to the target route in the route history stack', () => {
    const homeRoute = routes.addRoute('/home');
    const aboutRoute = routes.addRoute('/about');
    const result = routes.navigate(homeRoute);
    expect(result).toBe(true);
    expect(routes.current).toBe(1);
    const result2 = routes.navigate(aboutRoute);
    expect(result2).toBe(true);
    expect(routes.current).toBe(2);
  });

  it('should not navigate to the target route if it is the current route', () => {
    const homeRoute = routes.addRoute('/home');
    const result = routes.navigate(homeRoute);
    expect(result).toBe(false);
    expect(routes.current).toBe(1);
  });
});
