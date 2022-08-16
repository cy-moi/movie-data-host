import 'dotenv/config'
import mongoose from 'mongoose';
import { ApolloServer } from 'apollo-server';

import { typeDefs } from './typeDefs';
import { resolvers } from './resolvers';
import Movies from './dataSources/movies';

const uri = process.env.MONGODB_URI
const main = async () => {
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
};

// const connection = mongoose.connection;
// // let collection;

// connection.on('error', console.error.bind(console, 'connection error:'));
// connection.on('open', function () {
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
        
            server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
            console.log(`🚀 Server ready at ${url}`);
            });

        })
        .catch(error => console.error(error));




// });


