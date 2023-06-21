import { Collapsible } from "../Layout/Collapsible";
import Cart from "./Cart";
import Extras from "./Extras";
import FoodItem from "./FoodItem";
import classes from "./Foods.module.css";
import { useState } from "react";

export type Details = {
    id: number;
    name: string;
    price: number;
};

export type Food = {
    id: number;
    name: string;
    description: string; // e.g. ingredients
    group: string; // pizzas, soup, etc.
    price?: number;
    haveChildrenServingSize: boolean;
    priceOfChildrenServingSize?: number;
    prices?: Details[]; // e.g. different sizes of pizzas
    extras?: Details[]; // e.g. topping to pizza, or bread to sg. that is choosable to this
    packigingFee: number;
};

// type FoodsProps = {
//     result: Food[];
// };

const DUMMY_PRODUCTS: Food[] = [
    {
        id: 1,
        name: "Margaréta pizza",
        description: "paradicsomszósz, paradicsom, bazsalikom, kevert sajt",
        group: "Pizza",
        haveChildrenServingSize: false,
        prices: [
            { id: 1, name: "32 cm", price: 3440 },
            { id: 2, name: "45 cm", price: 5250 },
            { id: 3, name: "52 cm", price: 6550 },
        ],
        extras: [
            { id: 1, name: "lila hagyma", price: 50 },
            { id: 2, name: "paradicsom szeletek", price: 150 },
            { id: 3, name: "ananász", price: 150 },
            { id: 4, name: "gomba", price: 100 },
            { id: 5, name: "olivabogyó", price: 250 },
        ],
        packigingFee: 100,
    },
    {
        id: 2,
        name: "Dante pokla",
        description:
            "csípős paradicsomszósz, bacon, kolbász, csípős pepperoni paprika, hegyes erős, mozzarella sajt",
        group: "Pizza",
        haveChildrenServingSize: false,
        prices: [
            { id: 1, name: "32 cm", price: 3440 },
            { id: 2, name: "45 cm", price: 5250 },
        ],
        extras: [
            { id: 1, name: "lila hagyma", price: 50 },
            { id: 2, name: "paradicsom szeletek", price: 150 },
            { id: 3, name: "ananász", price: 150 },
            { id: 4, name: "gomba", price: 100 },
            { id: 5, name: "olivabogyó", price: 250 },
        ],
        packigingFee: 100,
    },
    {
        id: 3,
        name: "Falusi tyúkhúsleves",
        description: "leveshússal, vele főtt zöldségekkel és lúdgégetésztával",
        group: "Leves",
        price: 1580,
        haveChildrenServingSize: true,
        priceOfChildrenServingSize: 1100,
        extras: [{ id: 1, name: "csipőspaprika", price: 250 }],
        packigingFee: 200,
    },
    {
        id: 4,
        name: "Gulyásleves",
        description: "marhából",
        group: "Leves",
        price: 1980,
        haveChildrenServingSize: true,
        priceOfChildrenServingSize: 1400,
        extras: [
            { id: 1, name: "csipőspaprika", price: 250 },
            { id: 2, name: "kenyér szelet", price: 50 },
        ],
        packigingFee: 200,
    },
    {
        id: 5,
        name: "Paradicsomleves",
        description: "marhából",
        group: "Leves",
        price: 1980,
        haveChildrenServingSize: true,
        priceOfChildrenServingSize: 1400,
        extras: [
            { id: 1, name: "csipőspaprika", price: 250 },
            { id: 2, name: "kenyér szelet", price: 50 },
        ],
        packigingFee: 200,
    },
    {
        id: 6,
        name: "Fokhagymakrémleves",
        description: "marhából",
        group: "Leves",
        price: 1980,
        haveChildrenServingSize: true,
        priceOfChildrenServingSize: 1400,
        extras: [
            { id: 1, name: "csipőspaprika", price: 250 },
            { id: 2, name: "kenyér szelet", price: 50 },
        ],
        packigingFee: 200,
    },
    {
        id: 7,
        name: "Kőleves",
        description: "Kő, víz és még amit találunk a kamrában",
        group: "Leves",
        price: 980,
        haveChildrenServingSize: false,
        packigingFee: 200,
    },
    {
        id: 8,
        name: "Tiramisu",
        description: "Kávé, vanília fagyi, babapiskóta",
        group: "Sütemény",
        price: 780,
        haveChildrenServingSize: true,
        priceOfChildrenServingSize: 100,
        packigingFee: 100,
    },
];

const Foods = () => {
    const [showExtrasModal, setShowExtrasModal] = useState(false);
    const [foodWidthExtras, setFoodWidthExtras] = useState<Food | null>();
    const [priceId, setPriceId] = useState<number | undefined>();

    const hideModalHandler = () => {
        setShowExtrasModal(false);
    };

    const showModalHandler = () => {
        setShowExtrasModal(true);
    };

    const addToCart = (food: Food, selectedPriceId: number | undefined) => {
        /* If there is any extra belonging to the food or there is 
        children_serving_size available, then we show the Extras modal, else
        we just add it to the cart.*/
        let isModal = false;
        isModal =
            (food.extras !== undefined && food.extras.length > 0) ||
            food.haveChildrenServingSize;
        if (isModal) {
            setFoodWidthExtras(food);
            setPriceId(selectedPriceId);
            showModalHandler();
        }
    };

    const uniqueGroups = [
        ...new Set(DUMMY_PRODUCTS.map((product) => product.group)),
    ];

    return (
        <>
            {showExtrasModal && foodWidthExtras && (
                <Extras
                    onClose={hideModalHandler}
                    food={foodWidthExtras}
                    priceId={priceId}
                />
            )}
            <div className={classes.outer}>
                <div className={classes.products}>
                    {uniqueGroups.map((group) => (
                        <Collapsible title={group} isOpened={false}>
                            <ul>
                                {DUMMY_PRODUCTS.filter(
                                    (food) => food.group === group
                                ).map((food) => (
                                    <FoodItem
                                        food={food}
                                        onAddToCart={addToCart}
                                    />
                                ))}
                            </ul>
                        </Collapsible>
                    ))}
                </div>
                <Cart />
            </div>
        </>
    );
};

export default Foods;
