import { Collapsible } from "../Layout/Collapsible";
import FoodItem from "./FoodItem";
import classes from "./Foods.module.css";

export type Details = {
    name: string;
    price: number;
};

export type Food = {
    id: number;
    name: string;
    description: string; // e.g. ingredients
    group: string; // pizzas, soup, etc.
    price?: number;
    haveChildrenSize: boolean;
    priceOfChildrenSize?: number;
    prices?: Details[]; // e.g. different sizes of pizzas
    extras: Details[]; // e.g. topping to pizza, or bread to sg. that is choosable to this
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
        haveChildrenSize: false,
        prices: [
            { name: "32 cm", price: 3440 },
            { name: "45 cm", price: 5250 },
        ],
        extras: [
            { name: "lila hagyma", price: 50 },
            { name: "paradicsom szeletek", price: 150 },
            { name: "ananász", price: 150 },
            { name: "gomba", price: 100 },
            { name: "olivabogyó", price: 250 },
        ],
    },
    {
        id: 2,
        name: "Dante pokla",
        description:
            "csípős paradicsomszósz, bacon, kolbász, csípős pepperoni paprika, hegyes erős, mozzarella sajt",
        group: "Pizza",
        haveChildrenSize: false,
        prices: [
            { name: "32 cm", price: 3140 },
            { name: "45 cm", price: 4250 },
        ],
        extras: [
            { name: "lila hagyma", price: 50 },
            { name: "paradicsom szeletek", price: 150 },
            { name: "ananász", price: 150 },
            { name: "gomba", price: 100 },
            { name: "olivabogyó", price: 250 },
        ],
    },
    {
        id: 3,
        name: "Falusi tyúkhúsleves",
        description: "leveshússal, vele főtt zöldségekkel és lúdgégetésztával",
        group: "Leves",
        price: 1580,
        haveChildrenSize: true,
        priceOfChildrenSize: 1100,
        extras: [{ name: "csipőspaprika", price: 250 }],
    },
    {
        id: 4,
        name: "Gulyásleves",
        description: "marhából",
        group: "Leves",
        price: 1980,
        haveChildrenSize: true,
        priceOfChildrenSize: 1400,
        extras: [
            { name: "csipőspaprika", price: 250 },
            { name: "kenyér szelet", price: 50 },
        ],
    },
];

const Foods = () => {
    const uniqueGroups = [
        ...new Set(DUMMY_PRODUCTS.map((product) => product.group)),
    ];

    return (
        <section className={classes.products}>
            <h2>Buy your favorite products</h2>
            <ul>
                {uniqueGroups.map((group) => (
                    <Collapsible title={group}>
                        {DUMMY_PRODUCTS.filter(
                            (food) => food.group === group
                        ).map((food) => (
                            <FoodItem food={food} />
                        ))}
                    </Collapsible>
                ))}
            </ul>
        </section>
    );
};

export default Foods;
