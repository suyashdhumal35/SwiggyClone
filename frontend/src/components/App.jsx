import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Nav from './Nav';
import Footer from './Footer';
import SignUp from './SignUp';
import PrivateComponent from './PrivateComponent';
import Login from './Login';

import RestaurantList from "./RestaurantList";
import RestaurantDetails from "./RestaurantDetails";
import AddRestaurant from './AddRestaurant';
import Cart from './Cart';
import { store } from '../redux/store';
import { Provider } from 'react-redux';

const App = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Provider store={store}>
                <BrowserRouter>
                    <div className='w-4/5 mx-auto'>
                        <Nav />
                    </div>
                    <Routes>
                        <Route element={<PrivateComponent />} >
                            {/* Update this route to display ProductList instead */}
                            <Route path="/" element={<RestaurantList />} />
                            <Route path="/restaurant/:id" element={<RestaurantDetails />} />
                            <Route path='/add-restaurant' element={<AddRestaurant />} />
                            <Route path='/cart' element={<Cart />} />
                        </Route>

                        <Route path='/signup' element={<SignUp />} />
                        <Route path='/login' element={<Login />} />
                    </Routes>
                    <Footer />
                </BrowserRouter>
            </Provider>
        </div>
    );
};

export default App;
