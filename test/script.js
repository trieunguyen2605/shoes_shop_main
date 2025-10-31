const addCartButtons = document.querySelectorAll(".add-cart");
const cartItems = document.querySelector(".cart-items");
const totalPriceElement = document.getElementById("total-price");

let total = 0;

addCartButtons.forEach(button => {
    button.addEventListener("click", (e) => {
        const product = e.target.parentElement;
        const name = product.querySelector("h3").textContent;
        const price = parseInt(product.querySelector(".price").textContent);

        // Tạo item mới
        const li = document.createElement("li");
        li.innerHTML = `${name} - ${price.toLocaleString()}₫ 
            <button class="remove">Xóa</button>`;
        cartItems.appendChild(li);

        // Cập nhật tổng
        total += price;
        totalPriceElement.textContent = total.toLocaleString();

        // Nút xóa
        li.querySelector(".remove").addEventListener("click", () => {
            li.remove();
            total -= price;
            totalPriceElement.textContent = total.toLocaleString();
        });
    });
});
