class Routes {
  values: string[] = [];

  id = 0;

  current: number | null = null;

  addRoute(url: string): string {
    if (this.values[this.values.length - 1] !== url) {
      if (this.values.includes(url)) {
        this.values.push((url += this.id++));
      } else {
        this.values.push(url);
      }
    }

    this.current = this.values.length - 1;
    return url;
  }

  navigate(url: string): boolean {
    let targetIndex: number | null = null;
    for (let i = 0; i < this.values.length; i++) {
      if (this.values[i] === url) targetIndex = i;
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
