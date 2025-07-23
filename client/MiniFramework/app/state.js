import {diff, patch, render } from "./dom.js";


let currentComponent = null

export class StoreState {
    constructor(initialValue = {}) {
        this.state = initialValue;
        this.listeners = [];
    }
    subscribe(listener) {
        this.listeners.push(listener);
    }

    unsubscribe(listener) {
        this.listeners = this.listeners.filter(l => l !== listener);
    }

    getState() {
        return this.state;
    }

    setState(newState) {
        if (typeof newState === 'function') {
            this.state = newState(this.state)
        } else if (typeof newState === "string") {
            this.state = newState

        } else if (Array.isArray(this.state)) {
            this.state = [...this.state, newState]
        } else {

            this.state = { ...this.state, ...newState };
        }

        //   if (typeof newState === 'function') {
        //     this.state = newState(this.state)
        //   } else {
        //     this.state = newState
        //   }
        this.notify();



        //   if (typeof newState === 'function') {
        //     this.state = newState(this.state); // Functional update
        //   } else {
        //     this.state = { ...this.state, ...newState }; 
        //   }




    }

    notify() {
        this.listeners.forEach(listener => listener.update());
    }
}

export function useState(initialValue) {


    const comp = currentComponent

    const stateIndex = currentComponent.stateIndex++
    if (!comp.states[stateIndex]) {
        const store = new StoreState(initialValue)
        store.subscribe(comp)
        comp.states[stateIndex] = store


    }

    const store = comp.states[stateIndex]
    return [() => store.getState(),
    store.setState.bind(store),
    store.subscribe.bind(store),
    store.unsubscribe.bind(store)]

}

export class Component {
    constructor(props, root, renderfunc) {
        this.props = props
        this.states = []
        this.stateIndex = 0

        this.root = root
        this.renderfunc = renderfunc
        this.render()

    }


    render() {
        this.stateIndex = 0
        currentComponent = this
        this.dom = this.renderfunc()
        render(this.dom, this.root)
        currentComponent = null

    }

    update() {
        this.stateIndex = 0
        currentComponent = this;
        const newVd = this.renderfunc()
        const patches = diff(this.dom, newVd)

        patch(this.root, patches)
        this.dom = newVd;
        currentComponent = null
    }
}