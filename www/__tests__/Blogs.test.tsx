import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Blogs from '../src/pages/components/Blogs';
import React from 'react';

const posts = [
  {
    title: 'Traveling through time with Reactime',
    href: 'https://medium.com/@reactime/reactime-v17-0-0-now-with-support-for-the-context-api-and-a-modern-ui-f0edf9e54dae',
    category: { name: 'React Debugging', href: 'https://medium.com/tag/react-devtools' },
    description:
      'Reactime v17, we have come a long way from beta. Now introducing full Context API support: thereby allowing developers to better visualize the states and ... ',
    date: 'Jan 3, 2023',
    datetime: '2023-1-03',
    imageUrl:
      'https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1679&q=80',
    readingTime: '6 min',
    author: {
      name: 'James Nghiem',
      href: 'https://medium.com/@reactime',
      imageUrl: 'https://github.com/jemzir.png',
    },
  },
  {
    title: 'Time-Traveling Through React State',
    href: 'https://rxlina.medium.com/time-traveling-through-react-state-with-reactime-9-0-371dbdc99319',
    category: { name: 'React', href: 'https://medium.com/tag/react' },
    description:
      'Reactime is a Chrome extension and time-travel debugger for React that allows developers to record, track, and visualize state changes. Reactime leverages React’s core reconciliation... ',
    date: 'Oct 7, 2021',
    datetime: '2020-10-07',
    imageUrl:
      'https://images.unsplash.com/photo-1547586696-ea22b4d4235d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1679&q=80',
    readingTime: '4 min',
    author: {
      name: 'Lina Shin',
      href: 'https://rxlina.medium.com/',
      imageUrl:
        'https://media-exp1.licdn.com/dms/image/C5603AQHQGFvRHt25WQ/profile-displayphoto-shrink_200_200/0/1623865299399?e=1676505600&v=beta&t=yDqgIaJOhO3oOWLROIH9rHPBHdVzDSV3VlB2axWqXr4',
    },
  },
  {
    title: 'What time is it? Reactime!',
    href: 'https://medium.com/@robbytiptontol/inter-route-time-travel-with-reactime-d84cd55ec73b',
    category: { name: 'React Devtools', href: 'https://medium.com/tag/react-devtools' },
    description:
      'Reactime is a debugging tool that lets developers take snapshots of an application’s state data as well as time-travel through these snapshots. The snapshots display React...',
    date: 'Jun 16, 2022',
    datetime: '2022-06-16',
    imageUrl:
      'https://images.unsplash.com/photo-1492724441997-5dc865305da7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1679&q=80',
    readingTime: '9 min',
    author: {
      name: 'Robby Tipton',
      href: 'https://medium.com/@robbytiptontol',
      imageUrl: 'https://miro.medium.com/fit/c/96/96/1*pi-RH2LRvsZA9vLZTvY2mg.jpeg',
    },
  },
];

describe('Blog component test ', () => {
  beforeEach(() => {
    render(<Blogs />);
  });

  it('the title appears on the page', () => {
    expect(screen.getByText(/From the Blog/i)).toBeInTheDocument();
    expect(
      screen.getByText(/See the blogs from the most recent updates and to the past years!/i),
    ).toBeInTheDocument();
  });

  it('displays the correct information for each blog post', () => {
    posts.forEach((post) => {
      expect(screen.getByText(post.title)).toBeInTheDocument();
      expect(screen.getByText(post.description.trim())).toBeInTheDocument();
      expect(screen.getByText(post.date)).toBeInTheDocument();
      expect(screen.getByText(post.category.name)).toBeInTheDocument();
      expect(screen.getAllByText(post.author.name)[0]).toBeInTheDocument();
    });
  });

  it('clicking a post link navigates to the correct URL', () => {
    posts.forEach((post, index) => {
      const postLink = post.href;
      expect(screen.getAllByTestId('link')[index]).toHaveAttribute('href', postLink);
    });
  });
});
