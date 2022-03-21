import {LineGeometry} from '../../lib/LineGeometry.js'
import {LineMaterial} from '../../lib/LineMaterial.js'
import {Line2} from '../../lib/Line2.js'

export default class{
    constructor({position, materialOpt}){
        this.position = position
        this.materialOpt = materialOpt
        
        this.init()
    }


    // init
    init(){
        this.create()
    }


    // create
    create(){
        const geometry = this.createGeometry()
        const material = this.createMaterial()

        this.mesh = new Line2(geometry, material)
        this.mesh.computeLineDistances()
    }
    createGeometry(){
        const geometry = new LineGeometry()
        
        geometry.setPositions(this.position)

        return geometry
    }
    createMaterial(){
        return new LineMaterial(this.materialOpt)
    }


    // dispose
    dispose(){

    }


    // get
    get(){
        return this.mesh
    }
    getPosition(){
        return this.icosa.position
    }


    // set
    setPositions(array){
        this.mesh.geometry.setPositions(array)
    }
    setUniform(name, value){
        this.mesh.material.uniforms[name].valeu = value
    }
}