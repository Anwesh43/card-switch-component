const w = window.innerWidth,h = window.innerHeight
class CardSwitchComponent extends HTMLElement {
    constructor() {
        super()
        const messages = this.getAttribute('messages').split(',')
        const shadow = this.attachShadow({mode:'open'})
        const animatioHandler = new SwitchAnimationHandler()
        this.cards = messages.map((message)=>new Card(message,animatioHandler))
        this.cards.forEach((card)=>{
            card.addToShadow(shadow)
        })
    }
    render() {
        this.cards.forEach((card)=>{
            card.render()
        })
    }
    connectedCallback() {
        this.render()
    }
}
class Card {
    constructor(message,animatioHandler) {
        this.img = document.createElement('img')
        this.img.style.float = 'top'
        this.img.style.border = '2px dotted white'
        this.img.style.borderRadius = '20%'
        this.message = message
        this.scale = 0
        this.dir = 0
        this.img.onmousedown = (event)=>{
            if(this.scale == 0 && this.dir == 0) {
                this.dir = 1
                animatioHandler.setCurrCard(this)
            }
        }
    }
    addToShadow(shadow) {
        shadow.appendChild(this.img)
    }
    render() {
        const canvas = document.createElement('canvas')
        const dw = window.innerWidth,dh = window.innerHeight
        canvas.width = Math.max(dw,dh)/7
        canvas.height = Math.max(dw,dh)/7
        const w = canvas.width
        const context = canvas.getContext('2d')
        context.fillStyle = '#311B92'
        context.fillRect(0,0,w,w)
        context.fillStyle = '#FF5722'
        context.save()
        context.translate(w/2,w/2)
        context.scale(this.scale,this.scale)
        context.fillRect(-w/2,-w/2,w,w)
        context.restore()
        context.fillStyle = 'white'
        context.font = context.font.replace(/\d{2}/,`${w/5}`)
        if(!this.parts) {
            this.parts = []
            const textParts = this.message.split(" ")
            var x = w/2,y = w/2 - (w/10)*textParts.length/2
            textParts.forEach((textPart)=>{
                this.parts.push(new TextMessage(textPart,x-context.measureText(textPart).width/2,y))
                y += w/10
            })
        }
        console.log(this.parts)
        this.parts.forEach((part)=>{
            part.draw(context)
        })
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
                this.scale = 1
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
            //console.log("setting prevcard")
            this.prevCard = this.currCard
            this.prevCard.setDir(-1)
        }
        this.currCard = card
        const interval = setInterval(()=>{
            this.currCard.render()
            this.currCard.update()
            if(this.prevCard) {
                this.prevCard.render()
                this.prevCard.update()
                //console.log(this.prevCard)
            }
            if(this.currCard.stopped() == true) {
                //console.log("stopped")
                clearInterval(interval)
            }

        },50)
    }
}
class TextMessage {
    constructor(text,x,y) {
        this.x = x
        this.text = text
        this.y = y
    }
    draw(context) {
        //console.log(this.text)
        context.fillText(this.text,this.x,this.y)
    }
}
customElements.define('card-switch',CardSwitchComponent)
