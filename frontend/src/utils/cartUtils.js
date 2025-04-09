export const addToCart = (product, qty = 1) => {
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

  const existingItem = cartItems.find(item => item._id === product._id);

  if (existingItem) {
    const newQty = existingItem.qty + qty;

    if (existingItem.qty >= product.countInStock) {
      return false; // Can't add more
    }

    existingItem.qty = newQty > product.countInStock 
      ? product.countInStock 
      : newQty;
  } else {
    cartItems.push({ ...product, qty });
  }

  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  return true;
};
