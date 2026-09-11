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
  // FORMAT PRICE
  // ---------------------------------

  function formatPrice(value) {

    if (
      value === undefined ||
      value === null ||
      value === ""
    ) {
      return "—";
    }

    return (
      Number(value).toLocaleString("da-DK") +
      " DKK"
    );
  }


  // ---------------------------------
  // PERIOD LABEL
  // ---------------------------------

  function getPeriodLabel(period) {

    const labels = {
      day: "1 DAY",
      weekend: "3 DAYS",
      week: "7 DAYS"
    };

    return labels[period] || "";
  }


  // ---------------------------------
  // PRICE FOR SELECTED PERIOD
  // ---------------------------------

  function getItemPrice(item, period) {

    if (period === "day") {
      return item.priceDay;
    }

    if (period === "weekend") {
      return item.price3Days;
    }

    if (period === "week") {
      return item.price7Days;
    }

    return "";
  }


  // ---------------------------------
  // CURRENT CART PERIOD
  // ---------------------------------

  function getSelectedPeriod() {

    const periodInput =
      document.getElementById(
        "rental-period"
      );

    if (!periodInput) {
      return "";
    }

    return periodInput.value;
  }


  // ---------------------------------
  // ADD TO CART BUTTONS
  // ---------------------------------

  const buttons =
    document.querySelectorAll(
      ".add-rental-button"
    );


  buttons.forEach(function (button) {

    button.addEventListener(
      "click",
      function () {

        const item = {
          id:
            button.dataset.id,

          name:
            button.dataset.name,

          priceDay:
            button.dataset.priceDay || "",

          price3Days:
            button.dataset.price3Days || "",

          price7Days:
            button.dataset.price7Days || ""
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

      }
    );

  });


  // ---------------------------------
  // CART CONTAINER
  // ---------------------------------

  const cartContainer =
    document.getElementById(
      "rental-cart-items"
    );


  // ---------------------------------
  // UPDATE FORM EQUIPMENT FIELD
  // ---------------------------------

  function updateEquipmentField(
    cart,
    period
  ) {

    const equipmentField =
      document.getElementById(
        "cart-equipment"
      );


    if (!equipmentField) {
      return;
    }


    equipmentField.value =
      cart
        .map(function (item) {

          let text =
            item.name;

          if (period) {

            const price =
              getItemPrice(
                item,
                period
              );

            text +=
              " — " +
              getPeriodLabel(period);

            if (price !== "") {

              text +=
                " — " +
                formatPrice(price);

            }

          }

          return text;

        })
        .join(", ");
  }


  // ---------------------------------
  // DISPLAY CART
  // ---------------------------------

  function displayCart(
    forcedPeriod
  ) {

    if (!cartContainer) {
      return;
    }


    const cart =
      getCart();


    const period =
      forcedPeriod ||
      getSelectedPeriod();


    updateEquipmentField(
      cart,
      period
    );


    cartContainer.innerHTML = "";


    if (cart.length === 0) {

      cartContainer.innerHTML =
        '<p class="empty-cart">No equipment selected.</p>';

      return;
    }


    let total = 0;


    cart.forEach(function (item) {

      const row =
        document.createElement(
          "div"
        );

      row.className =
        "rental-cart-row";


      // ---------------------------------
      // ITEM NAME + PRICE
      // ---------------------------------

      const name =
        document.createElement(
          "span"
        );

      name.className =
        "rental-cart-name";


      let itemText =
        item.name;


      if (period) {

        const price =
          getItemPrice(
            item,
            period
          );

        itemText +=
          " — " +
          getPeriodLabel(period);


        if (price !== "") {

          itemText +=
            " — " +
            formatPrice(price);

          total +=
            Number(price);

        }

      }


      name.textContent =
        itemText;


      // ---------------------------------
      // REMOVE BUTTON
      // ---------------------------------

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

          displayCart(
            getSelectedPeriod()
          );

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


    // ---------------------------------
    // TOTAL
    // ---------------------------------

    if (period) {

      const totalRow =
        document.createElement(
          "div"
        );

      totalRow.className =
        "rental-cart-total";

      totalRow.textContent =
        "TOTAL — " +
        formatPrice(total);

      cartContainer.appendChild(
        totalRow
      );

    }

  }


  // ---------------------------------
  // RENTAL PERIOD BUTTONS
  // ---------------------------------

  const periodButtons =
    document.querySelectorAll(
      ".rental-duration-option"
    );


  periodButtons.forEach(
    function (button) {

      button.addEventListener(
        "click",
        function () {

          /*
            Use the period directly from
            the button because the separate
            date script updates the hidden
            field independently.
          */

          displayCart(
            button.dataset.period
          );

        }
      );

    }
  );


  // ---------------------------------
  // PREVENT SUBMIT WITHOUT PERIOD
  // ---------------------------------

  const rentalForm =
    document.getElementById(
      "rental-request-form"
    );


  if (rentalForm) {

    rentalForm.addEventListener(
      "submit",
      function (event) {

        const cart =
          getCart();

        const period =
          getSelectedPeriod();


        if (cart.length === 0) {

          event.preventDefault();

          alert(
            "Please add equipment to your rental."
          );

          return;
        }


        if (!period) {

          event.preventDefault();

          alert(
            "Please select a rental period."
          );

        }

      }
    );

  }


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


  // ---------------------------------
  // INITIAL LOAD
  // ---------------------------------

  displayCart();

  updateCartCount();

});
