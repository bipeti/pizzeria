import { useDispatch } from "react-redux";
import { CartState, cartActions } from "../../store/cart-slice";
import { Collapsible } from "../Layout/Collapsible";
import Cart from "./Cart";
import Extras from "./Extras";
import FoodItem from "./FoodItem";
import classes from "./Foods.module.css";
import { useState } from "react";
import { useSelector } from "react-redux";

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
    hasChildrenServingSize: boolean;
    priceOfChildrenServingSize?: number;
    varieties?: Details[]; // e.g. different sizes of pizzas
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
        hasChildrenServingSize: false,
        varieties: [
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
            { id: 6, name: "sonka", price: 200 },
            { id: 7, name: "szalámi", price: 180 },
            { id: 8, name: "fűszeres kolbász", price: 220 },
            { id: 9, name: "kukorica", price: 120 },
            { id: 10, name: "olívaolaj", price: 100 },
            { id: 11, name: "rozmaring", price: 50 },
            { id: 12, name: "fokhagyma", price: 50 },
            { id: 13, name: "jalapeno", price: 150 },
            { id: 14, name: "olívabogyó töltelékkel", price: 300 },
            { id: 15, name: "szárított paradicsom", price: 180 },
            { id: 16, name: "parmezán sajt", price: 250 },
            { id: 17, name: "rucola", price: 120 },
            { id: 18, name: "paprika", price: 80 },
            { id: 19, name: "kapor", price: 70 },
            { id: 20, name: "mozzarella", price: 200 },
            { id: 21, name: "feta sajt", price: 280 },
            { id: 22, name: "szósz extra mennyiség", price: 50 },
            { id: 23, name: "cheddar sajt", price: 240 },
            { id: 24, name: "bazsalikom", price: 60 },
            { id: 25, name: "sült hagyma", price: 100 },
        ],
        packigingFee: 100,
    },
    {
        id: 2,
        name: "Dante pokla",
        description:
            "csípős paradicsomszósz, bacon, kolbász, csípős pepperoni paprika, hegyes erős, mozzarella sajt",
        group: "Pizza",
        hasChildrenServingSize: false,
        varieties: [
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
        hasChildrenServingSize: true,
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
        hasChildrenServingSize: true,
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
        hasChildrenServingSize: true,
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
        hasChildrenServingSize: true,
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
        hasChildrenServingSize: false,
        packigingFee: 200,
    },
    {
        id: 8,
        name: "Tiramisu",
        description: "Kávé, vanília fagyi, babapiskóta",
        group: "Sütemény",
        price: 780,
        hasChildrenServingSize: true,
        priceOfChildrenServingSize: 100,
        packigingFee: 100,
    },
];

const Foods = () => {
    const dispatch = useDispatch();

    const [showExtrasModal, setShowExtrasModal] = useState(false);
    const [foodWidthExtras, setFoodWidthExtras] = useState<Food | null>();
    const [priceId, setPriceId] = useState<number | undefined>();

    const hideModalHandler = () => {
        setShowExtrasModal(false);
    };

    const showModalHandler = () => {
        setShowExtrasModal(true);
    };

    const cartItems = useSelector(
        (state: { cart: CartState }) => state.cart.items
    );

    const addToCart = (food: Food, selectedPriceId: number | undefined) => {
        /* If there is any extra belonging to the food or there is 
        children_serving_size available, then we show the Extras modal, else
        we just add it to the cart.*/
        let isModal = false;
        isModal =
            (food.extras !== undefined && food.extras.length > 0) ||
            food.hasChildrenServingSize;
        if (isModal) {
            setFoodWidthExtras(food);
            setPriceId(selectedPriceId);
            showModalHandler();
        } else {
            const existingItem = cartItems.find(
                (item) => item.foodId === food.id
            );

            if (existingItem) {
                dispatch(
                    cartActions.increaseItemInCart({ id: existingItem.id })
                );
            } else {
                dispatch(
                    cartActions.addItemToCart({
                        id: "", // it recalculated in cart-slice
                        foodId: food.id,
                        foodName: food.name,
                        price: food.price!, // in this scenario (no modal) it has to has price
                        chosenChildrenServingSize: false,
                        packingFee: food.packigingFee,
                        varietyName: "",
                        extras: [],
                        quantity: 1,
                    })
                );
            }
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
                <ul className={classes.products}>
                    {uniqueGroups.map((group) => (
                        <li key={group}>
                            <Collapsible title={group} isOpened={false}>
                                <ul className={classes.foodList}>
                                    {DUMMY_PRODUCTS.filter(
                                        (food) => food.group === group
                                    ).map((food) => (
                                        <li
                                            key={food.id}
                                            className={classes.elements}
                                        >
                                            <FoodItem
                                                food={food}
                                                onAddToCart={addToCart}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </Collapsible>
                        </li>
                    ))}
                </ul>
                <Cart />
            </div>
        </>
    );
};

export default Foods;
