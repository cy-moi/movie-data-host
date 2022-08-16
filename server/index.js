import 'dotenv/config'
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
// import { ApolloServer } from 'apollo-server';
import { ApolloServer } from 'apollo-server-express'
import { typeDefs } from './typeDefs';
import { resolvers } from './resolvers';
import Movies from './dataSources/movies';

const uri = process.env.MONGODB_URI
const main = async () => {
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
};

const app = express();
app.use(cors())

console.log("connection open")

main()
    .then(async ()=> {
        console.log('🎉 connected to database successfully')
        const collection = await mongoose.connection.collection("watchlist");
        // collection.find({}).toArray(function(err, result) {
        //     console.log(result)
        // })
        const dataSources = () => ({
            movies: new Movies(collection),
        });
        const server = new ApolloServer({ typeDefs, resolvers, dataSources })
        await server.start()
        server.applyMiddleware({ path: '/graphql', app})
        app.listen(8080, ()=> {console.log(`🚀 Server ready `)})
        // server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
        //     console.log(`🚀 Server ready at ${url}`);
        // });

    })
    .catch(error => console.error(error));




// });


