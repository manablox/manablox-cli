import { GraphQLModule } from '@graphql-modules/core'

export default async (graphModuleName) => {
    const graphModule = await import(`~~/dynamicgraphs/${ graphModuleName }`)
    return new GraphQLModule(await graphModule.default())
}