import CreateGraphModule from '../utils/createmodule'

export default class Router {
    constructor(graphService, graphs){
        this.graphService = graphService
        this.graphs = graphs

        this.graphModules = this.AddGraphModules(graphs)
    }

    get Modules(){
        return this.graphModules.map((graph) => {
            return graph
        })
    }
    
    get ModuleProviders(){
        return this.graphs.map((graph) => {
            return graph
        })
    }

    AddGraphModules(graphs){
        let modules = []

        for(let i = 0; i < graphs.length; i++){
            modules.push(this.AddGraphModule(graphs[i]))
        }

        return modules
    }

    AddGraphModule(graph){
        return CreateGraphModule(graph, this)
    }

}