const w = window.innerWidth,h = window.innerHeight
class CardSwitchComponent extends HTMLElement {
    constructor() {
        super()
        const messages = this.getAttribute('messages')
        const shadow = this.attachShadow({mode:'open'})
    }
    render() {

    }
    connectedCallback() {
        this.render()
    }
}
class Card {
    constructor(message) {
        this.img = document.createElement('img')
        this.message = message
        this.scale = 0
        this.dir = 0
        this.img.onmousedown = (event)=>{
            if(this.scale == 0 && this.dir == 0) {
                this.dir = 1

            }
        }
    }
    addToShadow(shadow) {
        shadow.appendChild(this.img)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = Math.max(w,h)/10
        canvas.height = Math.max(w,h)/10
        const w = canvas.width
        const context = canvas.getContext('2d')
        context.fillStyle = '#2196F3'
        context.fillRect(0,0,w,w)
        context.save()
        context.translate(w/2,w/2)
        context.scale(this.scale,this.scale)
        context.fillRect(-w/2,-w/2,w,w)
        context.restore()
        this.img.src = canvas.toDataURL()
    }
    setDir(dir) {
        this.dir = dir
    }
    stopped() {
        return this.dir == 0
    }
    update() {
        this.scale += this.dir * 0.2
        if(this.scale > 1 || this.scale < 0) {
            this.dir = 0
            if(this.scale > 1) {
                this.scale = 0
            }
            if(this.scale < 0) {
                this.scale = 0
            }
        }
    }
}
class SwitchAnimationHandler {
    setCurrCard(card) {
        if(this.currCard) {
            this.prevCard = this.currCard
            this.prevCard.setDir(-1)
        }
        this.currCard = card
        const interval = setInterval(()=>{
            this.currCard.render()
            this.currCard.update()
            if(this.prevCard) {
                this.prevCard.render()
                this.currCard.update()
            }
            if(this.currCard.stopped()) {
                clearInterval(interval)
            }

        },100)
    }
}
