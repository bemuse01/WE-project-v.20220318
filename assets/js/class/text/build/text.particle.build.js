import L from '../../../data/L.js'
import * as THREE from '../../../lib/three.module.js'
import Particle from '../../objects/particle.js'
import Shader from '../shader/text.particle.shader.js'

import PublicMethod from '../../../method/method.js'

export default class{
    constructor({group, param, data}){
        this.group = group
        this.param = param
        this.data = data
        
        // this.param = {
        //     width: 2250 * 0.015,
        //     height: 3000 * 0.015,
        //     color: 0x936cc6,
        //     count: 10000,
        //     pointSize: 2,
        //     opacity: 0.4,
        //     div: 1,
        //     rd: 0.5
        // }

        const {w, h} = this.data
        this.width = w * this.param.w
        this.height = h * this.param.h

        this.len = this.data.shapes.length
        this.object = []
        this.position = []
        this.idx = Array.from({length: this.len}, _ => 0)
        this.count = Array.from(this.data.shapes, e => THREE.Math.clamp(e['points'].length * 30, 2500, 2500))

        this.init()
    }


    // init
    init(){
        for(let i = 0; i < this.len; i++){
            this.create(i)
        }
    }


    // create
    create(idx){
        const count = this.count[idx]

        this.position[idx] = this.createPosition(idx)

        this.object[idx] = new Particle({
            count: count,
            materialOpt: {
                vertexShader: Shader.vertex,
                fragmentShader: Shader.fragment,
                transparent: true,
                blending: THREE.AdditiveBlending,
                uniforms: {
                    uColor: {value: new THREE.Color(this.param.color)},
                    uPointSize: {value: this.param.pointSize},
                    uOpacity: {value: this.param.opacity}
                }
            }
        })

        this.object[idx].setAttribute('aOpacity', new Float32Array(Array.from({length: count}, _ => Math.random())), 1)
        this.object[idx].setAttribute('aPointSize', new Float32Array(Array.from({length: count}, _ => THREE.Math.randFloat(1, 2))), 1)
        
        this.object[idx].get().layers.set(PROCESS)

        this.group.add(this.object[idx].get())
    }
    createPosition(idx){
        const position = []

        const wh = this.width / 2
        const hh = this.height / 2

        this.data.shapes[idx]['points'].forEach((e, i, a) => {
            const {rx, ry} = e

            const x = this.width * rx - wh
            const y = this.height * ry - hh

            position.push(new THREE.Vector3(x, -y, 0))
        })

        return position
    }


    // animate
    animate(){
        const time = window.performance.now()
    
        for(let i = 0; i < this.len; i++){
            const count = this.count[i]
            const position = this.object[i].getAttribute('position')
            const opacity = this.object[i].getAttribute('aOpacity')
            const idx = this.idx[i]
            const pos = this.position[i]

            this.idx[i] = (idx + 1) % pos.length
            const currentPosition = pos[idx]

            const div = count * this.param.div

            for(let j = 0; j < count; j++){
                const index = j * 3

                const n1 = SIMPLEX.noise2D(j % div * 0.001, time * 0.0005)
                const n2 = SIMPLEX.noise2D(j % div * 0.002, time * 0.0005)
                const n4 = SIMPLEX.noise2D(j * 0.003, time * 0.005)

                const nx = n1 * 0.25
                // const ny = n2 * 0.5
                const ny = PublicMethod.normalize(n2, -0.2, 0, -1, 1)
                const no = PublicMethod.normalize(n4, 0, 0.05, -1, 1)

                position.array[index + 0] += nx
                position.array[index + 1] += ny
                
                opacity.array[j] -= no

                if(opacity.array[j] < 0){
                    opacity.array[j] = 1
                    const npos = Math.random() > 0.125 ? currentPosition : pos[~~(Math.random() * pos.length)]
                    const dist = Math.random() * 0.5
                    const theta = Math.random() * 360
                    position.array[index + 0] = npos.x + Math.cos(theta * RADIAN) * dist
                    position.array[index + 1] = npos.y + Math.sin(theta * RADIAN) * dist
                }
            }

            position.needsUpdate = true
            opacity.needsUpdate = true
        }
    }
}