import fs from 'fs-jetpack'
import path from 'path'
import prettier from 'prettier'

import schemaTemplate from '~~/templates/graphqlmodule/schema.ejs'
import resolverTemplate from '~~/templates/graphqlmodule/resolver.ejs'
import providerTemplate from '~~/templates/graphqlmodule/provider.ejs'
import moduleTemplate from '~~/templates/graphqlmodule/module.ejs'

const generatedModulesPath = `graphs`

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1)
}
  

export default class GraphModuleGenerator {
    constructor(config){
        this.config = config
    }

    async Generate(datatype){
        this.CreateModuleFolder(datatype)
        this.CreateModuleFile(datatype)
        this.CreateSchemaFile(datatype)
        this.CreateResolverFile(datatype)
        this.CreateProviderFile(datatype)
    }

    CreateModuleFolder(datatype){
        fs.remove(`${ generatedModulesPath }/${ datatype.name }`)
        fs.dir(`${ generatedModulesPath }/${ datatype.name }`)
    }

    CreateModuleFile(datatype){
        try {
            const moduleContent = prettier.format(moduleTemplate(datatype), { parser: 'babel' })
            fs.file(`${ generatedModulesPath }/${ datatype.name }/index.js`, { content: moduleContent })
        }catch(err){
            console.log(err)
        }
    }

    CreateSchemaFile(datatype){
        try {
            const schemaContent = prettier.format(schemaTemplate(datatype), { parser: 'graphql' })
            fs.file(`${ generatedModulesPath }/${ datatype.name }/schema.graphql`, { content: schemaContent })
        }catch(err){
            console.log(err)
        }
    }

    CreateResolverFile(datatype){
        try {
            const resolverContent = prettier.format(resolverTemplate(datatype), { parser: 'babel' })
            fs.file(`${ generatedModulesPath }/${ datatype.name }/resolvers.js`, { content: resolverContent })
        }catch(err){
            console.log(err)
        }
    }

    CreateProviderFile(datatype){
        try {
            const providerContent = prettier.format(providerTemplate(datatype), { parser: 'babel' })
            fs.file(`${ generatedModulesPath }/${ datatype.name }/provider.js`, { content: providerContent })
        }catch(err){
            console.log(err)
        }
    }
}