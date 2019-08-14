/* eslint-disable max-len */
import * as types from '../constants/actionTypes';
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
  });

  describe('moveForward', () => {
    it('should increment sliderIndex by 1', () => {
      expect(mainReducer(state, moveForward()).tabs[currentTab].sliderIndex).toEqual(3);
      expect(mainReducer(state, moveForward()).tabs[currentTab].playing).toEqual(false);
    });
  });

  describe('changeView', () => {
    it('unselect view if same index was selected', () => {
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
  });

  describe('empty', () => {
    it('should empty snapshots except the first one', () => {
      expect(mainReducer(state, emptySnapshots()).tabs[currentTab].sliderIndex).toEqual(0);
      expect(mainReducer(state, emptySnapshots()).tabs[currentTab].viewIndex).toEqual(-1);
      expect(mainReducer(state, emptySnapshots()).tabs[currentTab].playing).toEqual(false);
      expect(mainReducer(state, emptySnapshots()).tabs[currentTab]
        .snapshots).toEqual(state.tabs[currentTab].snapshots.slice(0, 1));
    });
  });

  describe('setPort', () => {
    it('should set port when connection', () => {
      expect(mainReducer(state, setPort('newPort')).port).toEqual('newPort');
    });
  });

  describe('Import', () => {
    it('impoting file should replace snapshots of devtool', () => {
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
  });

  describe('new snapshots', () => {

  });
});
