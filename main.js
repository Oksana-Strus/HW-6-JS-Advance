// ДЗ по localStorage

// Потрібно розробити форму для реєстрації, логінування а також блок профайлу.
// Всі дані проходять через localStorage. Основні пункти що має працювати.
// При реєстрації дані попадають в localStorage. Перед добавленням нового 
// користувача провіряємо чи нема у нас вже користувача з такою поштою, якщо є то не добавляти його. Всі дані мають валідуватися регулярними виразами.
// При логінуванні перевіряти чи всі поля заповнені і чи правильний логін та пароль, якщо щось не так виводити відповідне повідомлення.
//  Всі дані беруться з localStorage.
// Якщо правильний логін та пароль то перейти на блок профайлу.
// При натисканні на Sign Out переходимо назад на блок Sign In.
// ------------------------------------------------------------------------------------------
const INPUT = document.querySelectorAll('.decoration')
const BTN = document.querySelector('.submitBtn');
const FORM = document.querySelector('.registerForm');
const WARNING_MSG = document.querySelector('.warning');
const SIGN_IN_NOW = document.querySelector('signInNow');
const SECOND_FORM = document.getElementById('signInNowForm');
const FIRST_PAGE = document.getElementById('first-page-tag-a');
const SECOND_PAGE = document.getElementById('second-page-tag-a');
const PERSON_PAGE = document.getElementById('personPage');
const PERSON_NAME = document.getElementById('personName');
const PERSON_EMAIL = document.getElementById('personEmail');
const SIGN_UP_BACK = document.querySelector('.signUpBack');

SIGN_UP_BACK.addEventListener('click', function () {
    PERSON_PAGE.style.display = 'none';
    SECOND_FORM.style.display = 'block';
    FORM.style.display = 'none';
})

clickOnHref(FIRST_PAGE);
clickOnHref(SECOND_PAGE);
FIRST_PAGE.addEventListener('click', function () {
    FORM.style.display = 'none';
    SECOND_FORM.style.display = 'block';
})

SECOND_PAGE.addEventListener('click', function () {
    FORM.style.display = 'block';
    SECOND_FORM.style.display = 'none';
})


let active = true;
class UserData {
    constructor(name, lastName, email, password) {
        this.name = name;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
    }
    sayHi() {
        alert(this.name);
    }
}

function clickOnHref(element) {
    element.addEventListener('mouseout', function () {
        this.style.textDecoration = 'none';
    })
    element.addEventListener('mouseover', function () {
        this.style.textDecoration = 'underline';
    })
}


FORM.addEventListener('submit', function (event) {
    event.preventDefault();

    let valid = true;

    for (let i = 0; i < event.target.length - 1; i++) {
        setInputValidityStyle(event.target.elements[i], event.target.elements[i].validity.valid);

        if (!event.target.elements[i].validity.valid) {
            valid = false;
        }
    }

    if (valid) {
        let userName = event.target.elements['userName'].value;
        let userLastName = event.target.elements['userLastName'].value;
        let userEmail = event.target.elements['userEmail'].value;
        let userPassword = event.target.elements['userPassword'].value;
        let userData = new UserData(userName, userLastName, userEmail, userPassword);
        userData.sayHi();
        let allUsers = getUsersfromLocalStrorage();
        let existUserWithEmail = allUsers.some(user => user.email === userEmail)

        if (existUserWithEmail) {
            setInputValidityStyle(event.target.elements['userEmail'], false);
            event.target.elements['userEmail'].nextElementSibling.innerHTML = 'This email already exist.';
        } else {
            allUsers.push(userData);
            localStorage.setItem('userDatas', JSON.stringify(allUsers));
            event.target.reset();
            for (let i = 0; i < event.target.length - 1; i++) {
                event.target.elements[i].style.border = '';
                event.target.elements[i].style.backgroundImage = 'none';
            }
        }
    }

})

function getUsersfromLocalStrorage() {
    let arrAllUsers = [];
    if (localStorage.getItem('userDatas')) {
        arrAllUsers = JSON.parse(localStorage.getItem('userDatas'));
    }
    return arrAllUsers;
}

