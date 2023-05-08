import React from 'react';
import { API_IMAGES } from '../../../API';

function Product(props) {
  const { product } = props;
  console.log(product);
  return (
    <div>
      <img src={`${API_IMAGES}/${product.avatar}`} alt={product.name} />
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p>{product.price}</p>
    </div>
  );
}

export default Product;
