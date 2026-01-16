"use client";

import { Provider } from "react-redux";
import { store } from "./store";
import { Toaster } from "react-hot-toast";

export const StoreProvider = ({children}) => {
    return (
    <Provider store={store}>
        {children}
        <Toaster position="top-right" reverseOrder={false} />
    </Provider>
);
};
