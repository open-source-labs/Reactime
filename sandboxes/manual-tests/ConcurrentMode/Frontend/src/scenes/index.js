import React, { Suspense, useState } from 'react';
import { fetchProfileData } from './fakeApi';

import UseState from './sandboxes/useState';
import Sandboxes from './sandboxes';

const initialResource = fetchProfileData();

function ProfilePage() {
  const [resource, setResource] = useState(initialResource);

  function handleRefreshClick() {
    setResource(fetchProfileData());
  }

  return (
    <>
      <Suspense fallback={<h1>Loading profile...</h1>}>
        <ProfileDetails resource={resource} />
        <button type="button" onClick={handleRefreshClick}>
          Refresh
        </button>
        <Suspense fallback={<h1>Loading posts...</h1>}>
          <ProfileTimeline resource={resource} />
          <div className="font-weight-bold">
            The useState child below is a child of Suspense
          </div>
          <UseState />
        </Suspense>
      </Suspense>
      <div className="font-weight-bold">
        The useState child below is a sibling of Suspense
      </div>
      <UseState />
      {/* <div className="font-weight-bold text-center mt-5 mb-2">
        All sandboxes are below - they are a sibling of suspense
      </div>
      <Sandboxes /> */}
    </>
  );
}

function ProfileDetails({ resource }) {
  const user = resource.user.read();
  return <h1>{user.name}</h1>;
}

function ProfileTimeline({ resource }) {
  const posts = resource.posts.read();
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}

export default ProfilePage;
