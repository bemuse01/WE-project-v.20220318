import * as THREE from '../../lib/three.module.js'
import {EffectComposer} from '../../postprocess/EffectComposer.js'
import {FilmPass} from '../../postprocess/FilmPass.js'
import {RenderPass} from '../../postprocess/RenderPass.js'
import {BloomPass} from '../../postprocess/BloomPass.js'
import {UnrealBloomPass} from '../../postprocess/UnrealBloomPass.js'
import {ShaderPass} from '../../postprocess/ShaderPass.js'
import {FXAAShader} from '../../postprocess/FXAAShader.js'

import PublicMethod from '../../method/method.js'
import Data from '../../data/data.js'

import CHILD from './build/text.child.build.js'
import PARTICLE from './build/text.particle.build.js'
  
export default class{
    constructor({app}){
        this.param = {
            fov: 60,
            near: 0.1,
            far: 10000,
            pos: 100,
            bloom: 2.5,
            // strength: 3,
            // radius: 0,
            strength: 6,
            radius: 0.6,
            threshold: 0,
            // text: 'LAPLUS'.split('').map((text, id) => ({id, text}))
            text: 'WHDGODI'.split('').map((text, id) => ({id, text})),
            rd: 0.01
        }

        this.modules = {
            // child: CHILD,
            // particle: PARTICLE,
        }
        this.group = {}
        this.comp = {}
        this.build = new THREE.Group()
        
        this.renderer = app.renderer

        this.init()
    }


    // init
    init(){
        // this.initGroup()
        this.initRenderObject()
        this.initComposer()
        this.create()
    }
    initGroup(){
        for(const module in this.modules){
            this.group[module] = new THREE.Group()
            this.comp[module] = null
        }
    }
    initRenderObject(){
        this.element = document.querySelector('.text-object')

        const {width, height} = this.element.getBoundingClientRect()

        this.scene = new THREE.Scene()

        this.camera = new THREE.PerspectiveCamera(this.param.fov, width / height, this.param.near, this.param.far)
        this.camera.position.z = this.param.pos
        
        this.size = {
            el: {
                w: width,
                h: height
            },
            obj: {
                w: PublicMethod.getVisibleWidth(this.camera, 0),
                h: PublicMethod.getVisibleHeight(this.camera, 0)
            }
        }
    }
    initComposer(){
        const {right, left, bottom, top} = this.element.getBoundingClientRect()
        const width = right - left
        const height = bottom - top

        const renderTarget = new THREE.WebGLRenderTarget(width, height, {format: THREE.RGBAFormat})
        renderTarget.samples = 2048
        
        this.composer = new EffectComposer(this.renderer, renderTarget)
        this.composer.setSize(width, height)

        const renderPass = new RenderPass(this.scene, this.camera)

        const filmPass = new FilmPass(0, 0, 0, false)

        const bloomPass = new BloomPass(this.param.bloom)

        const unrealBoomPass = new UnrealBloomPass(new THREE.Vector2(this.size.el.w, this.size.el.h),
            this.param.strength,
            this.param.radius,
            this.param.threshold
        )

        this.composer.addPass(renderPass)
        this.composer.addPass(unrealBoomPass)
        // this.composer.addPass(bloomPass)
        // this.composer.addPass(filmPass)
        // this.composer.addPass(this.fxaa)
    }


    // create
    create(){
        this.createInstance()

        for(const group in this.group) this.build.add(this.group[group])
        
        const fwh = this.param.text.map(e => Data[e.text].w * this.param.rd).reduce((pre, cur) => pre + cur) / 2
        this.build.position.x = -fwh

        this.scene.add(this.build)
    }
    createInstance(){
        this.param.text.forEach(e => {
            const {id, text} = e
            
            const particleName = text + id + 'Particle'
            const childName = text + id + 'Child'

            this.group[particleName] = new THREE.Group()
            this.group[childName] = new THREE.Group()

            const data = Data[text]

            this.comp[particleName] = new PARTICLE({
                group: this.group[particleName],
                size: this.size,
                param: {
                    w: this.param.rd,
                    h: this.param.rd,
                    color: 0x936cc6,
                    pointSize: 2,
                    opacity: 0.4,
                    div: 1,
                    rd: 0.5
                },
                data
            })
            this.comp[childName] = new CHILD({
                group: this.group[childName],
                size: this.size,
                param: {
                    color: 0x936cc6,
                    linewidth: 2,
                    w: this.param.rd,
                    h: this.param.rd,
                },
                data
            })

            const previousWidth = id === 0 ? 0 : this.param.text.slice(0, id).map(e => Data[e.text].w * this.param.rd).reduce((pre, cur) => pre + cur)
            const width = data.w * this.param.rd
            const wh = width / 2
            const x = previousWidth + wh

            this.group[childName].position.x = x
            this.group[particleName].position.x = x
        })
    }


    // set
    setGroupTransform(){

    }


    // animate
    animate(){
        this.render()
        this.animateObject()
    }
    render(app){
        const rect = this.element.getBoundingClientRect()
        const width = rect.right - rect.left
        const height = rect.bottom - rect.top
        const left = rect.left
        const bottom = this.renderer.domElement.clientHeight - rect.bottom

        this.renderer.setScissor(left, bottom, width, height)
        this.renderer.setViewport(left, bottom, width, height)

        // this.camera.lookAt(this.scene.position)
        // app.renderer.render(this.scene, this.camera)

        this.renderer.autoClear = false
        this.renderer.clear()

        this.camera.layers.set(PROCESS)
        this.composer.render()

        this.renderer.clearDepth()
        this.camera.layers.set(NORMAL)
        this.renderer.render(this.scene, this.camera)
    }
    animateObject(){
        for(const comp in this.comp){
            if(!this.comp[comp] || !this.comp[comp].animate) continue
            this.comp[comp].animate({renderer: this.renderer})
        }
    }


    // resize
    resize(){
        const rect = this.element.getBoundingClientRect()
        const width = rect.right - rect.left
        const height = rect.bottom - rect.top

        this.camera.aspect = width / height
        this.camera.updateProjectionMatrix()

        this.composer.setSize(width, height)

        this.size = {
            el: {
                w: width,
                h: height
            },
            obj: {
                w: PublicMethod.getVisibleWidth(this.camera, 0),
                h: PublicMethod.getVisibleHeight(this.camera, 0)
            }
        }

        this.resizeObject()
    }
    resizeObject(){
        for(const comp in this.comp){
            if(!this.comp[comp] || !this.comp[comp].resize) continue
            this.comp[comp].resize(this.size)
        }
    }
}