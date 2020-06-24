"use strict"

document.addEventListener("DOMContentLoaded", () => {
  const customer = document.getElementById("customer");
  const freelancer = document.getElementById("freelancer");
  const blockCustomer = document.getElementById("block-customer");
  const blockFreelancer = document.getElementById("block-freelancer");
  const btnExit = document.getElementById("btn-exit");
  const blockChoise = document.getElementById("block-choice");
  const formCastomer = document.getElementById("form-customer");
  const orderTable = document.getElementById("orders");
  const modalOrder = document.getElementById("order_read");
  const modalActive = document.getElementById("order_active");

let orders = JSON.parse(localStorage.getItem('freeOrders')) || [];
console.log(orders);
  
const toStorage = () => {
  localStorage.setItem('freeOrders', JSON.stringify(orders));
};
 

  const renderOrders = () => {

    orderTable.textContent = "";

    orders.forEach((order, i) => {
      orderTable.innerHTML += `
      <tr class="order ${order.active ? "taken" : "" }" data-number-order = "${i}"  data-number-id = "${i}">
        <td>${i+1}</td>
        <td>${order.title}</td>
        <td class = "${order.currency}"></td>
        <td>${order.deadline}</td>
      </tr>`;
    });
  };

  const handlerModal = (event) => {

    
    const target = event.target;

    const modal = target.closest(".order-modal");

    const order = orders[modal.id];

    const baseAction = () => {
      modal.style.display = 'none';

      toStorage();
      renderOrders();
    };


    if(target.closest(".close") || target === modal){
      modal.style.display = "none";
    }

    if(target.classList.contains("get-order")){
        order.active = true;
        baseAction();
    }

    if(target.id === 'capitulation'){
      order.active = false;
      baseAction();
    }

    if(target.id === 'ready'){
      
      orders.splice(orders.indexOf(order), 1);

      baseAction();
    }
  }

  const opemModal = (numberOrder) => {
    const order = orders[numberOrder];
    
    const { title, firstName, email, phone, description, amount,
    currency, deadline, active = false } = order;
    

    const modal = active ? modalActive : modalOrder;
   

    const firstNameBlock = modal.querySelector(".firstName");
    const titleBlock = modal.querySelector(".modal-title");
    const emailBlock = modal.querySelector(".email");
    const descriptionBlock = modal.querySelector(".description");
    const deadLineBlock = modal.querySelector(".deadline");
    const currencyBlock = modal.querySelector(".currency_img");
    const countBlock = modal.querySelector(".count");
    const phoneBlock = modal.querySelector(".phone");


    modal.id = numberOrder;
    titleBlock.textContent = order.title;
    firstNameBlock.textContent = order.firstName;
    emailBlock.textContent = order.email;
    emailBlock.href = "mailto:" + order.email;
    descriptionBlock.textContent = order.description;
    deadLineBlock.textContent = order.deadline;
    currencyBlock.className = "currency_img";
    currencyBlock.classList.add(order.currency);
    countBlock.textContent = order.amount;

    phoneBlock ? phoneBlock.href = "tel:" + order.phone : "" ;
    


    modal.style.display = "flex";

  
    modal.addEventListener("click", handlerModal);
   
}



  orderTable.addEventListener("click", (event) => {
    const target = event.target;
    const targetOrder = target.closest("tr");
    if(targetOrder){
      opemModal(targetOrder.dataset.numberOrder);
      console.log(targetOrder);
    }
  });

  customer.addEventListener("click", () => {
    blockChoise.style.display = "none";
    blockCustomer.style.display = "block";
    btnExit.style.display = "block";
  });

  freelancer.addEventListener("click", () => {
    blockChoise.style.display = "none";
    renderOrders();
    blockFreelancer.style.display = "block";
    btnExit.style.display = "block";
  });

  btnExit.addEventListener("click", () => {
    btnExit.style.display = "none";
    blockCustomer.style.display = "none";
    blockFreelancer.style.display = "none";
    blockChoise.style.display = "block";
  });

  formCastomer.addEventListener("submit", (event) => {
    event.preventDefault();

    const obj = {};
    obj.active = false;

    ////////////////first variant
    /*
    for(let elem of formCastomer.elements){
        if((elem.tagName === "INPUT" && elem.type !== "radio") ||
          (elem.type === "radio" && elem.checked) ||
          elem.tagName === "TEXTAREA"){
          obj[elem.name] = elem.value;

            if(elem.type !== "radio"){
                elem.value = "";
            }
        }
        
    }

    orders.push(obj);
    */

    /////////////////second variant


    /*let arrX = Array.from(formCastomer.elements);

    arrX.filter((elem) => {
         if((elem.tagName === "INPUT" && elem.type !== "radio") ||
         (elem.type === "radio" && elem.checked) ||
         elem.tagName === "TEXTAREA"){
         obj[elem.name] = elem.value;

         if(elem.type !== "radio"){
           elem.value = "";
         }
      }
    })
    orders.push(obj);
    console.log(orders);
    */

    ////////////third variant
    //с помощю спред оператора "..."
    
    [...formCastomer.elements].forEach((elem) => {

      if ((elem.tagName === "INPUT" && elem.type !== "radio") ||
        (elem.type === "radio" && elem.checked) ||
        elem.tagName === "TEXTAREA") {
        obj[elem.name] = elem.value;
        
        //пороверяем,если елемент не радио,то очищаем
        //value в поточном елементе формы
        /*if(elem.type !== "radio"){
          elem.value = "";
         }*/
      }
    });
    //альтернативный способ очистки(сброса) формы
    formCastomer.reset();

    orders.push(obj);

    toStorage();

  });




})