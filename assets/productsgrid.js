document.addEventListener("DOMContentLoaded", function (event) {
    const productsgrid = document.querySelector('.productsgrid');
    if( productsgrid ) {
        const productsgrid__item = productsgrid.querySelectorAll('.productsgrid__item');
        if( productsgrid__item ) {
            productsgrid__item.forEach( (element) => {
                manipulateProduct(element);
            } );
        }
    }
});

const serializeForm = function (form) {
	var obj = {};
	var formData = new FormData(form);
	for (var key of formData.keys()) {
		obj[key] = formData.get(key);
	}
	return obj;
};

const callBackAddTocart = async (data) => {
    try {
        const setting = {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        };
        const uri = window.Shopify.routes.root + "cart/add.js";
        const response = await fetch(uri, setting);
        return [response, response.json()];
    } catch(error){
        if(error){
            throw new Error(error);
        }
    }
};

const addToCartAjax = async (e) => {
    e.preventDefault();
    try {
        let form = serializeForm(e.target);
        const respose = await callBackAddTocart(form);
        console.log(respose);
    } catch(error) {
        throw new Error(error);
    }
    const event = new Event('onaddtocartmystore');
    document.dispatchEvent(event);
};

const manipulateProduct = (item) => {
    let main_image = item.querySelector('.productsgrid__item--image');
    let formAddToCart = item.querySelector('.productsgrid__item_form');
    let optionsContainer = item.querySelector('.productsgrid__item--options');
    let optionsItems = optionsContainer.querySelectorAll('.productsgrid__item--items');
    if(optionsItems){
        optionsItems.forEach( (el) => {
            let option = el.querySelector('img');
            if(option){
                option.addEventListener('mouseover', (e) => handleOnHover(e, main_image));
                option.addEventListener('mouseout', (e) => handleOnHover(e, main_image));
                option.addEventListener('click', (e) => handleOnClick(e, main_image, formAddToCart));
            }
        } );
    }

    ["mouseup", "keyup"].map( (i) => {
        formAddToCart.querySelector('input[type="number"]').addEventListener(i, validateCant);
    } );
};

const handleOnHover = (event, mainImage) => {
    let imageSelected = event.target.src;
    let currentImage = mainImage.dataset.original;
    let visibleImage = (event.type == "mouseover") ? imageSelected : currentImage;
    mainImage.src = visibleImage;
}

const handleOnClick = (event, mainImage, form) => {
    let imageSelected = event.target.src;
    mainImage.dataset.original = imageSelected;
    let stock = parseInt(event.target.dataset.stock);
    form.querySelector('input[name="id"]').setAttribute("value", event.target.dataset.id);
    if( stock == 0 ){
        form.querySelector('button[type="submit"]').setAttribute("disabled", true);
    } else {
        form.querySelector('button[type="submit"]').removeAttribute("disabled");
    }
};

const validateCant = (e) => {
    let value = parseInt(e.target.value);
    console.log(value);
    if(value == 0){
        toastr.warning('No puedes elegir menos de un producto');
        e.target.value = 1;
        return false;
    }
};