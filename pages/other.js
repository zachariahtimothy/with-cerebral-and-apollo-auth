import app from '../components/app';
import PostList from '../components/PostList';

const OtherPage = () => (
  <div>
    <h1>Other Page with PostList</h1>
    <PostList />
  </div>
);

export default app(OtherPage);
