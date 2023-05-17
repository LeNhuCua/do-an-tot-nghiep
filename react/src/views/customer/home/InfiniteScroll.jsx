import React, { useState, useEffect } from "react";
import { API } from "../../../API";

function InfiniteScroll() {
  const [isLoading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);

  useEffect(() => {
    loadMoreData();
  }, [page]);

  function loadMoreData() {
    setLoading(true);
    fetch(`${API}/api/cus-products/newProducts?page=${page}`)
      .then((response) => response.json())
      .then((result) => {
        if (result.data.length > 0) {
          setData([...data, ...result.data]);
          setPage(page + 1);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }

  return (
    <div>
      {data.map((item, index) => (
        <div className="h-[600px]" key={index}>
          <h2>{item.name}</h2>
          <p>{item.description}</p>
        </div>
      ))}
      {isLoading && data.length !== 0 && <div>Loading...</div>}
    </div>
  );
}

export default InfiniteScroll;
