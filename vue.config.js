// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

module.exports = {
  chainWebpack: (config) => {
    config.resolve.alias
      .set("@", path.resolve(__dirname, "src/"))
      .set("@components", path.resolve(__dirname, "src/components"))
      .set("@constans", path.resolve(__dirname, "src/constans"))
      .set("@graphql", path.resolve(__dirname, "src/graphql"))
      .set("@types", path.resolve(__dirname, "src/types"))
      .set("@use", path.resolve(__dirname, "src/use"));
    config.module
      .rule("graphql")
      .test(/\.(graphql|gql)$/)
      .use("graphql-tag/loader")
      .loader("graphql-tag/loader")
      .end();
  },
};
