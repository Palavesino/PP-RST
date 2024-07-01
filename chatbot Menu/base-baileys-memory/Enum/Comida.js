const Pizza = {
    PALETA_CON_QUESO: {
        denomination: 'Paleta con Queso',
        price: 3000,
        img: 'https://i.ytimg.com/vi/MelbCjeSZs8/maxresdefault.jpg',
        type: 'Pizza',
    },
    PEPPERONI: {
        denomination: 'Pepperoni',
        price: 3500,
        img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTI0-HmskFIOzX-o3_DTZdgLshMNluWvZpwAw&s',
        type: 'Pizza',
    },
    PIZZA_LOMO_CON_QUESO: {
        denomination: 'Pizza Lomo con Queso',
        price: 4000,
        img: 'https://statics.diariomendoza.com.ar/2022/11/6372933c489de.jpg',
        type: 'Pizza',
    }
};

const Hambuerguesas = {
    MEXICANA: {
        denomination: 'Mexicana',
        price: 8000,
        img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQygzm_Qp0eo_NU4FHZjs9PXFal9FgZBUMxSg&s',
        type: 'Hambuerguesas',
    },
    DOBLE_CARNE: {
        denomination: 'Doble Carne',
        price: 9500,
        img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYV2CdnEGHMIqS4Glfr_L6Rb191bVmUbfjrA&s',
        type: 'Hambuerguesas',
    },
    TRIPLE_CARNE_COMBO_MAX: {
        denomination: 'Triple Carne Combo Max',
        price: 10400,
        img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoD8sQXS55gzhrji4hXiQBTAKpKEWglKDZWQ&s',
        type: 'Hambuerguesas',
    }
};

const Pancho = {
    COMPLETO: {
        denomination: 'Completo',
        price: 2000,
        img: 'https://i.ytimg.com/vi/IaSBnh59Y6s/maxresdefault.jpg',
        type: 'Pancho',
    },
    MEXICANA: {
        denomination: 'Mexicana (Con papas fritas)',
        price: 2500,
        img: 'https://cdn.eldestapeweb.com/eldestape/042023/1682372654143.webp?cw=1064&ch=598&extw=jpg',
        type: 'Pancho',
    },
};

const Gaseosa = {
    PEPSI: {
        denomination: 'Pepsi',
        price: 2000,
        img: 'https://acdn.mitiendanube.com/stores/798/865/products/191400709-4fb36a71deb44e454317003783062639-1024-1024.jpg',
        type: 'Gaseosa',
    },
    COCA_COLA: {
        denomination: 'Coca Cola',
        price: 2500,
        img: 'https://acdn.mitiendanube.com/stores/798/865/products/195206782-a184200ebf78af6b4417031418538109-640-0.jpg',
        type: 'Gaseosa',
    },
    FANTA: {
        denomination: 'Fanta',
        price: 2000,
        img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdrATfwvipUXDUEa14Xy0rVHAJKM1b6lBf4Q&s',
        type: 'Gaseosa',
    },
    SPRITE: {
        denomination: 'Sprite',
        price: 2000,
        img: 'https://www.coca-cola.com/content/dam/onexp/gt/es/brands/sprite/sprite-2l.jpg',
        type: 'Gaseosa',
    }
};

module.exports = {
    Pancho,
    Pizza,
    Gaseosa,
    Hambuerguesas
};