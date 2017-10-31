import app from '../components/app';
import PostList from '../components/PostList';

const POSTS_PER_PAGE = 10

const HomePage = () => (
  <div>
    <h1>Home Page</h1>
    <PostList />
  </div>
);

export default app(HomePage, {}, async controller => {
  // Prepare for badassity: Get state value from server
  const { app: { currentRoute } } = controller.model.get();
  const { query } = currentRoute;
  const someQueryVar = query.someVar;
  return controller.runSequence('app.fetchPosts', {
    skip: 0,
    first: POSTS_PER_PAGE
  });
});
