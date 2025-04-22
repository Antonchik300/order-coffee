document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('orderForm');
    const addButton = form.querySelector('.add-button');
    const modalOverlay = document.querySelector('.modal-overlay');
    const modalText = modalOverlay.querySelector('.modal-text');

    function getDrinkWord(number) {
        const lastDigit = number % 10;
        const lastTwoDigits = number % 100;
        if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return 'напитков';
        if (lastDigit === 1) return 'напиток';
        if (lastDigit >= 2 && lastDigit <= 4) return 'напитка';
        return 'напитков';
    }

    function updateWishesOutput(e) {
        const text = e.target.value;
        const processed = text.replace(regex, (match) => `<b>${match}</b>`);
        e.target.closest('.beverage').querySelector('.wishes-output').innerHTML = processed;
    }

    form.querySelectorAll('.beverage').forEach(beverage => {
        const wishesInput = beverage.querySelector('.wishes-input');
        if (wishesInput) wishesInput.addEventListener('input', updateWishesOutput);
    });

    addButton.addEventListener('click', () => {
        const beverages = form.querySelectorAll('.beverage');
        const newBeverage = beverages[0].cloneNode(true);
        newBeverage.querySelector('.beverage-count').textContent = `Напиток №${beverages.length + 1}`;
        const wishesInput = newBeverage.querySelector('.wishes-input');
        wishesInput.value = '';
        newBeverage.querySelector('.wishes-output').innerHTML = '';
        wishesInput.addEventListener('input', updateWishesOutput);
        form.insertBefore(newBeverage, addButton.parentElement);
        updateDeleteButtons();
    });

    form.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-button')) {
            const beverages = form.querySelectorAll('.beverage');
            if (beverages.length > 1) {
                e.target.closest('.beverage').remove();
                updateBeverageNumbers();
            }
        }
    });

    const milkMap = {
        'usual': 'обычное',
        'no-fat': 'обезжиренное',
        'soy': 'соевое',
        'coconut': 'кокосовое'
    };

    const extrasMap = {
        'whipped cream': 'взбитых сливок',
        'marshmallow': 'зефирок',
        'chocolate': 'шоколад',
        'cinnamon': 'корица'
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const beverages = form.querySelectorAll('.beverage');
        const beveragesCount = beverages.length;
        modalText.textContent = `Вы заказали ${beveragesCount} ${getDrinkWord(beveragesCount)}:`;
        const tbody = modalOverlay.querySelector('.modal-table tbody');
        tbody.innerHTML = '';
        beverages.forEach(bev => {
            const selectElem = bev.querySelector('select');
            const beverage = selectElem ? selectElem.selectedOptions[0].textContent.trim() : '';
            const milkInput = bev.querySelector("input[name='milk']:checked");
            const milk = milkInput ? milkMap[milkInput.value] : '';
            const extrasInputs = bev.querySelectorAll("input[name='options']:checked");
            const extrasArr = Array.from(extrasInputs).map(input => extrasMap[input.value] || '');
            const extras = extrasArr.filter(Boolean).join(', ');
            const wishesInput = bev.querySelector('.wishes-input');
            const wishes = wishesInput ? wishesInput.value : '';
            tbody.innerHTML += `<tr><td>${beverage}</td><td>${milk}</td><td>${extras}</td><td>${wishes}</td></tr>`;
        });
        modalOverlay.style.display = 'flex';
    });

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay || e.target.classList.contains('modal-close')) {
            modalOverlay.style.display = 'none';
        }
    });

    function updateDeleteButtons() {
        const beverages = form.querySelectorAll('.beverage');
        beverages.forEach(beverage => {
            const deleteButton = beverage.querySelector('.delete-button');
            deleteButton.style.display = beverages.length === 1 ? 'none' : 'block';
        });
    }

    function updateBeverageNumbers() {
        const beverages = form.querySelectorAll('.beverage');
        beverages.forEach((beverage, index) => {
            beverage.querySelector('.beverage-count').textContent = `Напиток №${index + 1}`;
        });
    }

    updateDeleteButtons();
});