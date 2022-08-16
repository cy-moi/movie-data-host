import { MongoDataSource } from 'apollo-datasource-mongodb'

export default class Movies extends MongoDataSource {
  async getMovies() {
    // this.collection.find({}).toArray(function(err, result) {
    //     console.log(result)
    // })
    return await this.collection.find({}).toArray();
  }

  async getMovie(id) {
    return await this.findOneById(id);
  }

  async createMovie({ Title, Link, Comments }) {
    const check = await this.collection.findOne({ Link });
    if(check) throw new Error('Lnink is already in use')
    await this.collection.insertOne({ Title, Link, Comments });
    const inserted = await this.collection.findOne({ Link });
    return inserted;
    
  }
}