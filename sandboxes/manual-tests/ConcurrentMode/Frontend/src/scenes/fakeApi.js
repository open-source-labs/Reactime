export function fetchProfileData() {
  const userPromise = fetchUser();
  const postsPromise = fetchPosts();
  return {
    user: wrapPromise(userPromise),
    posts: wrapPromise(postsPromise)
  };
}

// Suspense integrations like Relay implement
// a contract like this to integrate with React.
// Real implementations can be significantly more complex.
// Don't copy-paste this into your project!
function wrapPromise(promise) {
  let status = 'pending';
  let result;
  const suspender = promise.then(
    r => {
      status = 'success';
      result = r;
    },
    e => {
      status = 'error';
      result = e;
    }
  );
  return {
    read() {
      if (status === 'pending') {
        throw suspender;
      } else if (status === 'error') {
        throw result;
      } else if (status === 'success') {
        return result;
      }
    }
  };
}

function fetchUser() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        name: 'Reactime ⌛'
      });
    }, 1000);
  });
}

let ringoPosts = [
  {
    id: 0,
    text: 'I get by with a little help from my friends'
  },
  {
    id: 1,
    text: "I'd like to be under the sea in an octupus's garden"
  },
  {
    id: 2,
    text: 'You got that sand all over your feet'
  }
];

// Simulate new posts being added over time
let i = 3;
setInterval(() => {
  ringoPosts = [
    {
      id: i++,
      text: `My new post #${i}`
    },
    ...ringoPosts
  ];
}, 3000);

function fetchPosts() {
  const ringoPostsAtTheTime = ringoPosts;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(ringoPostsAtTheTime);
    }, 2000);
  });
}
