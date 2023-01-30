# Dyad Subgraph

## Setup

To generate types based on ABI for use in mappings, build subgraph schema, and deploy to hosted service, run:

```bash
npm install -g @graphprotocol/graph-cli
npm install -g yarn
yarn install

# generate bindings based on ABI and schema
graph codegen
# generate files for clients
graph build
```


## Deploy

```bash
# deploy to the graph hosted service
graph auth --product hosted-service <your_key> # authenticated through cli
graph deploy --product hosted-service 0xtarc/dyad-subgraph-goerli
```
