const posts = [
  {
    title: 'Our Legendary Article here',
    href: '#',
    category: { name: 'Greatness', href: '#' },
    description:
      'Reactime v17, we have come a long way from beta. Now introducing full Context API support and CustomHooks support: thereby allowing developers to better visualize the states and ... ',
    date: 'Dec 14, 2022',
    datetime: '2022-12-14',
    imageUrl:
      'https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1679&q=80',
    readingTime: '6 min',
    author: {
      name: 'James Nghiem',
      href: '#',
      imageUrl:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
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
    description: 'Reactime is a debugging tool that lets developers take snapshots of an application\’s state data as well as time-travel through these snapshots. The snapshots display React...',
    date: 'Jun 16, 2022',
    datetime: '2022-06-16',
    imageUrl:
      'https://images.unsplash.com/photo-1492724441997-5dc865305da7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1679&q=80',
    readingTime: '9 min',
    author: {
      name: 'Robby Tipton',
      href: 'https://medium.com/@robbytiptontol',
      imageUrl:
        'https://miro.medium.com/fit/c/96/96/1*pi-RH2LRvsZA9vLZTvY2mg.jpeg',
    },
  },
]

export default function Blogs() {
  return (
    <div className="relative bg-gray-50 px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-24 lg:pb-28">
      <div className="absolute inset-0">
        <div className="h-1/3 bg-white sm:h-2/3" />
      </div>
      <div className="relative mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">From the Blog</h2>
          <p className="mx-auto mt-3 max-w-2xl text-xl text-gray-500 sm:mt-4">
            See the blogs from the most recent updates and to the past years!
          </p>
        </div>
        <div className="mx-auto mt-12 grid max-w-lg gap-5 lg:max-w-none lg:grid-cols-3">
          {posts.map((post) => (
            <div key={post.title} className="flex flex-col overflow-hidden rounded-lg shadow-lg">
              <div className="flex-shrink-0">
                <img className="h-48 w-full object-cover" src={post.imageUrl} alt="" />
              </div>
              <div className="flex flex-1 flex-col justify-between bg-white p-6">
                <div className="flex-1">
                  <p className="text-sm font-medium text-rose-500">
                    <a href={post.category.href} className="hover:underline">
                      {post.category.name}
                    </a>
                  </p>
                  <a href={post.href} className="mt-2 block">
                    <p className="text-xl font-semibold text-gray-900">{post.title}</p>
                    <p className="mt-3 text-base text-gray-500">{post.description}</p>
                  </a>
                </div>
                <div className="mt-6 flex items-center">
                  <div className="flex-shrink-0">
                    <a href={post.author.href}>
                      <span className="sr-only">{post.author.name}</span>
                      <img className="h-10 w-10 rounded-full" src={post.author.imageUrl} alt="" />
                    </a>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      <a href={post.author.href} className="hover:underline">
                        {post.author.name}
                      </a>
                    </p>
                    <div className="flex space-x-1 text-sm text-gray-500">
                      <time dateTime={post.datetime}>{post.date}</time>
                      <span aria-hidden="true">&middot;</span>
                      <span>{post.readingTime} read</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}