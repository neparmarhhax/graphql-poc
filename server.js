const express = require('express')
const expressGraphQL = require('express-graphql')
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull
} = require('graphql')
const app = express()

const PORT_NUMBER = 5000

const providers = [
  {ProviderId: 1, state: 'TX', name: 'Provider name 1', providerCode: 'VC1', email: 'Provider1@gmail.com', chhaId: 1},
  {ProviderId: 2, state: 'TX', name: 'Provider name 2', providerCode: 'VC2', email: 'Provider2@gmail.com', chhaId: 2},
  {ProviderId: 3, state: 'TX', name: 'Provider name 3', providerCode: 'VC3', email: 'Provider3@gmail.com', chhaId: 3},
  {ProviderId: 4, state: 'TX', name: 'Provider name 4', providerCode: 'VC4', email: 'Provider4@gmail.com', chhaId: 4},
  {ProviderId: 5, state: 'TX', name: 'Provider name 5', providerCode: 'VC5', email: 'Provider5@gmail.com', chhaId: 5},
  {ProviderId: 6, state: 'TX', name: 'Provider name 6', providerCode: 'VC6', email: 'Provider6@gmail.com', chhaId: 1},
  {ProviderId: 7, state: 'TX', name: 'Provider name 7', providerCode: 'VC7', email: 'Provider7@gmail.com', chhaId: 2},
  {ProviderId: 8, state: 'TX', name: 'Provider name 8', providerCode: 'VC8', email: 'Provider8@gmail.com', chhaId: 3},
  {ProviderId: 9, state: 'TX', name: 'Provider name 9', providerCode: 'VC9', email: 'Provider9@gmail.com', chhaId: 4},
  {ProviderId: 10, state: 'TX', name: 'Provider name 10', providerCode: 'VC10', email: 'Provider10@gmail.com', chhaId: 5},
]
const payers = [
  { payerId: 1, name: 'payer1', state: 'NJ' },
  { payerId: 2, name: 'payer2', state: 'NJ' },
  { payerId: 3, name: 'payer3', state: 'NJ' },
  { payerId: 4, name: 'payer4', state: 'NJ' },
  { payerId: 5, name: 'payer5', state: 'NJ' }
]


const PayerType = new GraphQLObjectType({
  name: 'Payer',
  description: 'This represents a payer',
  fields: () => ({
    payerId: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    state: { type: GraphQLNonNull(GraphQLString) },
    providers: {
      type: new GraphQLList(ProviderType),
      resolve: (payer) => {
        return providers.filter(Provider => Provider.chhaId === payer.payerId)
      }
    }
  })
})

const ProviderType = new GraphQLObjectType({
  name: 'Provider',
  description: 'This represents a Provider/Providers',
  fields: () => ({
    ProviderId: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    state: { type: GraphQLNonNull(GraphQLString) },
    providerCode: { type: GraphQLNonNull(GraphQLString) },
    email: { type: GraphQLNonNull(GraphQLString) },
    payer: {
      type: PayerType,
      resolve: (provider) => {
        return payers.find(payer => payer.payerId === provider.chhaId)
      }
    }
  })
})

const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query',
  fields: () => ({
    payer: {
      type: PayerType,
      description: 'A Single Payer',
      args: {
        payerId: { type: GraphQLInt }
      },
      resolve: (parent, args) => payers.find(payer => payer.payerId === args.payerId)
    },
    payers: {
      type: new GraphQLList(PayerType),
      description: 'List of All Payers',
      resolve: () => payers
    },
    providers: {
      type: new GraphQLList(ProviderType),
      description: 'List of All Providers',
      resolve: () => providers
    },
    provider: {
      type: ProviderType,
      description: 'A Single Provider',
      args: {
        providerId: { type: GraphQLInt }
      },
      resolve: (parent, args) => providers.find(provider => provider.providerId === args.providerId)
    }
  })
})

const schema = new GraphQLSchema({
  query: RootQueryType
})

app.use('/graphql', expressGraphQL({
  schema: schema,
  graphiql: true
}))
app.listen(PORT_NUMBER, () => console.log(`Server Running on localhost:${PORT_NUMBER}`))