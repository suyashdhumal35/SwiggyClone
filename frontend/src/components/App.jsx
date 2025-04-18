import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Nav from './Nav';
import Footer from './Footer';
import PrivateComponent from './PrivateComponent';
import { store } from '../redux/store';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// Lazy load components
const SignUp = lazy(() => import('./SignUp'));
const Login = lazy(() => import('./Login'));
const RestaurantList = lazy(() => import('./RestaurantList'));
const RestaurantDetails = lazy(() => import('./RestaurantDetails'));
const AddRestaurant = lazy(() => import('./AddRestaurant'));
const Cart = lazy(() => import('./Cart'));
const Grocery = lazy(() => import('./grocery/Grocery'));
// Add this import at the top
const GroceryDetails = lazy(() => import('./grocery/GroceryDetails'));



const App = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Provider store={store}>
                <BrowserRouter>
                    <div className='w-4/5 mx-auto'>
                        <Nav />
                    </div>
                    <Suspense fallback={
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    }>
                        <Routes>
                            <Route element={<PrivateComponent />}>
                                <Route path="/" element={<RestaurantList />} />
                                <Route path="/restaurant/:id" element={<RestaurantDetails />} />
                                <Route path='/add-restaurant' element={<AddRestaurant />} />
                                <Route path='/grocery' element={<Grocery />} />
                                {/* Product details page */}
                                <Route path='/grocery/product/:id' element={<GroceryDetails />} />
                                <Route path='/cart' element={<Cart />} />
                            </Route>

                            <Route path='/signup' element={<SignUp />} />
                            <Route path='/login' element={<Login />} />
                        </Routes>

                        {/* // Add this component just before the closing </Suspense> tag */}
                        <ToastContainer position="top-right" autoClose={3000} />

                    </Suspense>
                    <Footer />
                </BrowserRouter>
            </Provider>
        </div>
    );
};

export default App;