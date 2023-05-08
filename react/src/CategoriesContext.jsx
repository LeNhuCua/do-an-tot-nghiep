import React, { createContext, useReducer } from "react";

const initialState = {
  categories: [],
  subcategories: [],
  adminUsers: [],
  productsType: [],
  units: [],
  products: [],
};

// const fetchCategories1 = async () => {
//   await axios.get(`${API}/api/categories/`).then(({ data }) => {
//     dispatch({ type: "FETCH_CATEGORIES", payload: data });
//   });
// };

export const CategoriesContext = createContext(initialState);

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_CATEGORIES":
      return {
        ...state,
        categories: action.payload,
      };
    case "SET_CATEGORIES":
      return {
        ...state,
        categories: action.payload,
      };
    case "ADD_CATEGORY":
      return {
        ...state,
        categories: [action.payload, ...state.categories],
      };
    case "UPDATE_CATEGORY":
      const updatedCategory = state.categories.map((category) =>
        category.categoryId === action.payload.categoryId
          ? { ...category, ...action.payload }
          : { ...category }
      );

      const updatedProductsType1 = state.subcategories.map((productType) => {
        if (productType.categoryId === action.payload.categoryId) {
          return {
            ...productType,
            ...action.payload,
            category: {
              ...productType.category,
              ...action.payload.category,
            },
          };
        }

        return productType;
      });

      return {
        ...state,
        categories: updatedCategory,
        subcategories: updatedProductsType1,
      };

    case "DELETE_CATEGORY":
      const remainingCategories = state.categories.filter(
        (category) => category.categoryId !== action.payload
      );
      return {
        ...state,
        categories: remainingCategories,
      };

    //
    case "FETCH_SUBCATEGORIES":
      return {
        ...state,
        subcategories: action.payload,
      };
    case "SET_SUBCATEGORIES":
      return {
        ...state,
        subcategories: action.payload,
      };

    case "ADD_SUBCATEGORY":
      return {
        ...state,
        subcategories: [...state.subcategories, action.payload],
      };
    case "UPDATE_SUBCATEGORY":
      const updatedproductsType = state.subcategories.map((productType) =>
        productType.categorySubId === action.payload.categorySubId
          ? {
              ...productType,
              ...action.payload,
            }
          : productType
      );
      return {
        ...state,
        subcategories: updatedproductsType,
      };

    case "DELETE_SUBCATEGORY":
      const remainingProductType = state.subcategories.filter(
        (productType) => productType.categorySubId !== action.payload
      );
      return {
        ...state,
        subcategories: remainingProductType,
      };

    //productsType

    case "FETCH_PRODUCTSTYPE":
      return {
        ...state,
        productsType: action.payload,
      };
    case "SET_PRODUCTSTYPE":
      return {
        ...state,
        productsType: action.payload,
      };
    case "ADD__PRODUCTTYPE":
      return {
        ...state,
        productsType: [action.payload, ...state.productsType],
      };
    // case "UPDATE_PRODUCTTYPE":
    //   const updatedProductType = state.categories.map((category) =>
    //     category.categoryId === action.payload.categoryId
    //       ? { ...category, ...action.payload }
    //       : { ...category }
    //   );

    //   const updatedProductType1 = state.subcategories.map((productType) => {
    //     if (productType.categoryId === action.payload.categoryId) {
    //       return {
    //         ...productType,
    //         ...action.payload,
    //         category: {
    //           ...productType.category,
    //           ...action.payload.category,
    //         },
    //       };
    //     }

    //     return productType;
    //   });

    //   return {
    //     ...state,
    //     categories: updatedProductType,
    //     subcategories: updatedProductType1,
    //   };

    // case "DELETE_CATEGORY":
    //   const remainingCategories1 = state.categories.filter(
    //     (category) => category.categoryId !== action.payload
    //   );
    //   return {
    //     ...state,
    //     categories: remainingCategories,
    //   };

    //units
    case "FETCH_UNITS":
      return {
        ...state,
        units: action.payload,
      };

    //products
    case "FETCH_PRODUCTS":
      return {
        ...state,
        products: action.payload,
      };
    case "SET_PRODUCTS":
      return {
        ...state,
        products: action.payload,
      };

    case "ADD_PRODUCTS":
      return {
        ...state,
        products: [action.payload, ...state.products],
      };
    case "UPDATE_PRODUCT":
      const updatedproducts = state.products.map((product) =>
        product.productId === action.payload.productId
          ? {
              ...product,
              ...action.payload,
            }
          : product
      );
      return {
        ...state,
        products: updatedproducts,
      };

    case "DELETE_PRODUCT":
      const remainingProduct = state.products.filter(
        (product) => product.productId !== action.payload
      );
      return {
        ...state,
        products: remainingProduct,
      };

    case "FETCH_ADMINUSER":
      return {
        ...state,
        adminUsers: action.payload,
      };
    case "SET_ADMINUSER":
      return {
        ...state,
        adminUsers: action.payload,
      };
    default:
      return state;
  }
};

const CategoriesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <CategoriesContext.Provider value={{ state, dispatch }}>
      {children}
    </CategoriesContext.Provider>
  );
};

export default CategoriesProvider;
