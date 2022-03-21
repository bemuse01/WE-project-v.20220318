export default class{
    constructor(){
        this.init()
    }


    // init
    init(){
        this.create()
    }


    // create
    create(){
        const canvas = document.getElementById('canvas')

        this.engine = new BABYLON.Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true})

        this.scene = new BABYLON.Scene(this.engine)
        this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 0)

        // this.camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3.Zero(), this.scene)
        // this.camera.setTarget(BABYLON.Vector3.Zero())
        // this.camera.attachControl(canvas, true)

        this.camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 0, -100), this.scene)
        this.camera.setTarget(BABYLON.Vector3.Zero())
        // this.camera.attachControl(canvas, true)
    }


    // resize
    resize(){
        this.engine.resize()
    }


    // animate
    animate(){
        this.scene.render()
    } 
}