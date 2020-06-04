function getCurrencies (price) {
    return new Intl.NumberFormat('ua-UA', {
        currency: 'UAH',
        style: 'currency'
    }).format(price)
}

const allPrices = document.querySelectorAll('.price')

allPrices.forEach(node => {
    node.textContent = getCurrencies(node.textContent)
})

const $card = document.getElementById('card')

if($card) {
    $card.addEventListener('click',event => {
        if(event.target.classList.contains("js-remove")){
            const id = event.target.dataset.id

            fetch(`/card/remove/${id}`, {
                method: 'delete'
            })
                .then(res => res.json())
                .then(card => {
                    if(card.courses.length){
                        const html = card.courses.map(c =>
                            `<tr>
                                <th>${c.title}</th>
                                <th>${c.count}</th>
                                <th>
                                    <button class="btn btn-small js-remove" data-id="${c.id}">Delete</button>
                                </th>
                            </tr>`
                        ).join('')



                        $card.querySelector('tbody').innerHTML = html
                        $card.querySelector('.price').textContent = getCurrencies(card.price)

                    } else {
                        $card.innerHTML = "<h3>Card is empty</h3>"
                    }
                })
        }
    })
}