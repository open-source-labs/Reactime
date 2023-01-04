/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable max-len */
import mainReducer from '../reducers/mainReducer';
import {
  toggleMode, addNewSnapshots, initialConnect, setPort, emptySnapshots, changeView, changeSlider, moveBackward, moveForward, playForward, pause, startPlaying, importSnapshots, setTab, deleteTab,
} from '../actions/actions';

describe('mainReducer testing', () => {
  let state;
  let currentTab;
  beforeEach(() => {
    state = {
      tabs: {
        87: {
          snapshots: [1, 2, 3, 4],
          sliderIndex: 2,
          viewIndex: -1,
          mode: {
            paused: false,
            locked: false,
            persist: false,
          },
          intervalId: 87,
          playing: true,
          index: 3,
          // should be a linked list with four nodes
          hierarchy: {
            index: 0,
            name: 1,
            branch: 0,
            stateSnapshot: {
              state: {},
              children: [{
                state: { test: 'test' },
                name: 'App',
                componentData: { actualDuration: 3.5 },
              }],
            },
            children: [{
              index: 1,
              name: 2,
              branch: 0,
              stateSnapshot: {
                state: {},
                children: [{
                  state: { test: 'test' },
                  name: 'App',
                  componentData: { actualDuration: 3.5 },
                }],
              },
              children: [{
                index: 2,
                name: 3,
                branch: 0,
                stateSnapshot: {
                  state: {},
                  children: [{
                    state: { test: 'test' },
                    name: 'App',
                    componentData: { actualDuration: 3.5 },
                  }],
                },
                children: [{
                  index: 3,
                  name: 4,
                  branch: 0,
                  stateSnapshot: {
                    state: {},
                    children: [{
                      state: { test: 'test' },
                      name: 'App',
                      componentData: { actualDuration: 3.5 },
                    }],
                  },
                  children: [],
                }],
              }],
            }],
          },
          // currLocation: null,
          // should point to the last node in hierarchy
          currLocation: 4,
        },
        75: {
          snapshots: [1, 2, 3, 4],
          sliderIndex: 3,
          viewIndex: -1,
          mode: {
            paused: false,
            locked: false,
            persist: false,
          },
          intervalId: 75,
          playing: false,
          // should be a linked list with four nodes
          hierarchy: {
            index: 0,
            name: 1,
            branch: 0,
            stateSnapshot: {
              state: {},
              children: [{
                state: { test: 'test' },
                name: 'App',
                componentData: { actualDuration: 3.5 },
              }],
            },
            children: [{
              index: 1,
              name: 2,
              branch: 0,
              stateSnapshot: {
                state: {},
                children: [{
                  state: { test: 'test' },
                  name: 'App',
                  componentData: { actualDuration: 3.5 },
                }],
              },
              children: [{
                index: 2,
                name: 3,
                branch: 0,
                stateSnapshot: {
                  state: {},
                  children: [{
                    state: { test: 'test' },
                    name: 'App',
                    componentData: { actualDuration: 3.5 },
                  }],
                },
                children: [{
                  index: 3,
                  name: 4,
                  branch: 0,
                  stateSnapshot: {
                    state: {},
                    children: [{
                      state: { test: 'test' },
                      name: 'App',
                      componentData: { actualDuration: 3.5 },
                    }],
                  },
                  children: [],
                }],
              }],
            }],
          },
          // currLocation: null,
          // should point to the last node in hierarchy
          currLocation: 4,
        },
      },
      currentTab: 87,
      port: {
        postMessage: () => {},
      },
    };

    // eslint-disable-next-line prefer-destructuring
    currentTab = state.currentTab;
  });

  describe('moveBackward', () => {
    it('should decrement sliderIndex by 1', () => {
      expect(mainReducer(state, moveBackward()).tabs[currentTab].sliderIndex).toEqual(1);
      expect(mainReducer(state, moveBackward()).tabs[currentTab].playing).toEqual(false);
    });
    it('should not decrement if sliderIndex is zero', () => {
      state.tabs[currentTab].sliderIndex = 0;
      const { sliderIndex } = mainReducer(state, moveBackward()).tabs[currentTab];
      expect(sliderIndex).toBe(0);
    });
  });

  describe('moveForward', () => {
    it('should increment sliderIndex by 1', () => {
      expect(mainReducer(state, moveForward()).tabs[currentTab].sliderIndex).toEqual(3);
      expect(mainReducer(state, moveForward()).tabs[currentTab].playing).toEqual(false);
    });
    it('should not increment past end value if sliderIndex at end', () => {
      state.tabs[currentTab].sliderIndex = 3;
      const { sliderIndex } = mainReducer(state, moveForward()).tabs[currentTab];
      expect(sliderIndex).toBe(3);
    });
    it('should not change playing if not coming from user', () => {
      const { playing } = mainReducer(state, playForward()).tabs[currentTab];
      expect(playing).toBe(true);
    });
  });

  describe('changeView', () => {
    it('should unselect view if same index was selected', () => {
      state.tabs[currentTab].viewIndex = 1;
      expect(mainReducer(state, changeView(1)).tabs[currentTab].viewIndex).toEqual(-1);
    });
    it('change viewIndex when unselected', () => {
      expect(mainReducer(state, changeView(2)).tabs[currentTab].viewIndex).toEqual(2);
    });
  });

  describe('changeSlider', () => {
    it('should change sliderIndex', () => {
      expect(mainReducer(state, changeSlider(2)).tabs[currentTab].sliderIndex).toEqual(2);
    });
    // should also change view
  });

  describe('empty', () => {
    it('should empty snapshots except the first one', () => {
      expect(mainReducer(state, emptySnapshots()).tabs[currentTab].sliderIndex).toEqual(0);
      expect(mainReducer(state, emptySnapshots()).tabs[currentTab].viewIndex).toEqual(0);
      expect(mainReducer(state, emptySnapshots()).tabs[currentTab].playing).toEqual(false);
      expect(mainReducer(state, emptySnapshots()).tabs[currentTab]
        .snapshots).toEqual([state.tabs[currentTab].snapshots[state.tabs[currentTab].snapshots.length - 1]]);
    });
    // should push slider back to start position
  });

  describe('setPort', () => {
    it('should set port when connection', () => {
      expect(mainReducer(state, setPort('newPort')).port).toEqual('newPort');
    });
  });

  describe('Import', () => {
    it('importing file should replace snapshots of devtool', () => {
      expect(mainReducer(state, importSnapshots([100, 101])).tabs[currentTab].snapshots).toEqual([100, 101]);
    });
  });

  describe('Toggle Mode', () => {
    it('clicking pause button should only change pause mode', () => {
      const { mode } = mainReducer(state, toggleMode('paused')).tabs[currentTab];
      expect(mode.paused).toBe(true);
      expect(mode.locked).toBe(false);
      expect(mode.persist).toBe(false);
    });
    it('clicking lock button should only change lock mode', () => {
      const { mode } = mainReducer(state, toggleMode('locked')).tabs[currentTab];
      expect(mode.paused).toBe(false);
      expect(mode.locked).toBe(true);
      expect(mode.persist).toBe(false);
    });
    it('clicking persist button should only change persist mode', () => {
      const { mode } = mainReducer(state, toggleMode('persist')).tabs[currentTab];
      expect(mode.paused).toBe(false);
      expect(mode.locked).toBe(false);
      expect(mode.persist).toBe(true);
    });
    it('undefined payload does nothing', () => {
      const { mode } = mainReducer(state, toggleMode('undefined')).tabs[currentTab];
      expect(mode.paused).toBe(false);
      expect(mode.locked).toBe(false);
      expect(mode.persist).toBe(false);
    });
  });

  describe('slider pause', () => {
    it('should set playing to false and intervalId to null', () => {
      const playedTab = mainReducer(state, pause()).tabs[currentTab];
      expect(playedTab.playing).toBe(false);
      expect(playedTab.intervalId).toBe(null);
    });
  });

  describe('slider play', () => {
    it('should set playing to true and intervalId to payload', () => {
      const playedTab = mainReducer(state, startPlaying(333)).tabs[currentTab];
      expect(playedTab.playing).toBe(true);
      expect(playedTab.intervalId).toBe(333);
    });
  });

  describe('Initial Connect', () => {
    const newTab = {
      104: {
        snapshots: [1, 2, 3, 8],
        sliderIndex: 3,
        viewIndex: -1,
        mode: {
          paused: false,
          locked: false,
          persist: false,
        },
        intervalId: 912,
        playing: true,
      },
    };
    it('should add new tab', () => {
      const addedTab = mainReducer(state, initialConnect(newTab)).tabs[104];
      expect(addedTab).not.toBe(undefined);
    });
    it('should force some values to default', () => {
      const addedTab = mainReducer(state, initialConnect(newTab)).tabs[104];
      expect(addedTab.sliderIndex).toBe(0);
      expect(addedTab.viewIndex).toBe(-1);
      expect(addedTab.intervalId).toBe(null);
      expect(addedTab.playing).toBe(false);
    });
    it('snapshots should match the payload', () => {
      const addedTab = mainReducer(state, initialConnect(newTab)).tabs[104];
      expect(addedTab.snapshots).toEqual(newTab[104].snapshots);
    });
    it('if currentTab undefined currentTab becomes firstTab', () => {
      state.currentTab = undefined;
      const addedTab = mainReducer(state, initialConnect(newTab));
      expect(addedTab.currentTab).toBe(104);
    });
  });

  // This test is breaking, please troubleshoot
  // describe('new snapshots', () => {
  //   const newSnapshots = {
  //     87: {
  //       snapshots: [1, 2, 3, 4, 5],
  //       sliderIndex: 2,
  //       viewIndex: -1,
  //       mode: {
  //         paused: false,
  //         locked: false,
  //         persist: false,
  //       },
  //       intervalId: 87,
  //       playing: true,
  //     },
  //   };
  //   it('update snapshots of corresponding tabId', () => {
  //     const updated = mainReducer(state, addNewSnapshots(newSnapshots));
  //     expect(updated.tabs[87].snapshots).toEqual(newSnapshots[87].snapshots);
  //   });
  //   it('should delete tabs that are deleted from background script', () => {
  //     const updated = mainReducer(state, addNewSnapshots(newSnapshots));
  //     expect(updated.tabs[75]).toBe(undefined);
  //   });
  //   it('if currentTab undefined currentTab becomes first Tab', () => {
  //     state.currentTab = undefined;
  //     const updated = mainReducer(state, addNewSnapshots(newSnapshots));
  //     expect(updated.currentTab).toBe(87);
  //   });
  // });

  describe('set_tab', () => {
    it('should set tab to payload', () => {
      const newCurrentTab = mainReducer(state, setTab(75)).currentTab;
      expect(newCurrentTab).toBe(75);
    });
  });

  describe('delete_tab', () => {
    it('should delete only payload tab from state', () => {
      const afterDelete = mainReducer(state, deleteTab(75));
      expect(afterDelete.tabs[75]).toBe(undefined);
      expect(afterDelete.tabs[87]).not.toBe(undefined);
    });
  });

  describe('default', () => {
    const action = {
      type: 'doesNotExist',
      payload: 'trigger',
    };
    it('if there are no match of action types, throw error', () => {
      try {
        mainReducer(state, action);
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
      }
    });
  });
});
