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
