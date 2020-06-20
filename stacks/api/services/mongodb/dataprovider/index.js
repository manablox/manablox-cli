import MongoDBService from '~~/services/mongodb'
import databaseConfig from '~~/config/database'

export default class DataProvider {
    constructor(config){
        this.config = config

        this.database = new MongoDBService(databaseConfig)
        this.database.Connect()
    }

    async Find(...params){
        return this.database.Find({ collection: this.config.collection, ...params })
    }

    async FindById(...params){
        return this.database.FindById(this.config.collection, ...params)
    }

    async FindOne(params){
        return this.database.FindOne({ collection: this.config.collection, ...params })
    }

    async Create(params){
        return this.database.Create({ collection: this.config.collection, data: params })
    }

    async UpdateById(...params){
        return this.database.UpdateById(this.config.collection, ...params)
    }

    async Update(params){
        return this.database.Update({ collection: this.config.collection, ...params })
    }

    async Delete(...params){
        return this.database.Delete({ collection: this.config.collection, params })
    }

    async DeleteById(...params){
        return this.database.DeleteById(this.config.collection, ...params)
    }
}