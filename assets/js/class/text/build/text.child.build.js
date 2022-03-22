import Line from '../../objects/line.js'
import Line2 from '../../objects/line2.js'
import L from '../../../data/L.js'
import Shader from '../shader/text.child.shader.js' 
import * as THREE from '../../../lib/three.module.js'

export default class{
    constructor({group, size, param}){
        this.size = size
        this.group = group

        this.param = param
        // this.param = {
        //     text: 'LAPLUS',
        //     width: 2250 * 0.015,
        //     height: 3000 * 0.015,
        //     color: 0x936cc6,
        //     linewidth: 3
        // }

        this.idx = 0

        this.init()
    }


    // init
    init(){
        this.create()
        // this.createTween()
    }


    // create
    create(){
        // this.createLine()
        this.createLine2()
    }
    createLine(){
        const {position, opacity} = this.createAttribute()

        this.object = new Line({
            materialOpt: {
                vertexShader: Shader.vertex,
                fragmentShader: Shader.fragment,
                transparent: true,
                uniforms: {
                    uColor: {value: new THREE.Color(this.param.color)}
                }
            }
        })

        this.object.setAttribute('position', new Float32Array(position), 3)
        this.object.setAttribute('aOpacity', new Float32Array(opacity), 1)

        this.object.get().layers.set(PROCESS)

        this.group.add(this.object.get())
    }
    createLine2(){
        const {position, opacity} = this.createAttribute()

        this.object = new Line2({
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

        this.object.setAttribute('aOpacity', new Float32Array(opacity), 1)

        this.object.get().layers.set(PROCESS)

        this.group.add(this.object.get())
    }
    createAttribute(){
        const {width, height} = this.param
        const position = []
        const opacity = []

        const wh = width / 2
        const hh = height / 2

        L.points.forEach((e, i, a) => {
            const {rx, ry} = e

            const x = width * rx - wh
            const y = height * ry - hh

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
        this.object.setUniform('resolution', new THREE.Vector2(size.el.w, size.el.h))
    }


    // animate
    animate(){
        const opacity = this.object.getAttribute('aOpacity')

        opacity.array[this.idx] = 1

        this.idx = (this.idx + 1) % opacity.array.length

        for(let i = 0; i < opacity.array.length; i++){
            opacity.array[i] -= 0.006
        }

        opacity.needsUpdate = true
    }
}