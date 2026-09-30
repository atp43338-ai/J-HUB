import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

import Navbar from "../../home/components/Navbar";
import Footer from "../../home/components/Footer";

import CheckoutAddress from "../components/CheckoutAddress";
import CheckoutItems from "../components/CheckoutItems";
import CheckoutSummary from "../components/CheckoutSummary";
import PaymentMethod from "../components/PaymentMethod";

import { getAddresses } from "../../address/services/addressService";
import { createOrder } from "../../order/services/orderService";

import toast from "react-hot-toast";

function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

  // ITEMS RECEIVED FROM BUY NOW

  const buyNowItems = location.state?.items || [];

  // STATES

  const [addresses, setAddresses] = useState([]);

  const [selectedAddress, setSelectedAddress] =
    useState("");

  const [addressLoading, setAddressLoading] =
    useState(true);

  const [paymentMethod, setPaymentMethod] =
    useState("cod");

  const [placingOrder, setPlacingOrder] =
    useState(false);

  // CHECK CHECKOUT ITEMS

  useEffect(() => {
    if (!buyNowItems.length) {
      navigate("/products");
    }
  }, [buyNowItems.length, navigate]);

  // FETCH ADDRESSES

  useEffect(() => {
    const fetchAddresses = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setAddressLoading(true);

        const data = await getAddresses(token);

        const userAddresses =
          data.addresses || [];

        setAddresses(userAddresses);

        // Select default address
        const defaultAddress =
          userAddresses.find(
            (address) => address.isDefault
          );

        if (defaultAddress) {
          setSelectedAddress(
            defaultAddress._id
          );
        } else if (
          userAddresses.length > 0
        ) {
          setSelectedAddress(
            userAddresses[0]._id
          );
        }
      } catch (error) {
        console.error(
          "Failed to fetch addresses:",
          error
        );

        toast.error(
          error.message ||
            "Failed to load addresses"
        );
      } finally {
        setAddressLoading(false);
      }
    };

    fetchAddresses();
  }, [navigate]);

  // CONVERT PRODUCTS FOR CHECKOUT UI

  const items = buyNowItems.map((item) => ({
    id: item.product._id,
    name: item.product.name,
    image: item.product.images?.[0],
    size: item.size,
    quantity: item.quantity,
    price: item.product.price,
  }));

  // PRICE CALCULATION

  const subtotal = items.reduce(
    (total, item) =>
      total +
      item.price * item.quantity,
    0
  );

  const discount = 0;

  const tax = 0;

  const shipping = 0;

  const finalPrice =
    subtotal -
    discount +
    tax +
    shipping;

  // PLACE ORDER

  const handlePlaceOrder = async () => {
    // Check address

    if (!selectedAddress) {
      toast.error(
        "Please select an address"
      );
      return;
    }

    // Check payment method

    if (!paymentMethod) {
      toast.error(
        "Please select a payment method"
      );
      return;
    }

    // Check items

    if (!buyNowItems.length) {
      toast.error(
        "No products found"
      );
      return;
    }

    try {
      setPlacingOrder(true);

      // PREPARE ORDER DATA

      const orderData = {
        addressId: selectedAddress,

        paymentMethod:
          paymentMethod.toUpperCase(),

        items: buyNowItems.map((item) => ({
          productId: item.product._id,
          size: item.size,
          quantity: item.quantity,
        })),
      };

      console.log(
        "Order data:",
        orderData
      );

      // CREATE ORDER

      const data =
        await createOrder(orderData);

      console.log(
        "Order created:",
        data
      );

      // GO TO ORDER SUCCESS

      navigate("/order-success", {
        state: {
          orderId: data.order.orderId,
          total: data.order.total,
          status: data.order.status,
          paymentMethod:
            data.order.paymentMethod,
        },
      });

    } catch (error) {
      console.error(
        "Failed to place order:",
        error
      );

      toast.error(
        error.message ||
          "Failed to place order"
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  // EMPTY CHECKOUT

  if (!buyNowItems.length) {
    return null;
  }

  // UI

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">

      <Navbar />

      <main className="px-4 sm:px-6 lg:px-10 py-10">

        <div className="max-w-7xl mx-auto">

          {/* PAGE TITLE */}

          <div className="mb-8">

            <h1 className="text-3xl font-bold text-gray-900 !text-black">
              Checkout
            </h1>

            <p className="text-gray-500 mt-2">
              Complete your order by selecting
              your address and payment method.
            </p>

          </div>

          {/* CHECKOUT CONTENT */}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* LEFT SIDE */}

            <div className="lg:col-span-2 space-y-6">

              {/* ADDRESS */}

              <div className="bg-white rounded-xl shadow-sm border border-gray-200">

                <CheckoutAddress
                  addresses={addresses}
                  selectedAddress={
                    selectedAddress
                  }
                  setSelectedAddress={
                    setSelectedAddress
                  }
                  checkoutItems={
                    buyNowItems
                  }
                />

              </div>

              {/* ITEMS */}

              <div className="bg-white rounded-xl shadow-sm border border-gray-200">

                <CheckoutItems
                  items={items}
                />

              </div>

              {/* PAYMENT */}

              <div className="bg-white rounded-xl shadow-sm border border-gray-200">

                <PaymentMethod
                  paymentMethod={
                    paymentMethod
                  }
                  setPaymentMethod={
                    setPaymentMethod
                  }
                />

              </div>

            </div>

            {/* RIGHT SIDE */}

            <div className="lg:col-span-1">

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 sticky top-24">

                <CheckoutSummary
                  subtotal={subtotal}
                  discount={discount}
                  tax={tax}
                  shipping={shipping}
                  finalPrice={finalPrice}
                  onPlaceOrder={
                    handlePlaceOrder
                  }
                  placingOrder={
                    placingOrder
                  }
                />

              </div>

            </div>

          </div>

        </div>

      </main>

      <Footer />

    </div>
  );
}

export default Checkout;