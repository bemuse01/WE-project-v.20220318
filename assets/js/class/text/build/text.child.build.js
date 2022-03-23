import Line from '../../objects/line.js'
import Line2 from '../../objects/line2.js'
import L from '../../../data/L.js'
import Shader from '../shader/text.child.shader.js' 
import * as THREE from '../../../lib/three.module.js'

export default class{
    constructor({group, size, param, data}){
        this.size = size
        this.group = group
        this.param = param
        this.data = data

        const {w, h} = this.data
        this.width = w * this.param.w
        this.height = h * this.param.h

        this.len = this.data.shapes.length
        this.object = []
        this.idx = Array.from({length: this.len}, _ => 0)

        this.init()
    }


    // init
    init(){
        this.create()
    }


    // create
    create(){
        for(let i = 0; i < this.len; i++){
            this.createLine2(i)
        }
    }
    createLine2(idx){
        const {position, opacity} = this.createAttribute(idx)

        this.object[idx] = new Line2({
            position: position,
            materialOpt: {
                color: this.param.color,
                // vertexColors: true,
                linewidth: this.param.linewidth,
                dashed: false,
                transparent: true,
                opacity: 1.0,
                alphaToCoverage: true,
                resolution: new THREE.Vector2(this.size.el.w, this.size.el.h)
                // blending: THREE.AdditiveBlending
            }
        })

        this.object[idx].setAttribute('aOpacity', new Float32Array(opacity), 1)

        this.object[idx].get().layers.set(PROCESS)

        this.group.add(this.object[idx].get())
    }
    createAttribute(idx){
        const position = []
        const opacity = []

        const wh = this.width / 2
        const hh = this.height / 2

        this.data.shapes[idx]['points'].forEach((e, i, a) => {
            const {rx, ry} = e

            const x = this.width * rx - wh
            const y = this.height * ry - hh

            position.push(x, -y, 0)
            opacity.push(0)
        })

        position.push(position[0], position[1], position[2])
        // opacity.push(0)

        return {position, opacity}
    }


    // resize
    resize(size){
        this.size = size
        
        for(let i = 0; i < this.len; i++){
            this.object[i].setUniform('resolution', new THREE.Vector2(size.el.w, size.el.h))
        }
    }


    // animate
    animate(){
        for(let i = 0; i < this.len; i++){
            const opacity = this.object[i].getAttribute('aOpacity')

            opacity.array[this.idx[i]] = 1
    
            this.idx[i] = (this.idx[i] + 1) % opacity.array.length
    
            for(let i = 0; i < opacity.array.length; i++){
                opacity.array[i] -= 0.006
            }
    
            opacity.needsUpdate = true
        }
    }
}