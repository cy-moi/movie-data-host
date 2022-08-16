import { gql } from 'apollo-server';

export const typeDefs = gql`
  type Movie {
    _id: ID!
    ChineseTitle: String!
    Title: String!
    MyRating: String!
    DoubanRating: String!
    Link: String!
    Comments: String!
    ChineseSummary: String!
  }

  type Query {
    getMovies: [Movie!]!,
    getMovie(id: ID!): Movie!
  }

  type Mutation {
    createMovie(Title: String!, Link: String!, Comments: String!): Movie!
  }

`;