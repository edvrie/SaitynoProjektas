import React from "react";

interface ContextTyping {
    userData: {},
    setUserData: React.Dispatch<React.SetStateAction<{}>>
}

export const getUserData = () => {
    const data = localStorage.getItem("userData");
    const userData = data ? data.split(';') : null;
    return userData;
}

export const userContext = React.createContext<ContextTyping>({
    userData: {},
    setUserData: () => {}
});