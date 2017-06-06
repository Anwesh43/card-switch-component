const w = window.innerWidth,h = window.innerHeight
class CardSwitchComponent extends HTMLElement {
    constructor() {
        super()
        this.text = this.getAttribute('text')
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
        shadow.appendChild(this.img)
    }
    render() {
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
    }
}
class Card {
    constructor() {

    }
}
