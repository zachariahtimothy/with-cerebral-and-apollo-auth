import { connect } from '@cerebral/react';
import { signal } from 'cerebral/tags';

const PostUpvoter = ({ upvote, votes, id }) => (
  <button onClick={() => upvote({ id, votes: votes + 1 })}>
    {votes}
    <style jsx>{`
        button {
          background-color: transparent;
          border: 1px solid #e4e4e4;
          color: #000;
        }
        button:active {
          background-color: transparent;
        }
        button:before {
          align-self: center;
          border-color: transparent transparent #000000 transparent;
          border-style: solid;
          border-width: 0 4px 6px 4px;
          content: "";
          height: 0;
          margin-right: 5px;
          width: 0;
        }
      `}</style>
  </button>
);

export default connect({
  upvote: signal`app.onPostUpvoteClick`,
}, PostUpvoter);
