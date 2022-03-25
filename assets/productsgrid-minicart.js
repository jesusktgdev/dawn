const manipulateCartItem = (element) => {
    const productsgrid_minicart__container_items__element_options = element.querySelector('.productsgrid-minicart__container_items__element_options');
    const productsgrid_minicart__container_items__element_options__cant = productsgrid_minicart__container_items__element_options.querySelector('.productsgrid-minicart__container_items__element_options--cant');

    const idproduct = productsgrid_minicart__container_items__element_options__cant.dataset.id;
    
    //Button aumentar
    const btnUp = productsgrid_minicart__container_items__element_options__cant.querySelector('button[data-action="up"]');

    //Button disminuir
    const btnDown = productsgrid_minicart__container_items__element_options__cant.querySelector('button[data-action="down"]');
    
    //Button remover
    const btnRemover = productsgrid_minicart__container_items__element_options__cant.querySelector('button[data-action="remove"]');

    const inputNumber = productsgrid_minicart__container_items__element_options__cant.querySelector('input[type="number"]');

    btnUp.addEventListener('click', (e) => {handleOnClickCant(e, inputNumber, idproduct)});

    btnDown.addEventListener('click', (e) => {handleOnClickCant(e, inputNumber, idproduct)});

    btnRemover.addEventListener('click', (e) => {removeFromCart(e, idproduct)});
    
};

const replaceSectionHtml = (selector, newHtml) => {
    let parent = selector.parentNode;
    let newDiv = document.createElement('div');
    newDiv.innerHTML = newHtml;
    //parent.removeChild(selector);
    //parent.appendChild(newDiv);

    const nuevo = new DOMParser()
        .parseFromString(newHtml, 'text/html')
        .querySelector('.productsgrid-minicart__container_items').innerHTML;

    selector.querySelector('.productsgrid-minicart__container_items').innerHTML = nuevo;

    setTimeout( () => initApp(), 500 );
};

const reloadSection = async () => {
    try {
        const setting = {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        };
        const uri = "/?sections=productsgrid-minicart";
        let htmlDocument = document.querySelector('#shopify-section-productsgrid-minicart');
        let productsgrid_minicart = document.querySelector('#productsgrid-minicart');
        fetch(uri, setting).then(resp => resp.json()).then( response => {
            replaceSectionHtml(htmlDocument, response['productsgrid-minicart']);
        });
    } catch(error){
        if(error){
            throw new Error(error);
        }
    }
};

const removeFromCart = async (e, idproduct) => {
    
    try {
        handleLoading(true);
        const [request, data] = await callBackChangeCant(idproduct, 0);
        
        if(request.ok){
            handleLoading(false);
            reloadSection();
        }

    } catch (error){
        console.log(error);
    }
};


const handleOnClickCant = async (e, input, idproduct) => {
    let action = e.target.dataset.action;
    let value = input.value;
    let valueNumber = parseInt(value);
    let newVal = 0;
    
    switch(action){
        case "up":
            newVal = valueNumber + 1; 
            break;
        case "down":
            newVal = valueNumber - 1;
            break;
    }

    input.setAttribute('value', newVal);

    console.log(e.target, newVal, input);


    try {
        
        handleLoading(true);
        const [request, data] = await callBackChangeCant(idproduct, newVal);
        
        if(request.ok){
            handleLoading(false);
            reloadSection();
        }

    } catch (error){
        console.log(error);
    }
};

const handleLoading = ( show ) => {
    let minicart = document.querySelector("#productsgrid-minicart");
    let minicart__container = minicart.querySelector(".productsgrid-minicart__container");
    let minicart__loading = minicart__container.querySelector('.productsgrid-minicart__container_items_loading');
    if( show ){
        minicart__loading.classList.add('show');
    } else {
        minicart__loading.classList.remove('show');
    }
};

const callBackChangeCant = async (id, cant) => {
    try {
        const update = {};
        update[id] = cant;

        const setting = {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                updates: update
            })
        };
        const uri = window.Shopify.routes.root + "cart/update.js";
        const response = await fetch(uri, setting);
        return [response, response.json()];
    } catch(error){
        if(error){
            throw new Error(error);
        }
    }
};

const closeMinicart = (event, container) => {
    let productsgrid_minicart = document.querySelector('#productsgrid-minicart');
    productsgrid_minicart.classList.add('hidde');
    productsgrid_minicart.classList.remove('show');
};

const openMiniCart = (event, container) => {
    let productsgrid_minicart = document.querySelector('#productsgrid-minicart');
    productsgrid_minicart.classList.add('show');
    productsgrid_minicart.classList.remove('hidde');
};



const initApp = () => {

    const productsgrid_minicart_fire = document.querySelector('#productsgrid-minicart_fire');
    const productsgrid_minicart = document.querySelector("#productsgrid-minicart");
    const productsgrid_minicart__container = productsgrid_minicart.querySelector(".productsgrid-minicart__container");
    const productsgrid_minicart__container_items = productsgrid_minicart__container.querySelector(".productsgrid-minicart__container_items");
    const productsgrid_minicart__close = productsgrid_minicart__container.querySelector('.productsgrid-minicart__close');

    /**
     * Cuando haya boton de abrir
     * **/

    if( productsgrid_minicart_fire ){
        productsgrid_minicart_fire.addEventListener('click', (e) => openMiniCart(e, productsgrid_minicart));
    }

    /**
     * Cuando haya boton de cerrar
     * **/

    if( productsgrid_minicart__close ){
        productsgrid_minicart__close.addEventListener('click', (e) => closeMinicart(e, productsgrid_minicart));
    }

    /**
     * Cuando haya elementos en el carrito
     * **/

    if( productsgrid_minicart__container_items ){
        const productsgrid_minicart__container_items__element = productsgrid_minicart__container_items.querySelectorAll('.productsgrid-minicart__container_items__element');
        
        /**
         * Capturamos y recorremos los elementos del array
         * **/

        if( productsgrid_minicart__container_items__element ){
            productsgrid_minicart__container_items__element.forEach( ( cartItem, i ) => {
                manipulateCartItem( cartItem );
            } );
        }
    }

    document.addEventListener('onaddtocartmystore', (e) => {
        reloadSection();
        openMiniCart();
    });
};

document.addEventListener("DOMContentLoaded", function (event) {
    initApp();
});