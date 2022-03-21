import CHILD from './build/text.child.build.js'

export default class{
    constructor({app}){
        this.param = {
        }

        this.modules = {
            CHILD,
        }
        this.comp = {}

        this.init(app)
    }


    // init
    init(app){
        this.initComp()
        this.create(app)
    }
    initComp(){
        for(const module in this.modules){
            this.comp[module] = null
        }
    }


    // create
    create({engine, scene}){
        for(const module in this.modules){
            const instance = this.modules[module]

            this.comp[module] = new instance({engine, scene})
        }
    }


    // animate
    animate(){
        this.animateObject()
    }
    animateObject(){
        for(let i in this.comp){
            if(!this.comp[i] || !this.comp[i].animate) continue
            this.comp[i].animate()
        }
    }


    // resize
    resize(){
        // const rect = this.element.getBoundingClientRect()
        // const width = rect.right - rect.left
        // const height = rect.bottom - rect.top

        // this.size = {
        //     el: {
        //         w: width,
        //         h: height
        //     },
        //     obj: {
        //         w: PUBLIC_METHOD.getVisibleWidth(this.camera, 0),
        //         h: PUBLIC_METHOD.getVisibleHeight(this.camera, 0)
        //     }
        // }

        this.resizeObject()
    }
    resizeObject(){
        for(let i in this.comp){
            if(!this.comp[i] || !this.comp[i].resize) continue
            this.comp[i].resize()
        }
    }
}