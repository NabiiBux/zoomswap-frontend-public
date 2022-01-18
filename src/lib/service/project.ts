import { publicConfig } from '../../config/index'
import { request, GraphQLClient, gql } from 'graphql-request'

export const aggregateQuery = () => {
  return gql`
    query {
      token_erc20_aggregate(
        where: {
          contract_address: { _eq: "io1lpaw6pygngwaq9vans3tp4tmx3dtzmwa38cf2d" }
          recipient: { _eq: "io1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqd39ym7" }
        }
      ) {
        aggregate {
          sum {
            amount
          }
        }
      }
    }
  `
}

export const graphQLClient = new GraphQLClient(publicConfig.APIURL, {
  credentials: 'include',
  mode: 'cors',
})
