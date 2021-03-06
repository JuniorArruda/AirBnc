const url = "https://api.sheety.co/30b6e400-9023-4a15-8e6c-16aa4e3b1e72"

var request = new XMLHttpRequest()
request.open('GET', url)
request.responseType = 'json'
request.send()
request.onload = function () {

    let dropdown = document.getElementById("dropDownType")
    dropdown.addEventListener('change', reloadItens)

    let types = []
    request.response.forEach(element => {
        if (!types.includes(element.property_type)) {
            types.push(element.property_type)
            var type_item = document.createElement("option")
            type_item.classList.add('dropdown-item')
            type_item.setAttribute("href", "#")
            type_item.setAttribute("value", element.property_type)
            type_item.innerHTML = element.property_type
            dropdown.appendChild(type_item)

        }
    })

    reloadItens()

}

function reloadItens() {

    // clear itens div
    document.querySelectorAll('.card').forEach(_ => _.remove())

    // get user itens per page limit
    let itensPerPageElement = document.getElementById("dropDownPerPageItens")
    itensPerPageElement.addEventListener('change', reloadItens)
    let itensCountMax = itensPerPageElement.value

    // paging system
    let itensTotal = request.response.filter(typesOfitems).length
    let pagesTotal = itensTotal / itensCountMax

    var pagingLinks = document.getElementById('pagingLinks')
    document.querySelectorAll('li').forEach(_ => _.remove())
    let count;
    for (count = 0; count < pagesTotal; count++) {

        let lilink = document.createElement("li")
        let link = document.createElement("a")
        link.classList.add('page-link')
        link.setAttribute("href", "#")
        pageNumber = count + 1
        link.innerHTML = pageNumber
        link.addEventListener('click', reloadItens)
        lilink.appendChild(link)
        pagingLinks.appendChild(lilink)
    }

    // draw each card filtered by type
    request.response.filter(typesOfitems).forEach((item, index) => {
        if (index < itensCountMax) {
            var item_div = document.createElement("div")
            item_div.classList.add('col-md-4')
            item_div.classList.add('card')

            var item_img = document.createElement("img")
            item_img.setAttribute("src", `${item.photo}`)
            item_img.setAttribute("width", 349)
            item_img.setAttribute("height", 349)

            var item_type_node = document.createTextNode(`${item.property_type}`);
            var item_type = document.createElement("div");
            item_type.classList.add('item_type')
            item_type.appendChild(item_type_node);

            var item_description_node = document.createTextNode(`${item.name}`)
            var item_description = document.createElement("div")
            item_description.classList.add("item_description")
            item_description.appendChild(item_description_node)

            var price_node = document.createTextNode(`Reservar por R$ ${item.price}`)
            var price = document.createElement("button");
            //price.setAttribute("href", "#")
            //price.setAttribute("class", "btn btn-info btn-lg")
            price.setAttribute("class", "btn btn-primary")
            price.setAttribute("data-toggle", "modal")
            price.setAttribute("data-target", "#myModal")
            price.setAttribute("data-price", item.price)
            price.classList.add("price")
            price.appendChild(price_node)

            item_div.appendChild(item_type)
            item_div.appendChild(item_img)
            item_div.appendChild(item_description)
            item_div.appendChild(price)

            var element = document.getElementById('item_list')
            element.appendChild(item_div)
        }

    })
}

function typesOfitems(item) {
    let dropdown = document.getElementById("dropDownType")
    if (dropdown.value == "Selecione tipo") { return true }
    return item.property_type == dropdown.value
}

let dateToday = new Date()
document.getElementById('checkInDate').valueAsDate = dateToday

let tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
document.getElementById('checkOutDate').valueAsDate = tomorrow

$('#myModal').on('show.bs.modal', function (event) {

    let button = $(event.relatedTarget)
    let price = button.data('price')
    let modal = $(this)

    function calcTotal() {
        let date1 = new Date(document.getElementById("checkInDate").value)
        let date2 = new Date(document.getElementById("checkOutDate").value)
        let Difference_In_Time = date2.getTime() - date1.getTime();
        let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
        let totalValue = Difference_In_Days * price
        modal.find('#valueTotal').text(`Total da reserva R$${totalValue},00`)
    }
    calcTotal()

    $('#calcButton').on('click', function () {
        calcTotal()


    })


})