function setInputValidityStyle(input, valid) {
    if (valid) {
        input.style.border = "3px solid green";
        input.style.backgroundImage = "url(check.svg)";
        input.nextElementSibling.style.visibility = 'hidden';
    } else {
        input.style.border = "3px solid red"
        input.style.backgroundImage = "url(times.svg)"
        input.nextElementSibling.style.visibility = 'visible';
    }
}

function setInputValidityStyleInSecondForm(input, valid) {
    if (!valid) {
        input.style.border = "3px solid red"
        input.nextElementSibling.style.visibility = 'visible';
    }
}

SECOND_FORM.addEventListener('submit', function (event) {
    event.preventDefault();
    let valid = true;
    for (let i = 0; i < event.target.length - 1; i++) {
        if (!event.target.elements[i].validity.valid) {
            setInputValidityStyleInSecondForm(event.target.elements[i], event.target.elements[i].validity.valid);
        } else {

        }
    }

    if (valid) {
        let userEmail = event.target.elements['checkemail'];
        let userPassword = event.target.elements['checkpassword'];

        if (localStorage.length == 0) {
            setInputValidityStyleInSecondForm(userPassword, false);
            setInputValidityStyleInSecondForm(userEmail, false);
            userPassword.nextElementSibling.innerHTML = 'localstorage  is empty';
            console.log('00000')
            return;
        }

        if (localStorage.length > 0) {
            setInputValidityStyleInSecondForm(userPassword, false);
            setInputValidityStyleInSecondForm(userEmail, false);
            let allUsers = getUsersfromLocalStrorage();
            let existUserWithEmailAndPassword = allUsers.some(user => user.email === userEmail.value && user.password === userPassword.value);
            console.log(existUserWithEmailAndPassword);
            if (existUserWithEmailAndPassword) {
                let userInfo = allUsers.find(user => user.email === userEmail.value && user.password === userPassword.value);
                PERSON_NAME.innerHTML = userInfo.name + ' ' + userInfo.lastName;
                PERSON_EMAIL.innerHTML = userInfo.email;

                setInputValidityStyleInSecondForm(userEmail, true);
                setInputValidityStyleInSecondForm(userPassword, true);
                console.log('EXSISTS EMAIL && PASSWORD');
                SECOND_FORM.style.display = 'none';
                PERSON_PAGE.style.display = 'block';
                SECOND_FORM.reset();
                userEmail.style.border = '';
                userPassword.style.border = '';
                userPassword.nextElementSibling.style.visibility = 'hidden';
            }
        }
    }
})



INPUT.forEach(input => {
    input.addEventListener('focus', function () {
        this.style.border = '2px solid rgb(65, 195, 255)';
        this.style.outline = 'none';
        this.style.boxShadow = ' 0 0 20px skyblue'
    })
    input.addEventListener('blur', function () {
        this.style.border = '';
        this.style.outline = 'none';
        this.style.boxShadow = '';
    })

    if (input.innerHTML = '') {
        this.style.backgroundImage = 'none'
    }
})

BTN.addEventListener('mouseover', function (event) {
    this.style.border = '';
    this.style.outline = 'none';
    this.style.backgroundColor = "rgb(1, 55, 155)";
})
BTN.addEventListener('mouseout', function (event) {
    this.style.border = '';
    this.style.outline = 'none';
    this.style.backgroundColor = '';
})
BTN.addEventListener('mousedown', function (event) {
    this.style.border = '';
    this.style.outline = 'none';
    this.style.boxShadow = ''
    this.style.backgroundColor = '';
})

BTN.addEventListener('focus', function (event) {
    BTN.style.border = '3px solid rgb(65, 195, 255)';
    BTN.style.outline = 'none';
    BTN.style.boxShadow = ' 0 0 20px skyblue'
})













































// let inputFirstName = /^[A-Z][a-z]{1,20}$/;
//     console.log(inputFirstName.test('Axysdbsdhsfd'));

// let inputLastName = /^[A-Z][a-z]{1,20}$/;
//     console.log(inputLastName.test('Axysdbsddddhsfd'));


// let email = /^([\w\$\.-_]+)@([a-z]+)\.([a-z]{2,5})$/
// console.log(email.test('agdj@gmail.com'))

// let password = /^([\w]{8,15})$/
// console.log(password.test('dfghjklxcvbnhdf'))

// let phone = /^\+380\(\d{2}\)-\d{3}-\d{4}$/