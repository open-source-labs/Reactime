import { JSDOM } from 'jsdom';

import { Routes, Route } from '../models/routes';

describe('Route class testing', () => {
  let routes: Routes;
  let dom: JSDOM;
  beforeAll(() => {
    // Set up a fake DOM environment with JSDOM
    dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', { url: 'http://localhost' });
    global.window = dom.window;
    global.document = dom.window.document;
  });

  afterAll(() => {
    // Clean up the fake DOM environment
    global.window = undefined;
    global.document = undefined;
    dom.window.close();
  });
  beforeEach(() => {
    routes = new Routes();
    window.history.replaceState = jest.fn();
    window.history.pushState = jest.fn();
  });

  describe('Route initialization', () => {
    it('should create a new instance of Route class', () => {
      const route = new Route('/home', 1);
      expect(route.url).toBe('/home');
      expect(route.id).toBe(1);
    });
  });

  describe('Routes class addRoute and navigate methods', () => {
    it('should add a new route to the route history array', () => {
      const route = routes.addRoute('/home');
      expect(route.url).toBe('/home');
      expect(route.id).toBe(1);
      expect(routes.routeHistory).toHaveLength(2);
    });

    it('should add multiple routes to the route history array', () => {
      const route = routes.addRoute('/home');
      const route2 = routes.addRoute('/about');
      expect(route.url).toBe('/home');
      expect(route.id).toBe(1);
      expect(route2.url).toBe('/about');
      expect(route2.id).toBe(2);
      expect(routes.routeHistory).toHaveLength(3);
    });

    it('should return the current route if the user has not navigated away from it', () => {
      const route = routes.addRoute('/home');
      const currentRoute = routes.addRoute('/home');
      expect(currentRoute).toEqual(route);
      expect(routes.routeHistory).toHaveLength(2);
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

    it('should throw an error if target route is not found', () => {
      const dummyRoute: Route = new Route('/error', 0);
      expect(() => routes.navigate(dummyRoute)).toThrowError();
    });
  });

  describe('Routes rebuildHistory method', () => {
    describe('rebuildHistory', () => {
      it('should replace the current URL in the history stack with the given URL', () => {
        // Mock the `routeHistory` array with three routes
        const route1 = new Route('/home', 0);
        const route2 = new Route('/about', 1);
        const route3 = new Route('/contact', 2);
        const route4 = new Route('/portfolio', 3);
        routes.routeHistory = [route1, route2, route3, route4];
        // Set current route to 2nd page and try to add the home page
        routes.current = 1;
        // Add home page
        routes.addRoute(route1.url);
        // Expect the `replaceState` method to have been called with the URL of the third route
        expect(window.history.replaceState).toHaveBeenCalledWith('', '', route3.url);
        // Expect the `pushState` method to have been called with the URL of the third route
        expect(window.history.pushState).toHaveBeenCalledWith('', '', route4.url);
        expect(window.history.pushState).toHaveBeenCalledWith('', '', route1.url);
      });
    });
  });
});
