let foods = JSON.parse(localStorage.getItem("foods")) || [];

const nameInput = document.getElementById("name");
const dateInput = document.getElementById("date");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("list");

addBtn.addEventListener("click", addFood);

function save() {
    localStorage.setItem("foods", JSON.stringify(foods));
}

function addFood() {
    const name = nameInput.value;
    const date = dateInput.value;

    if (!name || !date) {
        alert("入力してください");
        return;
    }

    foods.push({ name, date });
    save();
    render();

    nameInput.value = "";
    dateInput.value = "";
}

function getDiffDays(dateStr) {
    const today = new Date();
    const target = new Date(dateStr);

    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);

    return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
}

function render() {
    foods.sort((a, b) => {
        return getDiffDays(a.date) - getDiffDays(b.date);
    });
    
    list.innerHTML = "";

    foods.forEach((food, index) => {
        const diff = getDiffDays(food.date);

        let text = "";
        let className = "";

        if (diff < 0) {
            text = "期限切れ⚠";
            className = "danger";
        } else if (diff === 0) {
            text = "今日まで⚠";
            className = "danger";
        } else {
            text = "あと " + diff + " 日";
        }

        const div = document.createElement("div");
        div.className = "item " + className;

        div.innerHTML = `
        <div class="item-left">
        <span class="food-name">${food.name}</span>
        <span class="food-date">${text}</span>
        </div>
        <button data-index="${index}">削除</button>
        `;

        div.querySelector("button").addEventListener("click", () => {
            removeFood(index);
        });

        list.appendChild(div);
    });
}

function removeFood(index) {
    foods.splice(index, 1);
    save();
    render();
}

render();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(() => console.log('SW登録成功'))
    .catch(err => console.log('SW登録失敗', err));
}