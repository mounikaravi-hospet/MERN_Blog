import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// onAuthStateChanged -> whenever the auth state is changed by the user, login, logout, create account, the callback function is called

const useUser = () => {
    // store the current user state and keep track of whether or not we've already loaded the user
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    //isLoading is to check if the user state is null because we haven't loaded the user yet or if the user is not logged in

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(getAuth(), user => { //if the user is not logged in, the value will be null (we set the initial valu to be null in the use state)
            // if user is a firebase user object, it means that the user has logged in
           // unsubscribe -> function that onAuthStateChanged function returns that will allow us to cancel that subscription and avoid memory leaks
            setUser(user);
            setIsLoading(false);
        });

        return unsubscribe;
        //call this function when the component using this useUser hook, is removed from the dom, eg, if the user navigated away from the page
    }, [])

    return { user, isLoading }
}

export default useUser