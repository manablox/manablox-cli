import { GraphQLModule } from '@graphql-modules/core'

export default (graph, router = null) => {
    let graphData = graph
    if(typeof graph.module !== 'undefined') graphData = graph.module

    let moduleData = { ...graphData }

    return new GraphQLModule({ ...moduleData })
}