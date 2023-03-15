import Routes, { Route } from '../models/routes';

describe('Routes', () => {
  beforeEach(() => {
    // Reset the route history and id before each test
    Routes.routeHistory = [new Route('dummyURL', 0)];
    Routes.id = 0;
    Routes.current = 0;
  });

  describe('addRoute', () => {
    it('should return the current route if the URL matches the last visited route', () => {
      const lastVisitedRoute = Routes.routeHistory[Routes.current];
      const newRoute = Routes.addRoute(lastVisitedRoute.url);
      expect(newRoute).toBe(lastVisitedRoute);
    });

    it('should add a new route to the history stack if the URL does not match the last visited route', () => {
      const lastVisitedRoute = Routes.routeHistory[Routes.current];
      const newUrl = 'https://localhost8080/';
      const newRoute = Routes.addRoute(newUrl);
      expect(newRoute.url).toBe(newUrl);
      expect(newRoute.id).toBe(lastVisitedRoute.id + 1);
      expect(Routes.routeHistory.length).toBe(2);
      expect(Routes.current).toBe(1);
      expect(Routes.routeHistory[1]).toBe(newRoute);
    });

    it('should rebuild the history stack if the last visited index is not the last position in the stack', () => {
      Routes.addRoute('https://localhost8080/1');
      Routes.addRoute('https://localhost8080/2');
      Routes.addRoute('https://localhost8080/3');
      const newUrl = 'https://localhost8080/4';
      Routes.current = 1; // Simulate timeJump functionality
      const newRoute = Routes.addRoute(newUrl);
      expect(Routes.routeHistory.length).toBe(3);
      expect(Routes.current).toBe(2);
      expect(Routes.routeHistory[0].url).toBe('dummyURL');
      expect(Routes.routeHistory[1].url).toBe(newUrl);
      expect(Routes.routeHistory[2].url).toBe('https://localhost8080/3');
    });
  });

  describe('navigate', () => {
    beforeEach(() => {
      // Add some dummy routes to the history stack
      Routes.addRoute('https://localhost8080/1');
      Routes.addRoute('https://localhost8080/2');
      Routes.addRoute('https://localhost8080/3');
      Routes.addRoute('https://localhost8080/4');
    });

    it('should navigate to the target route and return true', () => {
      const targetRoute = Routes.routeHistory[1];
      const result = Routes.navigate(targetRoute);
      expect(result).toBe(true);
      expect(Routes.current).toBe(1);
      expect(window.history.state).toBe(null); // state should be null after navigation
      expect(window.location.href).toBe(targetRoute.url);
    });

    it('should not navigate if the target route is the current route and return false', () => {
      const currentRoute = Routes.routeHistory[Routes.current];
      const result = Routes.navigate(currentRoute);
      expect(result).toBe(false);
      expect(Routes.current).toBe(0);
      expect(window.history.state).toBe(null); // state should not change
      expect(window.location.href).toBe(currentRoute.url);
    });

    it('should throw an error if the target route cannot be found in the history stack', () => {
      const targetRoute = new Route('https://localhost8080/unknown', 123);
      expect(() => Routes.navigate(targetRoute)).toThrow();
    });
  });
});
