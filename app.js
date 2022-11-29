document.addEventListener("DOMContentLoaded", function () {
    var eventCalllback = function (e) {
        var el = e.target,
            clearVal = el.dataset.phoneClear,
            pattern = el.dataset.phonePattern,
            matrix_def = "+7(___) ___-__-__",
            matrix = pattern ? pattern : matrix_def,
            i = 0,
            def = matrix.replace(/\D/g, ""),
            val = e.target.value.replace(/\D/g, "");
        if (clearVal !== 'false' && e.type === 'blur') {
            if (val.length < matrix.match(/([\_\d])/g).length) {
                e.target.value = '';
                return;
            }
        }
        if (def.length >= val.length) val = def;
        e.target.value = matrix.replace(/./g, function (a) {
            return /[_\d]/.test(a) && i < val.length ? val.charAt(i++) : i >= val.length ? "" : a
        });
    }
    var phoneMask = document.querySelector('.receiver__data-number');
    for (let ev of ['input', 'focus']) {
        phoneMask.addEventListener(ev, eventCalllback);
    }
});

function rotateArrow(element) {
    let rotationEl = element.querySelector('.icon--arrow')
    let visibility = element.closest('div')
        .nextElementSibling.style

    if (!rotationEl.classList.contains('icon--arrow-rotated'))
        visibility.display = 'none'
    else visibility.display = 'flex'
    rotationEl.classList.toggle('icon--arrow-rotated')

    document.querySelector('.main__opened').classList.toggle('disabled')
    document.querySelector('.main__closed').classList.toggle('disabled')
}

function likeItem(element) {
    let heartColor = element.querySelector('svg')
    heartColor.classList.toggle('icon--heart-selected')
}

function validate() {
    let inputs = document.querySelectorAll('.receiver__input')

    document.querySelector('.receiver__data-subtext')
        .style.display = 'block'

    let submit = false

    let inputFirstName = document
        .querySelector('.receiver__first-name')
    let inputSecondName = document
        .querySelector('.receiver__second-name')
    let inputEmail = document
        .querySelector('.receiver__data-email')
    let inputPhone = document
        .querySelector('.receiver__data-number')
    let inputInn = document
        .querySelector('.receiver__data-inn')

    nameValidate(inputFirstName)
    nameValidate(inputSecondName)
    emailValidate(inputEmail)
    phoneValidate(inputPhone)
    innValidate(inputInn)

    if (submit) {
        console.log('Данные ушли')
        inputs.forEach((input) => {
            input.value = ''
        })
    }
}

function nameValidate(name) {
    if (name.value === '') {
        name.classList.add('receiver__error')
        name.nextElementSibling.style.display = 'block'
        return true
    }
    else blurInputs(name)
}

function emailValidate(email) {
    if (!email.value.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
        email.classList.add('receiver__error')
        email.nextElementSibling.style.display = 'block'
        return true
    }
    else blurInputs(email)
}

function phoneValidate(phone) {
    if (phone.value.length !== 17) {
        phone.classList.add('receiver__error')
        phone.nextElementSibling.style.display = 'block'
        return true
    }
    else blurInputs(phone)
}

function innValidate(inn) {
    if ((inn.value.length >= 10) || (!inn.value.match(/^\d+$/))) {
        inn.classList.add('receiver__error')
        inn.nextElementSibling.style.display = 'block'
        document.querySelector('.receiver__data-subtext')
            .style.display = 'none'
        return true
    }
    else blurInputs(inn)
}

function blurInputs(element) {
    element.classList.remove('receiver__error')
    element.nextElementSibling.style.display = 'none'
}

function showManufacturer(element) {
    element.nextElementSibling.style.display = 'block'
}

function hideManufacturer(element) {
    element.nextElementSibling.style.display = 'none'
}

function showPrice(element) {
    element.nextElementSibling.style.display = 'flex'
}

function hidePrice(element) {
    element.nextElementSibling.style.display = 'none'
}

function showInfo(element) {
    element.closest('p')
        .nextElementSibling.style.display = 'block'

    let coords = element.getBoundingClientRect();
    let infoEl = document
        .querySelector('.delivery__refusal-info')
    infoEl.style.left = coords.left - 115 + "px";
}

function hideInfo(element) {
    element.closest('p')
        .nextElementSibling.style.display = 'none'
}

function setActive(element) {
    if (!element.classList
        .contains('delivery-choice__active')) {
        let elements = document
            .querySelectorAll('.delivery-choice__button')
        elements.forEach((button) => {
            button.classList.toggle('delivery-choice__active')
        })
        elements = document
            .querySelectorAll('.delivery-choice__adresses')
        elements.forEach((list) => {
            list.classList
                .toggle('delivery-choice__adresses-active')
        })
    }
}

function chooseAdress(element) {
    let adress = document
        .querySelector('.radio:checked').closest('label')
        .nextElementSibling.textContent
    document.querySelector('.summary__delivery-text')
        .textContent = adress
    document.querySelector('.delivery__point-adress')
        .textContent = adress

    activeChoice = document
        .querySelector('.delivery-choice__active').textContent

    if (activeChoice === 'Курьером') {
        document.querySelector('.delivery__point-info')
            .style.display = 'none'
        document.querySelector('.summary__delivery-title')
            .textContent = 'Доставка курьером'
        document.querySelector('.delivery__point-question')
            .textContent = 'Курьером'
    }
    else {
        document.querySelector('.delivery__point-info')
            .style.display = 'flex'
        let rating = document.querySelector('.radio:checked')
            .closest('li')
            .querySelector('.delivery-choice__point-rating')
            .textContent
        let time = document.querySelector('.delivery-choice__point-time').textContent
        document.querySelector('.summary__delivery-title')
            .textContent = 'Доставка в пункт выдачи'
        document.querySelector('.delivery__point-question')
            .textContent = 'Пункт выдачи'
        document.querySelector('.delivery__point-rating')
            .textContent = rating
        document.querySelector('.delivery__point-time')
            .textContent = time
    }
    element.closest('.choice__shadow').style.display = 'none'
}

function closeChoice(element) {
    element.closest('.choice__shadow').style.display = 'none'
}

function openDeliveryChoice() {
    document.querySelector('.delivery-choice__shadow')
        .style.display = 'block'
}

function openPaymentChoice() {
    document.querySelector('.payment-choice__shadow')
        .style.display = 'block'
}

function chooseCard(element) {
    let cardImg = document.querySelector('.radio:checked')
        .closest('label').nextElementSibling
        .querySelector('img').getAttribute('src')
    let cardNumber = document.querySelector('.radio:checked')
        .closest('label').nextElementSibling
        .querySelector('p').textContent
    let cardSpan = document.querySelector('.radio:checked')
        .closest('label').nextElementSibling
        .querySelector('span').textContent

    document.querySelectorAll('.set-card-img')
        .forEach(el => { el.src = cardImg })
    document.querySelectorAll('.set-card-num')
        .forEach(el => { el.textContent = cardNumber })
    document.querySelector('.set-card-span')
        .textContent = cardSpan
    element.closest('.choice__shadow')
        .style.display = 'none'
}

function changeButton() {
    document.querySelector('.summary__button')
        .classList.toggle('summary__button-white')
}

function buttonDisabled() {
    const buttonEl = document.querySelector('.summary__button')
    if (buttonEl.disabled) buttonEl.disabled = false
    else buttonEl.disabled = true
}