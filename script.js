window.addEventListener("load", function ()
{

    let displayErrCardNumber = 0;
    let displayErrExpDate = 0;
    let displayErrCardCVC = 0;

    const form = document.querySelector(".card__details__form");

    const cardholderName = document.querySelector("#cardholder__name");

    const expiringWrapper = document.querySelector(".exp__dates__wrapper");

    const cardNum = document.querySelector(".card__front__number");
    const cardFrontName = document.querySelector(".card__front__name");
    const cardExpDate = document.querySelector(".card__front__exp__date");
    const cardCvc = document.querySelector(".card__back__cvc");

    const completeState = document.querySelector(".complete__state--hidden");



    const errWrongInput = "Wrong input, numbers only";
    const errInvalidDate = "Invalid expiring date";
    const errInvalidCVC = "Invalid card cvc";

    form.addEventListener("submit", function (evt)
    {
        evt.preventDefault();
        const holderName = evt.target.elements["cardholder__name"].value;
        if (holderName !== "")
        {
            validInputBorder(cardholderName);
        }

        const cardNumber = evt.target.elements["card__number"].value;
        const validCardNumber = validateCardNumber(cardNumber);

        const expMonth = evt.target.elements["month"].value;

        const expYear = evt.target.elements["year"].value;

        const expDate = validateExpDate(expMonth, expYear);



        const cvc = evt.target.elements["cvc"].value;
        const validCvc = validateCVC(cvc);
        if (validCardNumber === undefined || expDate === undefined || validCvc === undefined)
        {
            return
        }

        form.classList.add("card__details__form--visually-hidden");

        form.addEventListener("transitionend", handleFormTransition, { once: true });

        function handleFormTransition()
        {
            form.classList.add("card__details__form--hidden");
            completeState.classList.add("complete__state", "complete__state--visually-hidden");
            completeState.classList.remove("complete__state--hidden");
            setTimeout(() =>
            {
                completeState.classList.remove("complete__state--visually-hidden");
                form.classList.remove("card__details__form--visually-hidden");
                populateCard(holderName, validCardNumber, expDate, validCvc);
            }, 100);
        }
        document.querySelector(".continue__btn").addEventListener("click", handleFormRestEvt, { once: true });

    });

    function populateCard(holderName, cardNumber, expDate, cvc)
    {
        cardNum.innerText = cardNumber;
        cardFrontName.innerText = holderName;
        cardExpDate.innerText = expDate;

        cardCvc.innerText = cvc;
    }

    function handleFormRestEvt()
    {
        completeState.classList.add("complete__state--visually-hidden");
        completeState.addEventListener("transitionend", function ()
        {
            completeState.classList.add("complete__state--hidden");
            completeState.classList.remove("complete__state");
            form.classList.remove("card__details__form--hidden");
            form.classList.add("card__details__form", "card__details__form--visually-hidden");
            setTimeout(() =>
            {
                form.classList.remove("card__details__form--visually-hidden");
                const inputs = document.querySelectorAll(".card__details__form input");
                inputs.forEach(input =>
                {
                    input.style.border = "1.5px solid hsl(270, 3%, 87%)";
                });
                resetCard();
                form.reset();

            }, 100);
        }, { once: true })
    }

    function resetCard()
    {
        const defaultCardNumber = "0000 0000 0000 0000";
        const defaultCardName = "Jane Appleseed"
        const defaultExpDate = "00/00";
        const defaultCardCvc = "000";

        populateCard(defaultCardName, defaultCardNumber, defaultExpDate, defaultCardCvc);
    }

    function validateCVC(input)
    {
        const cvc = document.querySelector(".cvc");
        const errorState = document.querySelector(".cvc__wrapper > .error__state");

        const numRgxCVC = /^\d{3}$/;
        const valid = numRgxCVC.test(input);
        if (valid === false)
        {
            if (displayErrCardCVC === 0)
            {
                errState(cvc, errInvalidCVC);
                displayErrCardCVC = 1;
            }
            invalidInputBorder(cvc);
            return;
        }
        if (displayErrCardCVC === 1)
        {
            hideErrState(errorState);
            displayErrCardCVC = 0;
            cardCvc.style.marginBottom = "1.4em";

        }
        validInputBorder(cvc);

        return input;
    }
    function validateCardNumber(number)
    {
        const cardNumber = document.querySelector(".card__number");
        const errorState = document.querySelector(".card__details__form > .error__state");

        const numRegex = /^\d{16}$/;
        const valid = numRegex.test(number);
        if (valid === false)
        {
            if (displayErrCardNumber === 0)
            {
                errState(cardNumber, errWrongInput);
                displayErrCardNumber = 1;
            }
            invalidInputBorder(cardNumber);
            return;
        }
        if (displayErrCardNumber === 1)
        {
            hideErrState(errorState);
            displayErrCardNumber = 0;
            cardNumber.style.marginBottom = "1.4em";

        }
        validInputBorder(cardNumber);
        return formatCardNumber(number);
    }
    function validateExpDate(month, year)
    {
        const expiringMonth = document.querySelector(".month");
        const expiringYear = document.querySelector(".year");
        const errorState = document.querySelector(".expiring__date > .error__state");

        let invalidExpDate = false;

        // valid month should range between 1 to 12
        const numRgxMonth = /^(1[0-2]|[1-9])$/;
        // valid year should be between range of 22 and 26 
        const numRgxYear = /^(2[2-6])$/;

        const validMonth = numRgxMonth.test(month);

        const validYear = numRgxYear.test(year);


        if (validMonth === false)
        {
            invalidExpDate = true;
            invalidInputBorder(expiringMonth);
        } else
        {

            validInputBorder(expiringMonth);
        }

        if (validYear === false)
        {
            invalidExpDate = true;
            invalidInputBorder(expiringYear);
        } else
        {
            validInputBorder(expiringYear);
        }

        if (invalidExpDate)
        {
            if (displayErrExpDate === 0)
            {
                errState(expiringWrapper, errInvalidDate);
                displayErrExpDate = 1;
            }

            return;
        }
        if (displayErrExpDate === 1)
        {
            hideErrState(errorState);
            displayErrExpDate = 0;
        }

        return formatExpDate(month, year);

    }

    function errState(parentElement, msg)
    {
        const errState = document.createElement("span");
        errState.className = "error__state";

        parentElement.style.marginBottom = ".5em";
        errState.innerText = msg;
        parentElement.insertAdjacentElement("afterend", errState);


    }

    function hideErrState(element)
    {
        element.style.display = "none";
    }

    function validInputBorder(element)
    {
        element.style.background = `linear-gradient(hsl(0, 0%, 100%),hsl(0, 0%, 100%)) padding-box, linear-gradient(90deg, hsl(249, 99%, 64%), hsl(278, 94%, 30%)) border-box`;
        element.style.border = "1.5px solid transparent";
        element.style.borderRadius = "0.6em";
    }

    function invalidInputBorder(element)
    {
        element.style.border = "1.5px solid hsl(0, 100%, 66%)";
    }

    function formatCardNumber(cardNumber)
    {
        return `${cardNumber.substr(0, 4)} ${cardNumber.substr(4, 4)} ${cardNumber.substr(8, 4)} ${cardNumber.substr(12, 4)}`;
    }
    function formatExpDate(month, year)
    {
        const rgx = /^([1-9])$/;
        if (rgx.test(month) === true)
        {
            month = `0${month}`;
        }

        return `${month}/${year}`;
    }
});