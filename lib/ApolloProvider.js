import { ApolloError } from 'apollo-client';

export const ApolloProviderError = ApolloError;

function ApolloProviderFactory(apolloClient) {
  return context => {
    context.apollo = apolloClient;

    if (context.debugger) {
      context.debugger.wrapProvider('apollo');
    }

    return context;
  };
}

export default ApolloProviderFactory;

