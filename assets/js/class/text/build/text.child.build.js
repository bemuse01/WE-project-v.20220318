import Line from '../../objects/line.js'
import Line2 from '../../objects/line2.js'
import L from '../../../data/L.js'
import Shader from '../shader/text.child.shader.js' 
import * as THREE from '../../../lib/three.module.js'

export default class{
    constructor({group, size}){
        this.size = size
        this.group = group

        this.param = {
            width: 2160 * 0.02,
            height: 3840 * 0.02,
            color: 0xffffff,
            linewidth: 3.5
        }

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

        this.group.add(this.object.get())

        // console.log(this.object.get().geometry)
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


    // tween
    createTween(){
        const opacity = this.object.getAttribute('aOpacity')
        const array  = opacity.array

        const start = {idx: 0}
        const end = {idx: array.length}

        const tw = new TWEEN.Tween(start)
        .to(end, 3500)
        .onUpdate(() => this.onUpdateTween(array, opacity, start))
        .repeat(Infinity)
        .start()
    }
    onUpdateTween(array, opacity, {idx}){
        array[Math.floor(idx)] = 1
        opacity.needsUpdate = true
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
            opacity.array[i] -= 0.0075
        }

        opacity.needsUpdate = true
    }
}