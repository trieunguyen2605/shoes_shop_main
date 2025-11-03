const category = document.querySelectorAll(".category p");
// console.log(category)
const section = document.querySelectorAll("section");

window.addEventListener("scroll",()=>{
    let current = "";
    section.forEach((section)=>{
        const sectionTop = section.offsetTop; // vị trí phần tử so với đầu trang 
        if (pageYOffset >= sectionTop - 250) { // vij trí đang kéo đến 
            current = section.getAttribute("id");
        }
    });

    category.forEach((p)=>{
        p.classList.remove("active");
        if(p.id === "content-link"+ current.slice(-1)){
            p.classList.add("active");
        }
    })
})

/////////////////////////
// === CART FUNCTIONALITY === //
const cartIcon = document.querySelector(".buy-icon");
const cartOverlay = document.querySelector("#cart");
const closeCart = document.querySelector(".close-cart");
const cartItemsContainer = document.querySelector(".cart-items");
const cartTotal = document.querySelector("#cart-total");

let cart = [];

// Mở / đóng giỏ hàng
cartIcon.addEventListener("click", () => {
    cartOverlay.style.display = "flex";
});

closeCart.addEventListener("click", () => {
    cartOverlay.style.display = "none";
});

// Thêm sản phẩm vào giỏ
const addButtons = document.querySelectorAll(".product-card .button");

addButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        const card = e.target.closest(".product-card");
        const name = card.querySelector("h3").innerText;
        const priceText = card.querySelector(".price").innerText.split(" ")[0];
        const price = parseInt(priceText.replace(/\D/g, ""));
        const img = card.querySelector("img").src;

        const existingItem = cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ name, price, img, quantity: 1 });
        }

        renderCart();
    });
});

// Hiển thị giỏ hàng
function renderCart() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;

        const div = document.createElement("div");
        div.classList.add("cart-item");
        div.innerHTML = `
            <img src="${item.img}" alt="">
            <div class="item-info">
                <h5>${item.name}</h5>
                <p>${item.price.toLocaleString()}đ</p>
            </div>
            <div class="item-quantity">
                <button onclick="changeQuantity(${index}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="changeQuantity(${index}, 1)">+</button>
            </div>
            <i class="fa-solid fa-trash" style="cursor:pointer;color:red;" onclick="removeItem(${index})"></i>
        `;
        cartItemsContainer.appendChild(div);
    });

    cartTotal.innerText = total.toLocaleString() + "đ";
}

// Thay đổi số lượng
function changeQuantity(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    renderCart();
}

// Xóa sản phẩm
function removeItem(index) {
    cart.splice(index, 1);
    renderCart();
}

// hiện ra thông báo khi người dùng ấn thêm vào giỏ hàng 
const button = document.querySelectorAll(".button");
console.log(button);
button.forEach((child)=>{
    child.addEventListener("click",()=>{
    alert(" Chúc mừng bạn đã thêm sản phẩm thành công vào giỏ hàng !1;")
})
})


// tìm kiếm 
const search = document.querySelector(".header-search_input");
const productName = document.querySelectorAll(".product-name");
const product_list = document.querySelector(".product-list");

search.addEventListener("keyup",()=>{
    // kéo xuống khi ấn 
    //product_list.getBoundingClientRect().top : là vị trí của element với khung nhìn 
    //window.pageYOffset: xem màn hình đã cuộn được bao nhiêu với đầu trang 
    // window.scrollTo : cuộn đến vị trí nhất định 
    // behavior: "smooth" : cuộn không bị giật 
    const offset = product_list.getBoundingClientRect().top + window.pageYOffset - 100; 
    window.scrollTo({
        top: offset,
        behavior: "smooth"
    });

    let input_value = search.value.toLowerCase().trim();
    productName.forEach((child)=>{
        let nameSP = child.textContent.toLowerCase().trim();
        if(nameSP.includes(input_value)){
            child.parentElement.parentElement.classList.remove("fade");
        }else{
            child.parentElement.parentElement.classList.add("fade");
        }
    })
})

// THÊM SẢN PHẨM KHI ẤN 

// --- MODAL ADD PRODUCT  ---
const modal = document.getElementById("modal");
console.log(modal);
const openModal = document.getElementById("openModal");
const closeModal = document.getElementById("closeModal");

// Mở modal
openModal.addEventListener("click", () => {
    modal.style.display = "flex";
});

// Đóng modal
closeModal.addEventListener("click", () => {
    modal.style.display = "none";
});

// Khi click ra ngoài modal thì ẩn đi
window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});

// THÊM SẢN PHẨM  /////////////////////
let products = JSON.parse(localStorage.getItem("products")) || [];

const form = document.getElementById("addForm");
const nameInput = document.getElementById("name");
const priceInput = document.getElementById("price");
const imageInput = document.getElementById("image");
const productList = document.getElementById("productList");

// hàm hiển thị  sản phẩm 
function renderProducts(){
    productList.innerHTML = "";
    products.forEach((p,index)=>{
        const item = document.createElement("div");
        item.className = "product_add";
        item.innerHTML = `
            <div class="col-lg-3">
                <div class="product-card">
                    <button class="delete" onclick="deleteProduct(${index})">×</button>
                    <img src="${p.image}" alt="${p.name}">
                    <h3 class="product-name">${p.name}</h3>
                    <p class="price">${p.price.toLocaleString()}đ<span class="old-price">240.000đ</span></p>
                    <button class="button">Thêm vào giỏ</button>
                </div>
            </div>
        `;
        productList.appendChild(item);
    })
}

// hàm thêm sản phẩm 
form.addEventListener("submit",(e)=>{
    e.preventDefault();

    const newProduct = {
        name:nameInput.value,
        price:Number(priceInput.value),
        image:imageInput
    };

    products.push(newProduct);
    localStorage.setItem("products",JSON.stringify(products));

    form.reset();
    renderProducts();
});

// hàm xóa sản phẩm 
function deleteProduct(index) {
    if (confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
        products.splice(index, 1);
        localStorage.setItem("products", JSON.stringify(products));
        renderProducts();
    }
}

renderProducts();
