chrome.devtools.panels.create('React Time-Travel', null, 'devtools.html', (panel) => {
  panel.onShown.addListener(() => {
    console.log(document.querySelector('switched'));
  });
});
