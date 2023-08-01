import { useDispatch } from "react-redux";
import { CartState, cartActions } from "../../store/cart-slice";
import { Collapsible } from "../Layout/Collapsible";
import Cart from "./Cart";
import Extras from "./Extras";
import FoodItem from "./FoodItem";
import classes from "./Foods.module.css";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
    Food,
    FoodState,
    getFoodGroups,
    getFoods,
} from "../../store/food-slice";
import { AppDispatch } from "../../store";
import { ThreeCircles } from "react-loader-spinner";
import { getSortedFoodsForGroup } from "../utils/sortFoods";

const Foods = () => {
    const dispatch = useDispatch<AppDispatch>();

    const [showExtrasModal, setShowExtrasModal] = useState(false);
    const [foodWidthExtras, setFoodWidthExtras] = useState<Food | null>();
    const [priceId, setPriceId] = useState<number | undefined>();

    const cartItems = useSelector(
        (state: { cart: CartState }) => state.cart.items
    );
    const foodIsLoading = useSelector(
        (state: { food: FoodState }) => state.food.isLoading
    );
    const foods = useSelector((state: { food: FoodState }) => state.food.items);
    const foodGroups = useSelector(
        (state: { food: FoodState }) => state.food.foodGroups
    );

    useEffect(() => {
        if (foods.length > 1) {
            // it doesn't need to load the database on every visit on /foods site.
            return;
        }
        dispatch(getFoods());
        dispatch(getFoodGroups());
    }, [dispatch, foods.length]);

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
                        packingFee: food.packagingFee,
                        varietyName: "",
                        extras: [],
                        quantity: 1,
                    })
                );
            }
        }
    };

    const uniqueGroups = [...new Set(foods.map((food) => food.group))];

    const sortedFoodGroups = foodGroups
        .filter((group) => uniqueGroups.includes(group.name))
        .sort((a, b) => a.order - b.order);
    // const sortedFoodGroupNames = sortedFoodGroups.map((group) => group.name);

    return (
        <>
            {foodIsLoading && (
                <div className={classes.spinner}>
                    <ThreeCircles
                        height="100"
                        width="100"
                        color="#4fa94d"
                        wrapperStyle={{}}
                        wrapperClass=""
                        visible={true}
                        ariaLabel="three-circles-rotating"
                        outerCircleColor="black"
                        innerCircleColor="white"
                        middleCircleColor="red"
                    />
                </div>
            )}
            {!foodIsLoading && (
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
                            {sortedFoodGroups.map((group) => (
                                <li key={group.id}>
                                    <Collapsible
                                        title={group.name}
                                        isOpened={false}
                                        image={group.imageURL}
                                    >
                                        <ul className={classes.foodList}>
                                            {getSortedFoodsForGroup(
                                                foods,
                                                group.name
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
            )}
        </>
    );
};

export default Foods;
