import app from '../components/app';
import PostList from '../components/PostList';

const POSTS_PER_PAGE = 10

const HomePage = () => (
  <div>
    <h1>Home Page</h1>
    <PostList />
  </div>
);

HomePage.getInitialProps = async ({ query, req, controller }) => {
  await controller.runSequence('app.fetchPosts', {
    skip: 0,
    first: POSTS_PER_PAGE
  });
  return {
    // Return changes if you simply want to load data without listening for state in sub-components
    // changes: controller.getChanges(),
  };
};
// export default HomePage;
export default app(HomePage);
