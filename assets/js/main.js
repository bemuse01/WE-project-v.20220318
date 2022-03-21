import App from './class/app/app.js'
import Text from './class/text/text.js'

import TextComp from './components/text/text.js'

new Vue({
    el: '#app',
    components: {
        'text-comp': TextComp
    },
    data(){
        return{
            modules: {
                app: App,
                text: Text,
            },
            element: {
            }
        }
    },
    mounted(){
        this.init()
    },
    methods: {
        init(){
            this.initBabylon()
            this.animate()

            window.addEventListener('resize', this.onWindowResize, false)
        },


        // babylon
        initBabylon(){
            for(const module in this.modules){
                const instance = this.modules[module]
                
                OBJECT[module] = new instance(OBJECT)
            }
        },
        resizeBabylon(){
            for(let i in OBJECT){
                if(!OBJECT[i].resize) continue
                OBJECT[i].resize(OBJECT)
            }
        },
        renderBabylon(){
            for(let i in OBJECT){
                if(!OBJECT[i].animate) continue
                OBJECT[i].animate(OBJECT)
            }
        },


        // element
        animateElement(){
            for(let i in this.element){
                if(!this.element[i].animate) continue
                this.element[i].animate(OBJECT)
            }
        },
        onClickProgress(e){
            const {audio} = OBJECT
            this.element.progress.group.hover.onClick(e, audio)
        },


        // event
        onWindowResize(){
            this.resizeBabylon()
        },


        // render
        render(){
            TWEEN.update()
            this.renderBabylon()
            this.animateElement()
        },
        animate(){
            this.render()
            requestAnimationFrame(this.animate)
        }
    }
})