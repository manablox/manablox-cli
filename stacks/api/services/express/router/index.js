export default class Router {
    constructor(app){
        this.app = app
        this.routes = {}
    }

    AddDynamicRoute(routeSettings){
        this.routes[routeSettings.url] = {
            url: routeSettings.url,
            method: routeSettings.method,
            handler: routeSettings.handler
        }

        this.InitRoute(this.routes[routeSettings.url])
    }

    AddRoute(routeSettings){
        const url = routeSettings.name
            .replace('.', '')
            .replace('/index.js', '')
            .replace('.js', '')
            .split('/')
            .map(urlPart => urlPart.startsWith('_') ? urlPart.replace('_', ':') : urlPart)
            .join('/')

        this.routes[url] = {
            url: url || '/',
            method: routeSettings.route.method,
            handler: routeSettings.route.handler
        }

        this.InitRoute(this.routes[url])
    }

    InitRoute(route){
        if(route.method == 'get') this.app.Get(route.url, route.handler)
        if(route.method == 'post') this.app.Post(route.url, route.handler)
        if(route.method == 'put') this.app.Put(route.url, route.handler)
        if(route.method == 'delete') this.app.Delete(route.url, route.handler)
    }

    AddRoutes(routes){
        for(let i = 0; i < routes.length; i++){
            this.AddRoute(routes[i])
        }
    }
}