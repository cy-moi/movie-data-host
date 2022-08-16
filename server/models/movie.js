import mongoose from "mongoose";

const connection = mongoose.connection;

connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', function () {

    const collection = connection.db.collection("watchlist");

});