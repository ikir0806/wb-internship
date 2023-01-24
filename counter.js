let items = [
    {
        id: 0,
        price: 522,
        totalPrice: 522,
        pastPrice: 1022,
        pastTotalPrice: 1022,
        amount: 1,
        totalAmount: 3,
        img: 'item-1',
    },
    {
        id: 1,
        price: 10500.24,
        totalPrice: 2100047,
        pastPrice: 11500.24,
        pastTotalPrice: 2300047,
        amount: 200,
        totalAmount: 250,
        img: 'item-2',
    },
    {
        id: 2,
        price: 247,
        totalPrice: 494,
        pastPrice: 475,
        pastTotalPrice: 950,
        amount: 2,
        totalAmount: 4,
        img: 'item-3',
    },
]

function round(num) {
    return +num.toFixed(2)
}

const deliveryDiv = document.querySelector('.delivery__date-answer')
let deliveryRow = null
let itemsPerRow = null

const itemListEl = document.querySelector('.main__list')
let missingAmount = 3
let mainAmount = 0
let mainPrice = 0
let summaryPrice = 0
let summaryPastPrice = 0
let cartAmount = items.length
let cartAmountText = document.querySelector('.header__cart')
    .querySelector('span')
cartAmountText.textContent = `${cartAmount}`
let summaryAmountText = document.querySelector('.summary__goods-title')
summaryAmountText.textContent =
    `${cartAmount} ${amountEnding(cartAmount)}`
let missingAmountText = document
    .querySelector('.main__missing-amount')
missingAmountText.textContent =
    `${missingAmount} ${amountEnding(missingAmount)}`

items.forEach((item) => {
    mainAmount += item.amount
    summaryPrice += item.totalPrice
    summaryPastPrice += item.pastTotalPrice

    let element = document
        .querySelector('.cart[data-id="' + item.id + '"]')
    element.querySelector('.cart__amount-num')
        .textContent = item.amount
    element.querySelector('.cart__price-current')
        .textContent = `${(item.totalPrice)
            .toLocaleString('ru-RU')} сом`
    element.querySelector('.cart__price-past')
        .textContent = `${(item.pastTotalPrice)
            .toLocaleString('ru-RU')} сом`

    let amountLeft = item.totalAmount - item.amount
    if (amountLeft < 3) element
        .querySelector('.cart__amount-availability')
        .textContent = `Осталось ${amountLeft} шт.`

    itemsPerRow = item.amount
    if (item.amount > 184 &&
        !document
            .querySelector('.delivery__date')
            .classList.contains('delivery__date-additional')) {
        addDeliveryDate(item.id, item.amount - 184, item.img)
        itemsPerRow = 184
    }

    deliveryRow = `
    <div>
        <img data-id="${item.id}" class="delivery__img" src="./images/${item.img}.jpg" width="40" height="56"
        alt="${item.img}">
        <span>${itemsPerRow}</span>
    </div>
    `
    document.querySelector('.delivery__date-answer')
        .insertAdjacentHTML('beforeend', deliveryRow);
})

mainPrice = summaryPrice
let mainPriceText = document.querySelector('.main__closed-price')
mainPriceText.textContent = `${(mainPrice)
    .toLocaleString('ru-RU')} сом`
let mainAmountText = document.querySelector('.main__closed-amount')
mainAmountText.textContent = `${(mainAmount)
    .toLocaleString('ru-RU')} ${amountEnding(mainAmount)}`
let summaryPriceText = document
    .querySelector('.summary__result')
summaryPriceText.textContent = `${(summaryPrice)
    .toLocaleString('ru-RU')} сом`
let summaryPastPriceText = document
    .querySelector('.summary__goods-result')
summaryPastPriceText.textContent = `${(summaryPastPrice)
    .toLocaleString('ru-RU')} сом`
let summaryCost = document
    .querySelector('.summary__sale-result')
updateCost()


itemListEl.addEventListener('click', e => {
    if (!e.target.classList.contains('cart__amount-minus')
        && !e.target.classList.contains('cart__amount-plus'))
        return

    const closestItem = e.target.closest('.cart')
    const id = +closestItem.dataset.id
    const price = items[id].price
    const pastPrice = items[id].pastPrice

    let newPriceEl = document
        .querySelector('.cart[data-id="' + id + '"]')
        .querySelector('.cart__price-current')
    let newAmountEl = e.target.closest('div')
        .querySelector('.cart__amount-num')
    let newPastPriceEl = document
        .querySelector('.cart[data-id="' + id + '"]')
        .querySelector('.cart__price-past')

    e.target.classList.contains('cart__amount-minus')
        ? itemMinus(id, price, newPriceEl, newAmountEl)
        : itemPlus(id, price, newPriceEl, newAmountEl)

    e.target.classList.contains('cart__amount-minus')
        ? itemPastMinus(id, pastPrice, newPastPriceEl)
        : itemPastPlus(id, pastPrice, newPastPriceEl)
})

