import * as THREE from '../../lib/three.module.js'
import {EffectComposer} from '../../postprocess/EffectComposer.js'
import {FilmPass} from '../../postprocess/FilmPass.js'
import {RenderPass} from '../../postprocess/RenderPass.js'
import {BloomPass} from '../../postprocess/BloomPass.js'
import {UnrealBloomPass} from '../../postprocess/UnrealBloomPass.js'
import {ShaderPass} from '../../postprocess/ShaderPass.js'
import {FXAAShader} from '../../postprocess/FXAAShader.js'

import PublicMethod from '../../method/method.js'

import CHILD from './build/text.child.build.js'
  
export default class{
    constructor({app}){
        this.param = {
            fov: 60,
            near: 0.1,
            far: 10000,
            pos: 100,
            bloom: 2.5,
            strength: 6,
            radius: 0.75,
            threshold: 0
        }

        this.modules = {
            child: CHILD,
        }
        this.group = {}
        this.comp = {}
        this.build = new THREE.Group()

        this.init(app)
    }


    // init
    init(app){
        this.initGroup()
        this.initRenderObject()
        this.initComposer(app)
        this.create(app)
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
    initComposer(app){
        const {right, left, bottom, top} = this.element.getBoundingClientRect()
        const width = right - left
        const height = bottom - top
        
        this.composer = new EffectComposer(app.renderer)
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
    create({renderer}){
        for(const module in this.modules){
            const instance = this.modules[module]
            const group = this.group[module]

            this.comp[module] = new instance({group, size: this.size, ...this.comp})
        }

        for(const group in this.group) this.build.add(this.group[group])
        
        this.scene.add(this.build)
    }


    // animate
    animate({app, audio}){
        this.render(app)
        this.animateObject(app, audio)
    }
    render(app){
        const rect = this.element.getBoundingClientRect()
        const width = rect.right - rect.left
        const height = rect.bottom - rect.top
        const left = rect.left
        const bottom = app.renderer.domElement.clientHeight - rect.bottom

        app.renderer.setScissor(left, bottom, width, height)
        app.renderer.setViewport(left, bottom, width, height)

        // this.camera.lookAt(this.scene.position)
        // app.renderer.render(this.scene, this.camera)

        app.renderer.autoClear = false
        app.renderer.clear()

        this.camera.layers.set(PROCESS)
        this.composer.render()

        app.renderer.clearDepth()
        this.camera.layers.set(NORMAL)
        app.renderer.render(this.scene, this.camera)
    }
    animateObject(app){
        const {renderer} = app

        for(let i in this.comp){
            if(!this.comp[i] || !this.comp[i].animate) continue
            this.comp[i].animate({renderer})
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
        for(let i in this.comp){
            if(!this.comp[i] || !this.comp[i].resize) continue
            this.comp[i].resize(this.size)
        }
    }
}