import * as THREE from '../../lib/three.module.js'

export default class{
    constructor({count, positionVelocity, lifeVelocity, materialOpt}){
        this.count = count
        this.materialOpt = materialOpt

        if(positionVelocity){
            this.positionVelocity = Array.from({length: count}, () => THREE.Math.randFloat(positionVelocity.min, positionVelocity.max))
        }

        if(lifeVelocity){
            this.lifeVelocity = Array.from({length: count}, () => THREE.Math.randFloat(lifeVelocity.min, lifeVelocity.max))
        }

        this.init()
    }


    // init
    init(){
        this.create()
    }


    // create
    create(){
        this.createGeometry()
        this.createMaterial()
        this.mesh = new THREE.Points(this.geometry, this.material)
    }
    createGeometry(){
        this.geometry = new THREE.BufferGeometry()

        this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(Array.from({length: this.count * 3}, _ => 0), 3))
    }
    createMaterial(){
        if(this.materialOpt.vertexShader){
            this.material = new THREE.ShaderMaterial(this.materialOpt)
        }else{
            this.material = new THREE.PointsMaterial(this.materialOpt)
        }
    }


    // dispose
    dispose(){
        
    }


    // set
    setAttribute(name, array, itemSize){
        this.mesh.geometry.setAttribute(name, new THREE.BufferAttribute(array, itemSize))
    }
    setUniform(name, value){
        this.material.uniforms[name].value = value
    }


    // get
    get(){
        return this.mesh
    }
    getAttribute(name){
        return this.mesh.geometry.attributes[name]
    }
}