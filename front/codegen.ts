
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:4200/graphql",
  documents: ["apollo/requests/**/*.{ts,tsx,graphql}"],
  generates: {
    "apollo/gql/": {
      preset: "client",
      plugins: ["typescript", "typescript-operations"]
    },
    "./graphql.schema.json": {
      plugins: ["introspection"]
    }
  }
};

export default config;
