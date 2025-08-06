// src/apollo/client.ts
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { protocol, RootApi, tenant } from "../config";

const httpLink = createHttpLink({
  uri: `${protocol}${tenant}${RootApi}/graphql/`,
});

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