function itemPastPlus(id, pastPrice, newPastPriceEl) {
    if (document
        .querySelector('.cart[data-id="' + id + '"]')
        .querySelector('.cart__amount-button-plus')
        .disabled) return

    newPastPriceEl.textContent =
        `${(round(items[id].pastTotalPrice + pastPrice))
            .toLocaleString('ru-RU')} сом`
    items[id].pastTotalPrice = round(items[id]
        .pastTotalPrice + pastPrice)
    increaseSummaryPastPrice(pastPrice)
    updateCost()
}

function itemPastMinus(id, pastPrice, newPastPriceEl) {
    if (document
        .querySelector('.cart[data-id="' + id + '"]')
        .querySelector('.cart__amount-button-minus')
        .disabled) return

    newPastPriceEl.textContent =
        `${(round(items[id].pastTotalPrice - pastPrice))
            .toLocaleString('ru-RU')} сом`
    items[id].pastTotalPrice = round(items[id]
        .pastTotalPrice - pastPrice)
    reduceSummaryPastPrice(pastPrice)
    updateCost()
}

function itemPlus(id, price, newPriceEl, newAmountEl) {
    if (items[id].amount == 0) {
        document
            .querySelector('.cart[data-id="' + id + '"]')
            .querySelector('.cart__amount-button-minus')
            .disabled = false
        cartAmount++
        cartAmountUpdate()
    }

    if (items[id].amount == items[id].totalAmount) document
        .querySelector('.cart[data-id="' + id + '"]')
        .querySelector('.cart__amount-button-plus')
        .disabled = true

    if (document
        .querySelector('.cart[data-id="' + id + '"]')
        .querySelector('.cart__amount-button-plus')
        .disabled) return

    if (items[id].totalAmount - items[id].amount < 4) document
        .querySelector('.cart[data-id="' + id + '"]')
        .querySelector('.cart__amount-availability')
        .textContent = `Осталось ${items[id]
            .totalAmount - items[id].amount - 1} шт.`

    newPriceEl.textContent = `${(round(items[id].totalPrice + price))
        .toLocaleString('ru-RU')} сом`
    items[id].totalPrice = round(items[id].totalPrice + price)
    items[id].amount++
    newAmountEl.textContent = `${(items[id].amount)
        .toLocaleString('ru-RU')}`
    increaseSummaryPrice(price)
    increaseAmount(id, 1)
}

function itemMinus(id, price, newPriceEl, newAmountEl) {
    if (document
        .querySelector('.cart[data-id="' + id + '"]')
        .querySelector('.cart__amount-button-minus')
        .disabled) return

    if (items[id].amount == 1) {
        document
            .querySelector('.cart[data-id="' + id + '"]')
            .querySelector('.cart__amount-button-minus')
            .disabled = true
        cartAmount--
        cartAmountUpdate()
    }

    if (document
        .querySelector('.cart[data-id="' + id + '"]')
        .querySelector('.cart__amount-button-plus').disabled)
        document.querySelector('.cart[data-id="' + id + '"]')
            .querySelector('.cart__amount-button-plus').disabled = false

    if (items[id].totalAmount - items[id].amount < 2)
        document
            .querySelector('.cart[data-id="' + id + '"]')
            .querySelector('.cart__amount-availability')
            .textContent = `Осталось ${(items[id]
                .totalAmount - items[id].amount + 1)
                .toLocaleString('ru-RU')} шт.`

    if (items[id].totalAmount - items[id].amount == 2)
        document
            .querySelector('.cart[data-id="' + id + '"]')
            .querySelector('.cart__amount-availability')
            .textContent = ``

    newPriceEl.textContent =
        `${(round(items[id].totalPrice - price))
            .toLocaleString('ru-RU')} сом`
    items[id].totalPrice = round(items[id].totalPrice - price)
    items[id].amount--
    newAmountEl.textContent = `${(items[id].amount)
        .toLocaleString('ru-RU')}`
    reduceSummaryPrice(price)

    reduceAmount(id, 1)
}

