import {createContext, memo, useCallback, useContext, useEffect, useState} from "react";
import {CartProductType} from "@/app/product/[productId]/ProductDetail";
import toast from "react-hot-toast";

type CartContextType = {
  cartTotalQty: number;
  cartTotalAmount: number;
  cartProducts: CartProductType[] | null;
  handleAddProductToCart: (product: CartProductType) => void;
  handleRemoveProductFromCart: (product: CartProductType) => void;
  handleCartQtyIncrease: (product: CartProductType) => void;
  handleCartQtyDecrease: (product: CartProductType) => void;
  handleClearCart: () => void;
  paymentIntent: string | null;
  handleSetPaymentIntent: (val: string | null) => void;
}

export const CartContext = createContext<CartContextType | null>(null);

interface Props {
  [propName: string]: any;
}

export const CartContextProvider = (props: Props) => {
  const [cartTotalQty, setCartTotalQty] = useState(0);
  const [cartTotalAmount, setCartTotalAmount] = useState(0);
  const [cartProducts, setCartProducts] = useState<CartProductType[] | null>(null);

  const [paymentIntent, setPaymentIntent] = useState<string | null>(null);

  useEffect(() => {
    const cartItems: any = localStorage.getItem('eShopCartItem');
    const cProducts: CartProductType[] | null = JSON.parse(cartItems);
    const eShopPaymentIntent: any = localStorage.getItem('sShopPaymentIntent');
    const paymentIntent: string | null = JSON.parse(eShopPaymentIntent);

    setCartProducts(cProducts);
    setPaymentIntent(paymentIntent);
  }, []);

  useEffect(() => {
    const getTotals = () => {
      if (cartProducts) {
        const { total, qty } = cartProducts?.reduce((acc, item) => {
          const itemTotal = item.price * item.quantity;

          acc.total += itemTotal;
          acc.qty += item.quantity;

          return acc;
        }, { total: 0, qty: 0 });
        setCartTotalQty(qty);
        setCartTotalAmount(total);
      }
    }
    getTotals();
  }, [cartProducts]);

  const handleAddProductToCart = useCallback((product: CartProductType) => {
    setCartProducts((prev) => {
      let updatedCart;

      if (prev) {
        updatedCart = [...prev, product]
      }
      else {
        updatedCart = [product];
      }
      localStorage.setItem('eShopCartItem', JSON.stringify(updatedCart));
      return updatedCart;
    });
    toast.success('Product added to cart');
  }, [cartProducts]);

  const handleRemoveProductFromCart = useCallback(( product: CartProductType ) => {
    if (cartProducts) {
      const filterProduct = cartProducts.filter(item => item.id !== product.id)
      setCartProducts(filterProduct);
      toast.success("Product removed");
      localStorage.setItem('eShopCartItem', JSON.stringify(filterProduct));
    }
  }, [cartProducts]);

  const handleCartQtyIncrease = useCallback((product: CartProductType) => {
    let updateCart;
    if (product.quantity === 99) {
      return toast.error("Ooop! Maximum reached");
    }
    if (cartProducts) {
      updateCart = [...cartProducts];

      const existingIndex = cartProducts.findIndex((item) => item.id === product.id);

      if (existingIndex > -1) {
        updateCart[existingIndex].quantity = updateCart[existingIndex].quantity + 1;
      }
      setCartProducts(updateCart);
      localStorage.setItem('eShopCartItem', JSON.stringify(updateCart));
    }
  }, [cartProducts]);

  const handleCartQtyDecrease = useCallback((product: CartProductType) => {
    let updateCart;
    if (cartProducts) {
      updateCart = [...cartProducts];

      if (product.quantity === 0) {
        updateCart = cartProducts.filter(item => item.id !== product.id);
        setCartProducts(updateCart);
        localStorage.setItem('eShopCartItem', JSON.stringify(updateCart));
      }

      const existingIndex = updateCart.findIndex((item) => item.id === product.id);
      if (existingIndex > -1) {
        updateCart[existingIndex].quantity = updateCart[existingIndex].quantity - 1;
      }

      setCartProducts(updateCart);
      localStorage.setItem('eShopCartItem', JSON.stringify(updateCart));
    }
  }, [cartProducts]);

  const handleClearCart = useCallback(() => {
    setCartProducts(null);
    setCartTotalQty(0);
    localStorage.setItem('eShopCartItem', JSON.stringify(null));
  }, []);

  const handleSetPaymentIntent = useCallback((val: string | null) => {
    setPaymentIntent(val);
    localStorage.setItem('sShopPaymentIntent', JSON.stringify(val));
  }, [paymentIntent]);

  const value = {
    cartTotalQty,
    cartProducts,
    handleAddProductToCart,
    handleRemoveProductFromCart,
    handleCartQtyIncrease,
    handleCartQtyDecrease,
    handleClearCart,
    cartTotalAmount,
    paymentIntent,
    handleSetPaymentIntent,
  }

  return <CartContext.Provider value={value} {...props} />
}

export const useCart = () => {
  const context = useContext(CartContext);

  if (context === null) throw new Error("useCart must be used within a CartContextProvider");

  return context;
}