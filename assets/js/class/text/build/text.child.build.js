import Line from '../../objects/line.js'
import Line2 from '../../objects/line2.js'
import Line3 from '../../objects/line3.js'
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
            linewidth: 0.003
        }

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
        // this.createLine2()
        this.createLine3()
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
                color: new THREE.Color(this.param.color),
                linewidth: this.param.linewidth,
            }
        })

        this.group.add(this.object.get())

        // console.log(this.object.get().geometry)
    }
    createLine3(){
        const {position, opacity} = this.createAttribute3()
        
        this.object = new Line3({
            position,
            materialOpt: {
                color: new THREE.Color(this.param.color),
                lineWidth: 0.6,
                resolution: new THREE.Vector2(this.size.el.w, this.size.el.h),
                sizeAttenuation: true
            }
        })

        const {count} = this.object.getAttribute('position')

        this.object.setAttribute('aOpacity', new Float32Array(Array.from({length: count}, _ => 0)), 1)

        console.log(this.object.get().geometry)

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

        // position.push(position[0], position[1], position[2])
        // opacity.push(0)

        return {position, opacity}
    }
    createAttribute3(){
        const {width, height} = this.param
        const position = []
        const opacity = []

        const wh = width / 2
        const hh = height / 2

        L.points.forEach((e, i, a) => {
            const {rx, ry} = e

            const x = width * rx - wh
            const y = height * ry - hh

            position.push(new THREE.Vector3(x, -y, 0))
            // opacity.push(0)
        })

        position.push(position[0], position[1], position[2])
        // opacity.push(0)

        return {position, opacity}
    }


    // tween
    createTween(){
        const start = {idx: 0}
        const end = {idx: L.points.length}

        const tw = new TWEEN.Tween(start)
        .to(end, L.points.length * 2 * 10)
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
    // animate(){
    //     const opacity = this.object.getAttribute('aOpacity')

    //     for(let i = 0; i < opacity.array.length; i++){
    //         opacity.array[i] -= 0.005
    //     }

    //     opacity.needsUpdate = true
    // }
}