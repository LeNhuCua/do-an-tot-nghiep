import React, { useState, useEffect, useContext }  from 'react';
import Product from './Product';
import { DataContext } from '../../../context/DataContext';

function ProductList() {
  // const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // useEffect(() => {
  //   // Lấy danh sách sản phẩm từ API hoặc db
  //   const fetchProducts = async () => {
  //     const response = await fetch('/api/products');
  //     const data = await response.json();
  //     setProducts(data);
  //   };
  //   fetchProducts();
  // }, []);
  const { state, dispatch } = useContext(DataContext);
  const {products} = state;
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <input type="text" placeholder="Tìm kiếm" onChange={handleSearch} />
      {filteredProducts.map((product) => (
        <Product key={product.productId} product={products} />
      ))}
    </div>
  );
}

export default ProductList;
