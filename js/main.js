const getProductData = () => {
  let productObject = {};
  let fields = document.querySelectorAll("form input[type='text']");

  fields.forEach((field) => {
    productObject[field.name] = field.value;
  });

  let select = document.getElementById("category");
  let category = select.options[select.selectedIndex].value;

  productObject = { ...productObject, category };
  saveProduct(productObject);

  fields.forEach((field) => {
    field.value = "";
  });
};

document
  .getElementById("save-product")
  .addEventListener("click", getProductData);

const saveProduct = (product) => {
  let xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      $("#save-succesful").modal("show");
      printCard(getProductsCollection());
    }
  };

  xhttp.open(
    "POST",
    "https://ajaxclass-1ca34.firebaseio.com/11g/room4/products.json",
    true
  );

  xhttp.send(JSON.stringify(product));
};

const getProductsCollection = () => {
  let productsCollection;
  let xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      productsCollection = JSON.parse(xhttp.response);
    }
  };

  xhttp.open(
    "GET",
    "https://ajaxclass-1ca34.firebaseio.com/11g/room4/products.json",
    false
  );
  xhttp.send();

  return productsCollection;
};

const deleteProduct = (event) => {
  let productKey = event.target.dataset.productKey;

  let xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      printCard(getProductsCollection());
    }
  };

  xhttp.open(
    "DELETE",
    `https://ajaxclass-1ca34.firebaseio.com/11g/room4/products/${productKey}.json`,
    false
  );
  xhttp.send();
};

const productFilter = (event) => {
  let selectCategory = event.target.value;

  let arrayProductos = getProductsCollection();
  let newArr = {};
  for (key in arrayProductos) {
    if (arrayProductos[key].category === selectCategory) {
      newArr = {
        ...newArr,
        [key]: arrayProductos[key],
      };
    }
  }
  selectCategory === "todas"
    ? printCard(getProductsCollection())
    : printCard(newArr);
};

const printCard = (dataToPrint) => {
  let cardContainer = document.getElementById("card-container");

  while (cardContainer.lastElementChild) {
    cardContainer.removeChild(cardContainer.lastElementChild);
  }

  for (key in dataToPrint) {
    let { category, description, image, name, price } = dataToPrint[key];

    let card = document.createElement("div");
    card.className = "card mt-2 col-12 col-lg-6 px-0";
    let inputImg = document.createElement("img");
    inputImg.className = "card-img-top h-80";
    let cardBody = document.createElement("div");
    cardBody.className = "card-body";

    let inputName = document.createElement("h4");
    inputName.className = "card-title font-weight-bold";
    let inputDescription = document.createElement("p");
    inputDescription.className = "card-text";
    let inputCategory = document.createElement("p");
    inputCategory.className = "card-text";
    let inputPrice = document.createElement("p");
    inputPrice.className = "card-text";
    //let imageText = document.createTextNode(image);
    inputImg.src = image;
    let nameText = document.createTextNode(name);
    let descriptionText = document.createTextNode(
      "Descripcion: " + description
    );
    let categoryText = document.createTextNode("Categoria: " + category);
    let priceText = document.createTextNode("Precio: $ " + price + " mxn");

    let deleteButton = document.createElement("button");
    deleteButton.classList = "btn btn-danger delete-button w-100";
    deleteButton.dataset.productKey = key;

    let buttonText = document.createTextNode("Borrar");
    inputName.appendChild(nameText);
    inputDescription.appendChild(descriptionText);
    inputPrice.appendChild(priceText);
    inputCategory.appendChild(categoryText);
    deleteButton.appendChild(buttonText);

    cardBody.appendChild(inputName);
    cardBody.appendChild(inputDescription);
    cardBody.appendChild(inputCategory);
    cardBody.appendChild(inputPrice);
    cardBody.appendChild(deleteButton);
    card.appendChild(inputImg);
    card.appendChild(cardBody);
    cardContainer.appendChild(card);
  }

  let buttons = document.querySelectorAll(".delete-button");

  buttons.forEach((button) => {
    button.addEventListener("click", deleteProduct);
  });
};

const selectElement = document.querySelector("#select-category");
selectElement.addEventListener("change", productFilter);

printCard(getProductsCollection());
