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
                <input 
                    class ="input_quantity"
                    type="number" 
                    min="1" 
                    value="${item.quantity}" 
                    onchange="updateQuantity(${index}, this.value)" 
                    style="width:50px;text-align:center;"
                >
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



////////////
function updateQuantity(index, value) {
    const newValue = parseInt(value);
    if (isNaN(newValue) || newValue <= 0) {
        // Nếu nhập số không hợp lệ thì xóa sản phẩm
        cart.splice(index, 1);
    } else {
        cart[index].quantity = newValue;
    }
    if(newValue>=100){
        let ktra = confirm("Bạn mua nhiều số lượng quá , liên hệ với shop để tư vấn nha <3 ")
        if(ktra){
          alert("bạn để lại số điện thoại để mình lấy thông tin chốt đơn cho bạn nhá !");
          prompt("mời bạn nhập số điện thoại ");
        }else{
          alert("rất tiếc , bạn không thể mua hàng của chúng tôi !"); d
        }
    }
    renderCart();
}
const checkout_btn = document.querySelector(".checkout-btn");

let input = ()=>{
    const input_quantity = document.querySelector(".input_quantity");
    return input_quantity.value;
}
// console.log(checkout_btn);
checkout_btn.addEventListener("click",()=>{
    if(input() >= 100 ){
        alert(" nhiều quá !")
    }

})
// Xóa sản phẩm
function removeItem(index) {
    cart.splice(index, 1);
    renderCart();
}

// tìm kiếm 
const search = document.querySelector(".header-search_input");
// const productName = document.querySelectorAll(".product-name");
const product_list = document.querySelector(".product-list");
// const search = document.querySelector(".header-search_input");

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
// tìm kiếm sản phẩm 
    // let input_value = search.value.toLowerCase().trim();
    // productName.forEach((child)=>{
    //     let nameSP = child.textContent.toLowerCase().trim();
    //     if(nameSP.includes(input_value)){
    //         child.parentElement.parentElement.classList.remove("fade");
    //     }else{
    //         child.parentElement.parentElement.classList.add("fade");
    //     }
    // })

    const input_value = search.value.toLowerCase().trim();

    // lấy tất cả sản phẩm hiện có (vì có thể vừa render lại)
    const allProducts = document.querySelectorAll(".product-card");

    allProducts.forEach(card => {
        const nameEl = card.querySelector(".product-name");
        const nameSP = nameEl.textContent.toLowerCase().trim();

        if (nameSP.includes(input_value)) {
            card.parentElement.classList.remove("fade");
        } else {
            card.parentElement.classList.add("fade");
        }
    });
});

// THÊM SẢN PHẨM KHI ẤN 

// --- MODAL ADD PRODUCT  ---
const modal = document.getElementById("modal");
console.log(modal);
const closeModal = document.getElementById("closeModal");
const openModalButtons = document.querySelectorAll(".openModal");
let currentCategory = null;

openModalButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        currentCategory = btn.getAttribute("data-category");
        modal.style.display = "flex";
    });
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
let productsData = JSON.parse(localStorage.getItem("productsData")) || {
    nam: [],
    nu: [],
    unisex: []
};

const form = document.getElementById("addForm");
const nameInput = document.getElementById("name");
const priceInput = document.getElementById("price");
const imageInput = document.getElementById("image");
const productList = document.getElementById("productList");

// hàm hiển thị  sản phẩm 
// if()
function renderCategoryProducts(category, containerId) {
    const productList = document.getElementById(containerId);
    productList.innerHTML = "";
    productsData[category].forEach((p, index) => {
        const item = document.createElement("div");
        item.className = "col-lg-3 pos-re";
        item.innerHTML = `
        <div class="product-card">
            <div><button class="delete" data-category="${category}" data-index="${index}">×</button></div>
            <img src="${p.image}" alt="${p.name}">
            <h3 class="product-name">${p.name}</h3>
            <p class="price">${p.price.toLocaleString()}đ</p>
            <button class="button">Thêm vào giỏ</button>
        </div>
        `;
        productList.appendChild(item);
    });
}

//
productList.addEventListener("click", (e) => {
  if (e.target.classList.contains("button")) {
    const productCard = e.target.closest(".product-card");
    const name = productCard.querySelector(".product-name").textContent;
    const priceText = productCard.querySelector(".price").textContent;
    const price = parseInt(priceText.replace(/[^\d]/g, ""));
    const img = productCard.querySelector("img").src;

    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({ name, price, img, quantity: 1 });
    }

    renderCart();
    // alert(` Đã thêm "${name}" vào giỏ hàng!`);
  }
});
// hàm thêm sản phẩm 
form.addEventListener("submit",(e)=>{
    e.preventDefault();

    const newProduct = {
        name:nameInput.value,
        price:Number(priceInput.value),
        image:imageInput.value
    };

if (currentCategory) {
    productsData[currentCategory].push(newProduct);
    localStorage.setItem("productsData", JSON.stringify(productsData));
}


    form.reset();
    renderAll();
     modal.style.display = "none"; //  đóng modal sau khi th
});

