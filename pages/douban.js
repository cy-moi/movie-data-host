import React from 'react';
import 'dotenv/config'
// import ReactDom from 'react-dom/client';
import * as Realm from "realm-web";
import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  gql
} from "@apollo/client";

// Connect to your MongoDB Realm app
const app = new Realm.App('doubanbackup-wpeti');
// Gets a valid Realm user access token to authenticate requests
async function getValidAccessToken() {
  // Guarantee that there's a logged in user with a valid access token
  if (!app.currentUser) {
    // If no user is logged in, log in an anonymous user. The logged in user will have a valid
    // access token.
    await app.logIn(Realm.Credentials.anonymous());
  } else {
    // An already logged in user's access token might be stale. To guarantee that the token is
    // valid, we refresh the user's custom data which also refreshes their access token.
    await app.currentUser.refreshCustomData();
  }
  return app.currentUser.accessToken;
}

const client = new ApolloClient({
  link: new HttpLink({
    uri: process.env.SERVER_URL,
    fetch: async (uri, options) => {
      const accessToken = await getValidAccessToken();
      options.headers.Authorization = `Bearer ${accessToken}`;
      return fetch(uri, options);
    },
  }),
  cache: new InMemoryCache()
});

const movieQuery = gql`
  query EaQuery {
    getMovies {
      _id
    }
  }
`;

export const getStaticProps = async () => {
  try {
    const { data: { getMovies } } = await client.query({ query: movieQuery });
    console.log(getMovies.length)
    return { props: { getMovies } }
  } catch (err) {
    console.error('page error')
    throw (err)
  }
}

export default function Douban({ getMovies }) {
  // console.log(watchlists)
  return (
    <ApolloProvider client={client}>
      <div>
        <h2>My first Apollo app 🚀</h2>
        {getMovies ? getMovies.map(({ _id }) => (
          <div key={_id}>
            <p>
              {_id}
            </p>
          </div>
        )) : null}
      </div>
    </ApolloProvider>
  );
}

// if (typeof window !== 'undefined' && document.getElementById('root') !== 'undefined') {
//   ReactDom.createRoot(document.getElementById('root')).render(
//     <ApolloProvider client={client}>
//       <Douban />
//     </ApolloProvider>
//   );
// }



