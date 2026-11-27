import type { CodegenConfig } from "@graphql-codegen/cli"

const config: CodegenConfig = {
  schema: "./src/schema/*.graphql", // get schema from src/schema
  documents: ["src/**/*.{ts,tsx}"], // look in these documents for types
  ignoreNoDocuments: true,
  generates: {
     "./src/__generated__/graphql.ts": {
      config: {
        generateOperationTypes: false,
      }, // generate __generated__/graphql for main types
      plugins: ["typescript"],
    },
    "./src/": {
      preset: "near-operation-file", // make extra __generated__/some-file.ts for components using new types
      plugins: ["typescript-operations"],
      config: {
        importSchemaTypesFrom: "./src/__generated__/graphql.ts",
        nonOptionalTypename: true,
        skipTypeNameForRoot: true,
        omitOperationSuffix: true,
      },
      presetConfig: {
        folder: "__generated__"
      }
    },

  }
}

export default config;