function changeVisibility(element) {
    let id = element.closest('li').dataset.id
    if (element.checked) {
        reduceSummaryPrice(items[id].totalPrice)
        reduceSummaryPastPrice(items[id].pastTotalPrice)
        cartAmount--
        cartAmountUpdate()
        reduceAmount(id, items[id].amount)
        buttonsDisabled(element)
    }
    else {
        increaseSummaryPrice(items[id].totalPrice)
        increaseSummaryPastPrice(items[id].pastTotalPrice)
        cartAmount++
        cartAmountUpdate()
        increaseAmount(id, items[id].amount)
        buttonsEnabled(element)
    }
    updateCost()
}

function deleteItem(element) {
    let id = element.closest('li').dataset.id
    if (!element.closest('li').querySelector('.checkbox').checked) {
        reduceSummaryPrice(items[id]?.totalPrice)
        reduceSummaryPastPrice(items[id]?.pastTotalPrice)
        updateCost()
        cartAmount--
        cartAmountUpdate()
        reduceAmount(id, items[id]?.amount)
        mainReduced(id)
    }
    element.closest('li').style.display = 'none'
}

function deleteMissingItem(element) {
    element.closest('li').style.display = 'none'
    missingAmount--
    missingAmountText.textContent =
        `${missingAmount} ${amountEnding(missingAmount)}`

}

function changeCheckboxes(element) {
    let elements = document.querySelectorAll('.cart')

    if (element.checked) {
        summaryPrice = 0
        summaryPriceText.textContent = `${(summaryPrice)
            .toLocaleString('ru-RU')} сом`
        summaryPastPrice = 0
        summaryPastPriceText.textContent = `${(summaryPastPrice)
            .toLocaleString('ru-RU')} сом`
        updateCost()
        cartAmount = 0
        cartAmountUpdate()

        elements.forEach(el => {
            reduceAmount(el.dataset.id, items[el.dataset.id].amount)
            buttonsDisabled(el)
        })
    }
    else {
        elements.forEach((el) => {
            if (el.querySelector('.checkbox-single').checked
                && el.style.display !== 'none') {
                let id = el.dataset.id
                increaseSummaryPrice(items[id].totalPrice)
                increaseSummaryPastPrice(items[id].pastTotalPrice)
                updateCost()
                cartAmount++
                cartAmountUpdate()
                increaseAmount(id, items[id].amount)
                buttonsEnabled(el)
            }
        })
    }

    let checkboxes = document.querySelectorAll('.checkbox-single')
    checkboxes.forEach((checkbox) => {
        element.checked
            ? checkbox.checked = true
            : checkbox.checked = false
    })
}

function addDeliveryDate(id, num) {
    const deliveryDiv = `
        <div class="delivery__date delivery__date-additional">
            <p class="delivery__date-question">7-8 февраля</p>
            <div class="delivery__date-answer">
                <div>
                    <img data-id="${id}" class="delivery__img" src="./images/${items[id].img}.jpg" width="40" height="56" alt="${items[id].img}">
                    <span>${num}</span>
                </div>
            </div>
        </div>
    `;
    document.querySelector('.delivery__refusal')
        .insertAdjacentHTML('beforebegin', deliveryDiv);
}

function reduceAmount(id, amount) {
    if (document
        .querySelector('.delivery__date-additional')
        ?.querySelector('img[data-id="' + id + '"]')) {
        let reducedSpan = document
            .querySelector('.delivery__date-additional')
            .querySelector('img[data-id="' + id + '"]').nextElementSibling
        if (+reducedSpan.textContent - amount == 0) {
            reducedSpan.closest('div').remove()
            if (document
                .querySelector('.delivery__date-additional')
                .querySelector('.delivery__date-answer')) {
                document
                    .querySelector('.delivery__date-additional')
                    .remove()
            }
        }
        else if (+reducedSpan.textContent - amount < 0) {
            reducedSpan.closest('div').remove()
            if (document
                .querySelector('.delivery__date-additional')
                .querySelector('.delivery__date-answer')) {
                document
                    .querySelector('.delivery__date-additional')
                    .remove()
            }
            document
                .querySelector('.delivery__date')
                ?.querySelector('img[data-id="' + id + '"]').closest('div').remove()
        }
        else {
            reducedSpan.textContent = `${+reducedSpan.textContent - amount}`
        }
    }
    else {
        if (document
            .querySelector('.delivery__date')
            .querySelector('img[data-id="' + id + '"]')) {
            let reducedSpan = document
                .querySelector('.delivery__date')
                .querySelector('img[data-id="' + id + '"]')
                ?.nextElementSibling
            if (+reducedSpan.textContent - amount == 0) {
                reducedSpan.closest('div').remove()
            }
            reducedSpan.textContent = `${+reducedSpan.textContent - amount}`
        }
    }
}

