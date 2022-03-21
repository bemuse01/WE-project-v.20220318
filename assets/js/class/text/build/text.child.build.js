import Line from '../../objects/line.js'
import L from '../../../data/L.js'

export default class{
    constructor({group}){
        this.group = group

        this.param = {
            width: 270 * 0.1,
            height: 612 * 0.1,
            color: 0xffffff,
            size: 1
        }

        this.init()
    }


    // init
    init(){
        this.create()
    }


    // create
    create(){
        const {position} = this.createAttribute()

        this.object = new Line({
            materialOpt: {
                color: this.param.color
            }
        })

        this.object.setAttribute('position', new Float32Array(position), 3)

        this.group.add(this.object.get())
    }
    createAttribute(){
        const {width, height} = this.param
        const position = []

        const wh = width / 2
        const hh = height / 2

        L.points.forEach((e, i, a) => {
            const {rx, ry, num} = e

            const x = width * rx - wh
            const y = height * ry - hh

            if(i !== a.length - 1) position.push(x, -y, 0)
            else position.push(position[0], position[1], position[2])
        })

        return {position}
    }
}