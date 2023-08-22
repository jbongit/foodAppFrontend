import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import "./Checkout.css";
import axios from "axios";
import CheckoutForm from "./CheckoutForm";
import { privateAxios } from "../../services/helper";

const data=localStorage.getItem('data');
const parsedData=JSON.parse(data);

console.log(parsedData.token);

const stripePromise = loadStripe(
  "ENTER_STRIPE_PUBLIC_KEY"
);

export default function Checkout() {

  const [clientSecret, setClientSecret] = useState("");
  const [cartItems, setCartItems] = useState([]);

  const config={
      headers:{
        'Authorization': 'Bearer ' +parsedData.token
      }
  }
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/customer/20/cartItems",config
        );
        setCartItems(response.data);
      } catch (error) {
        console.error("CartItems Error : ", error);
      }
    };
    fetchCartItems();
  }, []);

  useEffect(
    () => {
      if (cartItems.length > 0) {
        const formattedcartItems = cartItems.map((item) => ({
          cartItemId: item.cartItemId,
          quantity: item.quantity,
          custId:item.custId,
          product: item.product,
        }));

        console.log("Formatted" + formattedcartItems);
        const fetchClientSecret = async () => {
          try {
            const response = await axios.post(
              "http://localhost:8080/create-payment-intent",
              {
                items: formattedcartItems,
              }
            );
            setClientSecret(response.data.clientSecret);
          } catch (error) {
            // Handle any errors that occurred during the API request
            console.error("Error fetching client secret:", error);
          }
        };

        fetchClientSecret();
      }
    },
    [cartItems]
  );

  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="App">
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </div> 
  );
}
