import { set } from 'cerebral/operators';
import { state, props } from 'cerebral/tags';
import { getPosts, upVotePost } from './actions';

export const fetchPosts = [
  getPosts,
  set(state`app.posts`, props`posts`)
];

export const onPostUpvoteClick = [
  upVotePost,
];
