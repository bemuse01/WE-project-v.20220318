import Line from '../../objects/line.js'
import L from '../../../data/L.js'
import Shader from '../shader/text.child.shader.js' 
import * as THREE from '../../../lib/three.module.js'

export default class{
    constructor({group}){
        this.group = group

        this.param = {
            width: 2160 * 0.02,
            height: 3840 * 0.02,
            color: 0xffffff,
            size: 1
        }

        this.init()
    }


    // init
    init(){
        this.create()
        this.createTween()
    }


    // create
    create(){
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
    createAttribute(){
        const {width, height} = this.param
        const position = []
        const opacity = []

        const wh = width / 2
        const hh = height / 2

        L.points.forEach((e, i, a) => {
            const {rx, ry, num} = e

            const x = width * rx - wh
            const y = height * ry - hh

            position.push(x, -y, 0)
            opacity.push(0)
        })

        position.push(position[0], position[1], position[2])
        opacity.push(0)

        return {position, opacity}
    }


    // tween
    createTween(){
        const start = {idx: 0}
        const end = {idx: L.points.length + 1}

        const tw = new TWEEN.Tween(start)
        .to(end, 3000)
        .onUpdate(() => this.onUpdateTween(start))
        .repeat(Infinity)
        .start()
    }
    onUpdateTween({idx}){
        const opacity = this.object.getAttribute('aOpacity')
        opacity.array[Math.floor(idx)] = 1
        opacity.needsUpdate = true
    }


    // animate
    animate(){
        const opacity = this.object.getAttribute('aOpacity')

        for(let i = 0; i < opacity.array.length; i++){
            opacity.array[i] -= 0.01
        }

        opacity.needsUpdate = true
    }
}