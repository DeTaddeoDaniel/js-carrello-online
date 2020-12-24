// leer todo html e depues lo eseguta
document.addEventListener('DOMContentLoad' , getData())

// componentes of html
const fragment = document.createDocumentFragment()
const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')

// template
const templateCard = document.getElementById('template-card').content
const templateCarrito = document.getElementById('template-carrito').content
const templateFooter = document.getElementById('template-footer').content

cards.addEventListener('click', e => { addCart(e) })
items.addEventListener('click', e => {btnAccion(e)})

// carrito
let carrito = {}

// ottener elementos of api con fetch
async function getData(){
    
    try{

        console.log('getData function')
        const res = await fetch('api.json')
        const data = await res.json()
        console.log(data)
        pintarCard(data);

    } catch (e){
        console.log(e)
    }
    
}

//pintar card
function pintarCard(data) {
    console.log('pintar card')
    
    data.forEach(product => {
        
        templateCard.querySelector('h5').textContent = product.title
        templateCard.querySelector('p').textContent = product.precio + ' €'
        templateCard.querySelector('img').setAttribute('src', product.thumbnailUrl)
        templateCard.querySelector('button').dataset.id = product.id

        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    });

    cards.appendChild(fragment)
}

// add product to kart
function addCart(e) {
    
    if(e.target.classList.contains('btn')){
        console.log('addCart con id: ' + e.target.dataset.id)
        setCarrito(e.target.parentElement)
    }

    e.stopPropagation()
}

// set carrito
function setCarrito(item) {
    
    console.log('set carrito')
    console.log('item')

    const producto = {
        title: item.querySelector('h5').textContent,
        precio: parseInt(item.querySelector('p').textContent),
        id: item.querySelector('button').dataset.id,
        cantidad: 1
    }

    // Il metodo hasOwnProperty() restituisce un valore booleano 
    // che indica se l'oggetto ha la proprietà specificata come 
    // propria proprietà (invece di ereditarla)    

    if(carrito.hasOwnProperty(producto.id)){
        // Incrementando cuantidad
        producto.cantidad = carrito[producto.id].cantidad + 1
        // console.log(producto.title +' a sido incrementada a ' + producto.cantidad)
    }

    // Spread syntax
    carrito[producto.id] = {...producto}

    // console.log(carrito)

    // pintar carrito
    pintarCarrito()

}

// pintar carrito
function pintarCarrito() {

    Object.values(carrito).forEach(item => {
       
        items.innerHTML = ''

        templateCarrito.querySelector('th').textContent = item.id
        templateCarrito.querySelectorAll('td')[0].textContent = item.title
        templateCarrito.querySelectorAll('td')[1].textContent = item.cantidad
        templateCarrito.querySelector('.btn-info').dataset = item.id
        templateCarrito.querySelector('.btn-danger').dataset = item.id
        templateCarrito.querySelector('span').textContent = item.cantidad * item.precio

        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })

    items.appendChild(fragment)
    pintarFooter()
}

// pintar footer
function pintarFooter() {

    footer.innerHTML = ''

    if(Object.keys(carrito).length == 0){
        footer.innerHTML = '<h5>Carrito vacio</h5>'
        pintarCarrito()
        
    } else{
        const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad,0)
        const nPrecio = Object.values(carrito).reduce((total, {cantidad,precio}) => total + cantidad * precio,0)

        console.log(nCantidad)
        console.log(nPrecio)

        templateFooter.querySelectorAll('td')[0].textContent = nCantidad
        templateFooter.querySelector('span').textContent = nPrecio

        const clone = templateFooter.cloneNode(true)
        fragment.appendChild(clone)
        footer.appendChild(fragment)

        const btnVaciar = document.getElementById('vaciar-carrito')
        btnVaciar.addEventListener('click', () => {
            carrito = {}
        })
    }

}

// actionListerner of button of carrito item
function btnAccion(e) {


    if(e.target.classList.contains('btn')){
        console.log(e.target.textContent)
        
    }

    e.stopPropagation()
    
}