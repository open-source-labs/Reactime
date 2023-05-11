/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-filename-extension */
import React, { useEffect } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ActionContainer from '../containers/ActionContainer';
import { useStoreContext } from '../store';

const state = {
  tabs: {
    87: {
      snapshots: [1, 2, 3, 4],
      hierarchy: {
        index: 0,
        name: 1,
        branch: 0,
        stateSnapshot: {
          state: {},
          children: [
            {
              state: { test: 'test' },
              name: 'App',
              componentData: { actualDuration: 3.5 },
            },
          ],
          route: {
            id: 1,
            url: 'http://localhost:8080/',
          },
        },
        children: [
          {
            index: 1,
            name: 2,
            branch: 0,
            stateSnapshot: {
              state: {},
              children: [
                {
                  state: { test: 'test' },
                  name: 'App',
                  componentData: { actualDuration: 3.5 },
                },
              ],
              route: {
                id: 2,
                url: 'http://localhost:8080/',
              },
            },
            children: [
              {
                index: 2,
                name: 3,
                branch: 0,
                stateSnapshot: {
                  state: {},
                  children: [
                    {
                      state: { test: 'test' },
                      name: 'App',
                      componentData: { actualDuration: 3.5 },
                    },
                  ],
                  route: {
                    id: 3,
                    url: 'http://localhost:8080/',
                  },
                },
                children: [
                  {
                    index: 3,
                    name: 4,
                    branch: 0,
                    stateSnapshot: {
                      state: {},
                      children: [
                        {
                          state: { test: 'test' },
                          name: 'App',
                          componentData: { actualDuration: 3.5 },
                        },
                      ],
                      route: {
                        id: 4,
                        url: 'http://localhost:8080/test/',
                      },
                    },
                    children: [],
                  },
                ],
              },
            ],
          },
        ],
      },
      currLocation: {
        index: 0,
        name: 1,
        branch: 0,
      },
      sliderIndex: 0,
      viewIndex: -1,
    },
  },
  currentTab: 87,
};

const dispatch = jest.fn();
const resetSlider = jest.fn();
jest.spyOn(React, 'useEffect').mockImplementation(() => jest.fn());
jest.mock('../store');
useStoreContext.mockImplementation(() => [state, dispatch]);

const MockRouteDescription = jest.fn();
jest.mock('../components/RouteDescription', () => () => {
  MockRouteDescription();
  return <div>MockRouteDescription</div>;
});

const MockSwitchApp = jest.fn();
jest.mock('../components/SwitchApp', () => () => {
  MockSwitchApp();
  return <div>MockSwitchApp</div>;
});

describe('unit testing for ActionContainer', () => {
  beforeEach(() => {
    useStoreContext.mockClear();
    dispatch.mockClear();
    render(<ActionContainer actionView={true} />);
  });

  test('Expect top arrow to be rendered', () => {
    expect(screen.getByRole('complementary')).toBeInTheDocument();
  });

  test('Expect RouteDescription to be rendered', () => {
    expect(screen.getAllByText('MockRouteDescription')).toHaveLength(2);
  });

  test('Expect SwitchApp to be rendered', () => {
    expect(screen.getByText('MockSwitchApp')).toBeInTheDocument();
  });

  test('Click works on clear button', async () => {
    fireEvent.click(screen.getAllByRole('button')[0]);
    await expect(dispatch).toHaveBeenCalledTimes(1);
  });
});