function increaseAmount(id, amount) {
    if (document
        .querySelector('.delivery__date-additional')
        ?.querySelector('img[data-id="' + id + '"]')) {
        let reducedSpan = document
            .querySelector('.delivery__date-additional')
            .querySelector('img[data-id="' + id + '"]').nextElementSibling
        reducedSpan.textContent = `${+reducedSpan.textContent + amount}`
    }
    else {
        if (!document
            .querySelector('.delivery__date')
            ?.querySelector('img[data-id="' + id + '"]')) {
            amount > 184
                ? itemsPerRow = 184
                : itemsPerRow = amount
            deliveryRow = `
            <div>
                <img data-id="${id}" class="delivery__img" src="./images/${items[id].img}.jpg" width="40" height="56"
                alt="${items[id].img}">
                <span>${itemsPerRow}</span>
            </div>
            `
            document
                .querySelector('.delivery__date-answer')
                .insertAdjacentHTML('beforeend', deliveryRow);
            if (amount > 184) addDeliveryDate(id, amount - 184)
            return
        }
        let reducedSpan = document
            .querySelector('.delivery__date')
            .querySelector('img[data-id="' + id + '"]').nextElementSibling
        if (+reducedSpan.textContent + amount >= 185 && document
            .querySelector('.delivery__date')
            .classList.contains('delivery__date-additional')) {
            deliveryRow = `
            <div>
                <img data-id="${id}" class="delivery__img" src="./images/${items[id].img}.jpg" width="40" height="56"
                alt="${items[id].img}">
                <span>${1}</span>
            </div>
            `
            document.querySelector('.delivery__date-answer').insertAdjacentHTML('beforeend', deliveryRow);
        }
        else if (+reducedSpan.textContent + amount >= 185
            && !document
                .querySelector('.delivery__date')
                .classList.contains('delivery__date-additional')) {
            addDeliveryDate(id, amount)
        }
        else reducedSpan.textContent =
            `${+reducedSpan.textContent + amount}`
    }
}

function updateCost() {
    summaryCost.textContent = `${(summaryPrice - summaryPastPrice)
        .toLocaleString('ru-RU')
        } сом`
}

function increaseSummaryPrice(num) {
    console.log(num)
    console.log(summaryPrice)
    summaryPrice += num
    summaryPriceText.textContent = `${(round(summaryPrice))
        .toLocaleString('ru-RU')} сом`
}

function reduceSummaryPrice(num) {
    summaryPrice -= num
    summaryPriceText.textContent = `${(round(summaryPrice))
        .toLocaleString('ru-RU')} сом`
}

function increaseSummaryPastPrice(num) {
    summaryPastPrice += num
    summaryPastPriceText.textContent = `${(round(summaryPastPrice))
        .toLocaleString('ru-RU')} сом`
}

function reduceSummaryPastPrice(num) {
    summaryPastPrice -= num
    summaryPastPriceText.textContent = `${(round(summaryPastPrice))
        .toLocaleString('ru-RU')} сом`
}

function buttonsEnabled(el) {
    el.closest('.cart')
        .querySelector('.cart__amount-button-minus')
        .disabled = false
    el.closest('.cart')
        .querySelector('.cart__amount-button-plus')
        .disabled = false
}

function buttonsDisabled(el) {
    el.closest('.cart')
        .querySelector('.cart__amount-button-minus')
        .disabled = true
    el.closest('.cart')
        .querySelector('.cart__amount-button-plus')
        .disabled = true
}

function mainReduced(id) {
    mainAmount = mainAmount - items[id].amount
    mainPrice = mainPrice - items[id].totalPrice

    mainAmountText.textContent = `${(mainAmount).toLocaleString('ru-RU')} ${amountEnding(mainAmount)}`
    mainPriceText.textContent = `${(mainPrice).toLocaleString('ru-RU')} сом`
}

function amountEnding(num) {
    let mod = num % 10

    if (mod == 1) return 'товар'

    else if (mod == 2 || mod == 3 || mod == 4)
        return 'товара'

    else return 'товаров'
}

function cartAmountUpdate() {
    cartAmountText.textContent = `${(cartAmount)
        .toLocaleString('ru-RU')}`
    summaryAmountText.textContent = `${cartAmount} ${amountEnding(cartAmount)}`
}