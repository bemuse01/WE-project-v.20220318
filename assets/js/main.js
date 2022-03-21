import App from './class/app/app.js'
import Text from '../js/class/text/text.js'

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
                Text: Text
            }
        }
    },
    mounted(){
        this.init()
    },
    methods: {
        init(){
            this.initThree()
            this.animate()

            window.addEventListener('resize', this.onWindowResize, false)
        },


        // three
        initThree(){
            for(const module in this.modules){
                const instance = this.modules[module]
                
                OBJECT[module] = new instance(OBJECT)
            }
        },
        resizeThree(){
            for(let i in OBJECT){
                if(!OBJECT[i].resize) continue
                OBJECT[i].resize(OBJECT)
            }
        },
        renderThree(){
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


        // event
        onWindowResize(){
            this.resizeThree()
        },


        // render
        render(){
            this.animateElement()
            this.renderThree()
            TWEEN.update()
        },
        animate(){
            this.render()
            requestAnimationFrame(this.animate)
        }
    }
})