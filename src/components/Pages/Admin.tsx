import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import {
    writeDummyDataToDatabase,
    writeDummyGroupsToDatabase,
} from "../../store/food-slice";

export default function Admin() {
    const dispatch = useDispatch<AppDispatch>();

    const dummyHandler = () => {
        dispatch(writeDummyDataToDatabase());
    };
    const dummyGroupHandler = () => {
        dispatch(writeDummyGroupsToDatabase());
    };

    return (
        <>
            <div>Admin section</div>
            <div>
                <button onClick={dummyHandler}>
                    Dummy_foods to database (result in console.log)
                </button>
            </div>
            <div>
                <button onClick={dummyGroupHandler}>
                    Dummy_food_groups to database (result in console.log)
                </button>
            </div>
        </>
    );
}
