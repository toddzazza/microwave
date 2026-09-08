document.addEventListener("DOMContentLoaded", function () {

  // ---------------------------------
  // GET CART
  // ---------------------------------

  function getCart() {
    return JSON.parse(
      localStorage.getItem("microwaveRentalCart")
    ) || [];
  }


  // ---------------------------------
  // SAVE CART
  // ---------------------------------

  function saveCart(cart) {
    localStorage.setItem(
      "microwaveRentalCart",
      JSON.stringify(cart)
    );
  }


  // ---------------------------------
  // ADD TO RENTAL BUTTONS
  // ---------------------------------

  const buttons =
    document.querySelectorAll(
      ".add-rental-button"
    );

  buttons.forEach(function (button) {

    button.addEventListener("click", function () {

      /*
        Individual synth pages require
        a rental period to be selected.
      */

      if (
        button.classList.contains(
          "equipment-add-button"
        ) &&
        !button.dataset.period
      ) {

        button.textContent =
          "SELECT RENTAL PERIOD";

        return;
      }


 const item = {
  id: button.dataset.id,
  name: button.dataset.name,
  period: button.dataset.period || "",
  price: button.dataset.price || ""
};


      let cart = getCart();


      const alreadyAdded =
        cart.some(function (cartItem) {

          return (
            cartItem.id === item.id
          );

        });


      if (!alreadyAdded) {

        cart.push(item);

        saveCart(cart);

        updateCartCount();

        button.textContent =
          "ADDED";

        button.classList.add(
          "added"
        );

      }

      else {

        button.textContent =
          "ALREADY ADDED";

      }

    });

  });


  // ---------------------------------
  // DISPLAY CART
  // ---------------------------------

  const cartContainer =
    document.getElementById(
      "rental-cart-items"
    );


  function displayCart() {

    if (!cartContainer) {
      return;
    }


    const cart =
      getCart();


    const equipmentField =
      document.getElementById(
        "cart-equipment"
      );


    if (equipmentField) {

      equipmentField.value =
        cart
          .map(function (item) {

            let text =
              item.name;

            if (item.period) {

              text +=
                " — " +
                item.period.toUpperCase();

            }

            if (item.price) {

              text +=
                " — " +
                item.price +
                " KR.";

            }

            return text;

          })
          .join(", ");

    }


    cartContainer.innerHTML = "";


    if (cart.length === 0) {

      cartContainer.innerHTML =
        '<p class="empty-cart">No equipment selected.</p>';

      return;

    }


    cart.forEach(function (item) {

      const row =
        document.createElement(
          "div"
        );

      row.className =
        "rental-cart-row";


      const name =
        document.createElement(
          "span"
        );

      name.className =
        "rental-cart-name";


      let itemText =
        item.name;


      if (item.period) {

        itemText +=
          " — " +
          item.period.toUpperCase();

      }


      if (item.price) {

        itemText +=
          " — " +
          item.price +
          " KR.";

      }


      name.textContent =
        itemText;


      const removeButton =
        document.createElement(
          "button"
        );

      removeButton.type =
        "button";

      removeButton.className =
        "rental-cart-remove";

      removeButton.textContent =
        "REMOVE";


      removeButton.addEventListener(
        "click",
        function () {

          const newCart =
            getCart().filter(
              function (cartItem) {

                return (
                  cartItem.id !==
                  item.id
                );

              }
            );


          saveCart(newCart);

          updateCartCount();

          displayCart();

        }
      );


      row.appendChild(name);

      row.appendChild(
        removeButton
      );

      cartContainer.appendChild(
        row
      );

    });

  }


  displayCart();


  // ---------------------------------
  // UPDATE CART COUNT
  // ---------------------------------

  function updateCartCount() {

    const cart =
      getCart();


    const counters =
      document.querySelectorAll(
        ".rental-cart-count"
      );


    counters.forEach(
      function (counter) {

        counter.textContent =
          cart.length;

      }
    );

  }


  updateCartCount();

});
