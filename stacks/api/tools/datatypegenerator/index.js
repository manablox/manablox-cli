import GraphModuleGenerator from '~~/services/graphql/utils/generatemodule'

const Start = async () => {
    console.log('test')        

    try {
        const graphModuleGenerator = new GraphModuleGenerator()

        const types = []
        const typeFiles = require.context(`../../datatypes`, true, /\.js$/)
        typeFiles.keys().map((typeFilename) => { types.push(typeFiles(typeFilename).default) })

        for(let i = 0; i < types.length; i++){
            await graphModuleGenerator.Generate(types[i])
        }
    }catch(err){
        console.log(err)
    }

}

Start()