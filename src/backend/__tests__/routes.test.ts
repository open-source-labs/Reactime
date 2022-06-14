import routes from '../routes';

describe('Unit Tests for routes.ts', () => {
  describe('addRoute', () => {
    it('If given a url that doesn\'t match the current route, it should return a new route object and add the route object to its values array.', () => {
      const newRoute = routes.addRoute('http://localhost:8080/');
      expect(newRoute.url).toBe('http://localhost:8080/');
      expect(newRoute.id).toBe(1);
      expect(routes.values[1].url).toBe('http://localhost:8080/');
      expect(routes.values[1].id).toBe(1);
    });

    it('If given a url that does match the current route, it should return the current route object and not add anything to its values array.', () => {
      const sameRoute = routes.addRoute('http://localhost:8080/');
      expect(sameRoute).toBe(routes.values[1]);
      expect(routes.values.length).toBe(2);
    });

    it('Should give route objects unique ids.', () => {
      routes.addRoute('http://localhost:8080/test');
      expect(routes.values[1].id).not.toBe(routes.values[2].id);
    });

    it('Should reassign current to point to the last index in the values array.', () => {
      expect(routes.current).toBe(routes.values.length - 1);
    });
  });

  describe('navigate', () => {
    it('Should correctly calculate delta between current and target route.', () => {
      routes.addRoute('http://localhost:8080/test1');
      routes.navigate({ url: 'http://localhost:8080/', id: 1 });
      expect(routes.current).toBe(1);
      routes.navigate({ url: 'http://localhost:8080/test1', id: 3 });
      expect(routes.current).toBe(3);
    });

    it('Should return true if it navigated.', () => {
      expect(routes.navigate({ url: 'http://localhost:8080/', id: 1 })).toBe(true);
    });

    it('Should return false if it didn\'t navigate.', () => {
      expect(routes.navigate({ url: 'http://localhost:8080/', id: 1 })).toBe(false);
    });
  });
});
