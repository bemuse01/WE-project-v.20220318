import L from '../../../data/L.js'
import Line from '../../objects/line.js'
import Shader from '../shader/text.child.shader.js'
import * as THREE from '../../../lib/three.module.js'

export default class{
    constructor({engine, scene}){
        this.engine = engine
        this.scene = scene

        this.param = {
            width: 2160 * 0.01,
            height: 3840 * 0.01,
            color: 0xffffff,
            linewidth: 0.3
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
        this.createLine()
    }
    createLine(){
        const {position, opacity} = this.createAttribute()

        this.object = new Line({
            name: 'line1',
            scene: this.scene,
            geometryOpt: {
                path: position,
                width: this.param.linewidth,
                closed: true
            },
            materialOpt: {
                shader: Shader,
                attributes: ['aOpacity']
            }
        })

        this.object.setUniform('setColor3', 'uColor', new THREE.Color(this.param.color))

        this.object.setAttribute(this.engine, 'aOpacity', new Float32Array(opacity), 1)

        console.log(this.object.get().getVerticesData(BABYLON.VertexBuffer.PositionKind))
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

            position.push(new BABYLON.Vector3(x, -y, 0))
            opacity.push(0)
        })

        // position.push(position[0], position[1], position[2])
        // opacity.push(0)

        return {position, opacity}
    }


    // tween
    createTween(){
        const start = {idx: 0}
        const end = {idx: L.points.length + 1}

        const tw = new TWEEN.Tween(start)
        .to(end, 3500)
        .onUpdate(() => this.onUpdateTween(start))
        .repeat(Infinity)
        .start()
    }
    onUpdateTween({idx}){
        const opacity = this.object.getAttribute('aOpacity')
        const array = opacity.getData()
        array[Math.floor(idx)] = 1
        opacity.update(array)
    }


    // animate
    // animate(){
    //     const opacity = this.object.getAttribute('aOpacity')
    //     const array = opacity.getData()

    //     for(let i = 0; i < array.length; i++){
    //         array[i] -= 0.005
    //     }

    //     opacity.update(array)
    // }
}