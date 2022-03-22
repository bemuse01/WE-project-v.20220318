import L from '../../../data/L.js'
import * as THREE from '../../../lib/three.module.js'
import Particle from '../../objects/particle.js'
import Shader from '../shader/text.particle.shader.js'

export default class{
    constructor({group}){
        this.group = group
        
        this.param = {
            width: 2160 * 0.02,
            height: 3840 * 0.02,
            color: 0x936cc6,
            count: 400,
            pointSize: 150,
            opacity: 0.05
        }

        this.len = L.points.length
        this.idx = 0

        this.position = this.createPosition()

        this.init()
    }


    // init
    init(){
        this.create()
    }


    // create
    create(){
        const texture = new THREE.TextureLoader().load('assets/src/particle1.png')

        this.object = new Particle({
            count: this.param.count,
            positionVelocity: {
                min: 0.1,
                max: 0.2,
            },
            lifeVelocity: {
                min: 0.006,
                max: 0.012
            },
            materialOpt: {
                vertexShader: Shader.vertex,
                fragmentShader: Shader.fragment,
                transparent: true,
                blending: THREE.AdditiveBlending,
                uniforms: {
                    uTexture: {value: texture},
                    uColor: {value: new THREE.Color(this.param.color)},
                    uPointSize: {value: this.param.pointSize},
                    uOpacity: {value: this.param.opacity}
                }
            }
        })

        this.object.setAttribute('aOpacity', new Float32Array(Array.from({length: this.param.count}, _ => Math.random())), 1)
        this.object.setAttribute('aPointSize', new Float32Array(Array.from({length: this.param.count}, _ => Math.random() * this.param.pointSize)), 1)
        // this.object.delay = Array.from({length: this.param.count}, _ => Math.random() * 2000)
        
        this.object.get().layers.set(PROCESS)

        this.group.add(this.object.get())
    }
    createPosition(){
        const {width, height} = this.param
        const position = []

        const wh = width / 2
        const hh = height / 2

        L.points.forEach((e, i, a) => {
            const {rx, ry} = e

            const x = width * rx - wh
            const y = height * ry - hh

            position.push(new THREE.Vector3(x, -y, 0))
        })

        return position
    }


    // animate
    animate(){
        // const time = window.performance.now()
        const position = this.object.getAttribute('position')
        const opacity = this.object.getAttribute('aOpacity')
        const lifeVelocity = this.object.lifeVelocity
        const positionVelocity = this.object.positionVelocity
        // const delay = this.object.delay

        const currentPosition = this.position[this.idx]
        this.idx = (this.idx + 1) % this.position.length

        for(let i = 0; i < this.param.count; i++){
            const idx = i * 3

            position.array[idx + 1] -= positionVelocity[i]
            
            // if(delay[i] > time) opacity.array[i] -= lifeVelocity[i]
            opacity.array[i] -= lifeVelocity[i]

            if(opacity.array[i] < 0){
                opacity.array[i] = 1
                // position.array[idx + 0] = currentPosition.x
                // position.array[idx + 1] = currentPosition.y
                position.array[idx + 0] = THREE.Math.randFloat(currentPosition.x * 0.75, currentPosition.x * 1.25)
                position.array[idx + 1] = THREE.Math.randFloat(currentPosition.y * 0.75, currentPosition.y * 1.25)
            }
        }

        position.needsUpdate = true
        opacity.needsUpdate = true
    }
}