// hàm xóa sản phẩm 
function deleteProduct(category, index,event) {
    event.stopPropagation();
    if (confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
        productsData[category].splice(index, 1);
        localStorage.setItem("productsData", JSON.stringify(productsData));
        renderAll();
    }
}


function renderAll() {
  renderCategoryProducts("nam", "productList");  // Giày Nam
  renderCategoryProducts("nu", "productListNu"); // Giày Nữ
  renderCategoryProducts("unisex", "productListUnisex"); // Giày Unisex
  attachDeleteEvents();
}
renderAll();

function attachDeleteEvents() {
  const deleteButtons = document.querySelectorAll(".delete");
  deleteButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation(); // 🔥 chặn click lan lên document (modal sẽ KHÔNG mở)
      const category = btn.dataset.category;
      const index = btn.dataset.index;

      if (confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
        productsData[category].splice(index, 1);
        localStorage.setItem("productsData", JSON.stringify(productsData));
        renderAll();
      }
    });
  });
}



// admin
const admin = document.querySelector(".header__btn-admin");
const product_card = document.querySelectorAll(".product-card");
const btn_add = document.querySelectorAll(".btn-add")
let btn_test = localStorage.getItem("btn_test") === "true";

admin.addEventListener("click",()=>{ 
    if(btn_test){
        admin.textContent = "Khách";
        product_card.forEach((child)=>{
            const delete_btn = child.querySelector(".delete");
            if(delete_btn) delete_btn.style.display = "none";
        })
        btn_add.forEach((child)=>{
            child.style.display = "none";
        })
    }
    else{
        admin.textContent = "Admin";
        product_card.forEach((child)=>{
            const delete_btn = child.querySelector(".delete");
            if(delete_btn) delete_btn.style.display = "block";
        })
        btn_add.forEach((child)=>{
            child.style.display = "block";
        })
}
btn_test = !btn_test;
localStorage.setItem("btn_test",btn_test);
})

//  phần size sản phẩm
// -------------------- PRODUCT DETAIL MODAL --------------------
const detailModal = document.getElementById("productDetailModal");
const detailImage = document.getElementById("detailImage");
const detailName = document.getElementById("detailName");
const detailPrice = document.getElementById("detailPrice");
const sizeButtonsContainer = document.getElementById("sizeButtons");
const addToCartBtn = document.getElementById("addToCartBtn");
const closeDetail = document.querySelector(".close-detail");

let selectedProduct = null;
let selectedSize = null;

// Hiển thị modal khi click vào sản phẩm
document.addEventListener("click", function (e) {
  const card = e.target.closest(".product-card");
  if (card) {
    const img = card.querySelector("img").src;
    const name = card.querySelector("h3").textContent;
    const price = card.querySelector("p").textContent;

    selectedProduct = { img, name, price };

    detailImage.src = img;
    detailName.textContent = name;
    detailPrice.textContent = price;
    selectedSize = null; // reset

    // Tạo các nút size
    const sizes = [26,27,28,29,30,31,32,33,34];
    sizeButtonsContainer.innerHTML = "";
    sizes.forEach(size => {
        const btn = document.createElement("button");
        btn.textContent = size;
        btn.addEventListener("click", () => {
            document.querySelectorAll("#sizeButtons button").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            selectedSize = size;
        });
        sizeButtonsContainer.appendChild(btn);
    });
    
    detailModal.style.display = "flex";
  }
});

// Đóng modal chi tiết
closeDetail.addEventListener("click", () => {
  detailModal.style.display = "none";
});

window.addEventListener("click", e => {
  if (e.target === detailModal) {
    detailModal.style.display = "none";
  }
});

// Khi ấn "Thêm vào giỏ hàng"
addToCartBtn.addEventListener("click", () => {
  if (!selectedSize) {
    alert("Vui lòng chọn size giày!");
    return;
  }
  
  // Lưu vào localStorage hoặc danh sách giỏ hàng
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push({ ...selectedProduct, size: selectedSize });
  localStorage.setItem("cart", JSON.stringify(cart));
  
  //   alert(`Đã thêm ${selectedProduct.name} (size ${selectedSize}) vào giỏ hàng!`);
  
  detailModal.style.display = "none";
});

    
    // hiện ra thông báo đã thêm sản phẩm thành công 
    const button_tb = document.querySelectorAll(".btn_tb");
    const notify = document.querySelector(".notify");
    button_tb.forEach((child)=>{
        child.addEventListener("click",()=>{
            notify.style.display = "flex";
            // notify.offsetHeight;
            notify.style.animation = " runLeft 0.5s ease forwards , high1 2s ease 2.5s forwards"
            setTimeout(() => {
                notify.style.display = "none";
                notify.style.animation = "";
            }, 2000);
        })
    })