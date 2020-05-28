const allPrices = document.querySelectorAll('.price')

allPrices.forEach(node => {
    node.textContent = new Intl.NumberFormat('ua-UA', {
        currency: 'UAH',
        style: 'currency'
    }).format(node.textContent)
})