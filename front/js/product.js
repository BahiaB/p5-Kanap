let kanapData = [];
let str = window.location.href;
let url = new URL(str);
let id = url.searchParams.get("id"); 
let cart = [];


async function FetchData(){

    await fetch("http://localhost:3000/api/products")
    .then(response => response.json())
    .then((data) =>{
        kanapData = data;
        console.table(kanapData);
    })
}

// obtenir l'index (i) de l'élément en comparant les _id
function getIndex(){ 
    for (let i = 0 ; i < kanapData.length; i++)
    {
        if (id == kanapData[i]._id)
            //console.log(i);
            return(i);
    }
}

// affichage de l'image correspondant à l'index (i)
function displayImg(i){
   
    document.getElementsByClassName("item__img")[0].innerHTML= ` <img src=${kanapData[i].imageUrl} 
									alt=${kanapData[i].altTxt}> `;
}

// affichage du non de l'élément correspondant à l'index (i)
function displayTitle(i){

    document.getElementById("title").innerHTML = ` ${kanapData[i].name}`;
}

// affichage du prix correspondant à l'index (i)
function displayPrice(i){
    document.getElementById("price").innerHTML = ` ${kanapData[i].price}`;
}

// affichage de la description correspondant à l'index(i)
function displayDescription(i){
    document.getElementById("description").innerHTML = ` ${kanapData[i].description}`;
}

// Recuperation des couleurs dans le dom et les afficher
function displayColor(i){
    let colorStr =[];
    for (let colorIndex = 0; colorIndex < kanapData[i].colors.length; colorIndex++)
    {
        colorStr += `<option value="${kanapData[i].colors[colorIndex]}">${kanapData[i].colors[colorIndex]}`
    } 
    fullColorStr=   `<option value="">--SVP, choisissez une couleur --</option>` + colorStr;
    document.getElementById("colors").innerHTML = fullColorStr;
}

/* appel de chaque fonction Display */
async function displayAll(){ 
    await FetchData();
    let i = getIndex();
    displayImg(i);
    displayTitle(i);
    displayPrice(i);
    displayDescription(i);
    displayColor(i);
}


// check si l'element existe deja dans le panier.
function checkNewElem(newProduct){
    
	
    if (!localStorage[0])
        return(0);
    
    for (let i = 0; i < localStorage.length; i++)
    {
        let line = localStorage.getItem(i);
        line = JSON.parse(line)
        if (newProduct.productId == line.productId && newProduct.productColor == line.productColor)// si il existe comparer les id et les couleurs et update de la quantitée
        {
            /*console.log("meme id meme quantité")
            console.log(newProduct.productId)
            console.log(line.productId)
            console.log(newProduct.productQuantity)
            console.log(line.productQuantity)*/
            line.productQuantity = (parseInt(newProduct.productQuantity, 10 )+ parseInt(line.productQuantity, 10)).toString();
            //console.log(line.productQuantity)
            line = JSON.stringify(line)
            localStorage.setItem(i, line) 
           return(1);
        }
    }
    return(0);

}

// creation de l'objet  
function addToCart() {
    let colorChoice = document.querySelector("#colors").value;
    let quantityChoice = document.querySelector("#quantity").value;
	
	if((!colorChoice) || (quantityChoice <= 0 || quantityChoice >100))
		return(-1);

    let newProduct= 
    {
        productId: id,
        productColor: colorChoice,
        productQuantity: Number(quantityChoice)
    }
	
    let elemCart = JSON.stringify(newProduct);
    if (checkNewElem(newProduct) == 0 ) // si l'objet n'existe pas dans le localStorage on le crée ici
    {
        //console.log("ici");
        localStorage[localStorage.length]= elemCart;
        
    }
    window.confirm("L'article à bien été ajouté à votre panier ")
    console.log(localStorage);


}

//localStorage.clear();
displayAll();
let btn_AddToCart = document.getElementById("addToCart");
btn_AddToCart.addEventListener("click", addToCart);

