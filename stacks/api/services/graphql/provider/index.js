import DataProvider from '~~/services/mongodb/dataprovider'

export default class Provider {
    constructor(collectionName){
        this.context = null
        this.dataprovider = new DataProvider({ collection: collectionName })
        console.log(`registered ${ collectionName } provider`)
    }

    SetContext(context){
        this.context = context
    }

    async FindById(id){
        return this.dataprovider.FindById(id)
    }

    async All(){
        return this.dataprovider.Find()
    }

    async Create(data){
        return this.dataprovider.Create(data)
    }
}