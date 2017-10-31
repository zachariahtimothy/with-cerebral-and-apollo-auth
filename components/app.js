import { Component } from 'react';
import { Controller, UniversalController } from 'cerebral';
import { Container } from '@cerebral/react';
import { loadGetInitialProps } from 'next/dist/lib/utils';
import initApollo from '../lib/initApollo';
import ApolloCerebralProvider, { ApolloProviderError } from '../lib/ApolloProvider';
import modules from '../modules';

const redirectUrlKey = 'redirectUrl';
const redirectPath = '/login';
const tokenKey = 'myapp_token';
let Devtools = null;

if (process.browser) {
  Devtools = (
    // eslint-disable-next-line global-require
    process.env.NODE_ENV === 'production' ? null : require('cerebral/devtools').default
  );
}

const redirectToSignIn = ({ pathname, res }) => {
  const path = `${redirectPath}?${redirectUrlKey}=${encodeURIComponent(
    pathname,
  )}`;
  if (res) {
    res.writeHead(303, { Location: path });
    res.end();
  } else {
    Router.replace(path);
  }
};

const errorHandler = ({ props }) => {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line
    console.error('Cerebral error handler', props.error);
  }
};

const app = (Page, options, prepareProps) => {
  const { requireAuth = true } = options || {};

  class App extends Component {
    static async getInitialProps(context) {
      const cookie = {}; /// getCookies...
      const isAuthenticated = !!cookie;
  
      if (requireAuth && !isAuthenticated) {
        redirectToSignIn(context);
        // Return nothing because component will not be rendered on redirect.
        return {};
      }

      const isServer = Boolean(context.req);
      const token = cookie ? cookie[tokenKey] : '';
      const apollo = initApollo(token);

      const providers = [
        ApolloCerebralProvider(apollo),
      ];
      const controller = UniversalController({
        modules,
        providers,
      });
      
      if (prepareProps) {
        await prepareProps(controller);
      }

      controller.setState('auth.token', token);
      controller.setState('navigation.currentRoute', { query: context.query, pathname: context.pathname });
      // Load initial props from page components (pass on context and universal controller)
      const pageInitialProps = await loadGetInitialProps(Page, { ...context });

      if (isServer) {
        return {
          token,
          stateChanges: controller.getChanges(),
          ...pageInitialProps,
        };
      }

      return {
        token,
        ...pageInitialProps,
      };
    }

    constructor(props) {
      super(props);

      const { token, stateChanges, apolloData } = props;

      this.apollo = initApollo(token);

      const providers = [
        ApolloCerebralProvider(this.apollo),
      ];

      this.controller = Controller({
        devtools: Devtools && Devtools({
          // If running standalone debugger. Some environments
          // might require 127.0.0.1 or computer IP address
          host: 'localhost:8787',
          // By default the devtools tries to reconnect
          // to debugger when it can not be reached, but
          // you can turn it off
          reconnect: true,
          warnStateProps: true,
          bigComponentsWarning: 6,
        }),
        catch: new Map([
          [ApolloProviderError, errorHandler],
          [Error, errorHandler]
        ]),
        providers,
        modules,
        stateChanges,
      });
    }

    render() {
      return (
        <Container controller={this.controller}>
          <Page {...this.props} />
        </Container>
      );
    }
  }

  return App;
};

export default app;

