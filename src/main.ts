import { createApp, h, provide } from "vue";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { DefaultApolloClient, provideApolloClient } from "@vue/apollo-composable";

import App from "./App.vue";

const defaultClient = new ApolloClient({
  uri: "https://rickandmortyapi.com/graphql",
  cache: new InMemoryCache(),
});

createApp({
  setup() {
    provide(DefaultApolloClient, defaultClient);
    provideApolloClient(defaultClient);
  },
  render() {
    return h(App);
  },
}).mount("#app");
