import gql from 'graphql-tag';

const allPosts = gql`
query allPosts($first: Int!, $skip: Int!) {
  allPosts(orderBy: createdAt_DESC, first: $first, skip: $skip) {
    id
    title
    votes
    url
    createdAt
  },
  _allPostsMeta {
    count
  }
}
`;

const upvotePost = gql`
mutation updatePost($id: ID!, $votes: Int) {
  updatePost(id: $id, votes: $votes) {
    id
    __typename
    votes
  }
}
`

export async function getPosts({ apollo, props: { skip, first } }) {
  const queryResult = await apollo.query({
    query: allPosts,
    variables: {
      skip,
      first,
    },
  });
  const { data } = queryResult;
  return {
    posts: data.allPosts,
  };
}

export async function upVotePost({ apollo, props: { id, votes } }) {
  const mutationResult = await apollo.mutate({
    mutation: upvotePost,
    variables: {
      id,
      votes,
    }
  });
  return {};
}
