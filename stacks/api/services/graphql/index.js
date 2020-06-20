import { ApolloServer } from 'apollo-server-express'
import { GraphQLModule } from '@graphql-modules/core'

class GraphQLService {
    constructor(params){
        this.config = params.config
        this.modules = params.modules
        this.server = params.server

        this.mainModule = null
        this.apollo = null
        this.middleware = null
    }

    async Start(){
        this.mainModule = new GraphQLModule({
            // context: (ctx) => {
            //     return ctx
            // },
            imports: [ ...this.modules ]
        })

        this.apollo = new ApolloServer({
            introspection: true,
            schema: this.mainModule.schema,
            debug: process.env.NODE_ENV !== 'production',
            // context: (ctx) => {
            //     return ctx
            // }
        })

        this.middleware = this.apollo.getMiddleware({
            path: this.config.prefix,
            bodyParserConfig: { limit: '64mb' }
        })

        this.server.Use((req, res, next) => {
            return this.middleware(req, res, next)
        })
    }

    AddGraphModule(graph){
        this.runtimeModules.push(this.graphRouter.AddGraphModule(graph))
        this.Start()
    }
}

export default GraphQLService