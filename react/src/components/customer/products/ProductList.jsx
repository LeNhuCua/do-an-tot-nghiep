import React from 'react'

const ProductList = ({children}) => {
  return (
    <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-8'>
        {
            children
        }
    </div>
  )
}

export default ProductList