import {LineGeometry} from '../../lib/LineGeometry.js'
import {LineMaterial} from '../../lib/LineMaterial.js'
import {Line2} from '../../lib/Line2.js'

export default class{
    constructor({position, color, linewidth}){
        this.color = color
        this.linewidth = linewidth
        this.position = position
        
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
        return new LineMaterial({
            color: this.color,
            // vertexColors: true,
            linewidth: this.linewidth,
            dashed: false,
            transparent: true,
            opacity: 1.0,
            alphaToCoverage: true,
            // blending: THREE.AdditiveBlending
        })
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
}