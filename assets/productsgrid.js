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