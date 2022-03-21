import * as THREE from '../../lib/three.module.js'
import {MeshLine, MeshLineMaterial} from '../../lib/THREE.MeshLine.js'

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
        this.mesh = new THREE.Mesh(geometry, material)
    }
    createGeometry(){
        const geometry = new THREE.BufferGeometry().setFromPoints(this.position)
        const meshLine = new MeshLine()
        meshLine.setGeometry(geometry)
        return meshLine
    }
    createMaterial(){
        return new MeshLineMaterial(this.materialOpt)
    }


    // dispose
    dispose(){

    }


    // set
    setAttribute(name, array, itemSize){
        this.mesh.geometry.setAttribute(name, new THREE.BufferAttribute(array, itemSize))
    }
    setUniform(name, value){
        this.mesh.material.uniforms[name].value = value
    }


    // get
    get(){
        return this.mesh
    }
    getGeometry(){
        return this.mesh.geometry
    }
    getMaterial(){
        return this.mesh.material
    }
    getAttribute(name){
        return this.mesh.geometry.attributes[name]
    }
}