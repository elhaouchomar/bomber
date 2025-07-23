import { eventManager } from "./events.js"

export class Router {
    constructor(DefaultPath, DefaultView, NotFoundView, root, pathsetter) {
        this.root = root
        this.pathsetter = pathsetter
        this.routes = new Map()
        this.DefaultPath = DefaultPath
        this.AddPath(DefaultPath, DefaultView)
        this.AddPath(404, NotFoundView)
        this.ListenTohash()
        this.RenderView(DefaultPath)

    }

    ListenTohash() {

        eventManager.addevent("hashchange", (e) => {
            e.preventDefault()
            if (this.GetCurrentPath().length > 0) {
                this.pathsetter(this.GetCurrentPath())
                this.RenderView(this.GetCurrentPath())
            }

        })
    }


    RenderView(Path) {
        const viewFn = this.routes.get(Path) || this.routes.get(this.DefaultPath);
        viewFn.update()
    }

    AddPath(Path, View) {
        this.routes.set(Path, View)
    }

    GetCurrentPath() {
        return location.hash
    }
}

