import React, { createContext, useReducer } from "react";

const initialState = {
  categories: [],
  typeCategories: [],
  adminUsers: [],
  productsType: [],
  units: [],
  products: [],
};

export const DataContext = createContext(initialState);

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

      const updatedProductsType1 = state.typeCategories.map((productType) =>
        productType.categoryId === action.payload.categoryId
          ? {
              ...productType,
              ...action.payload,
              category: {
                ...productType.category,
                ...action.payload.category,
              },
            }
          : { ...productType }
      );

      // const updatedProductsType11 = state.typeCategories.map((productType) => {
      //   if (productType.categoryId === action.payload.categoryId) {
      //     return {
      //       ...productType,
      //       ...action.payload,
      //       category: {
      //         ...productType.category,
      //         ...action.payload.category,
      //       },
      //     };
      //   }

      //   return productType;
      // });

      return {
        ...state,
        categories: updatedCategory,
        typeCategories: updatedProductsType1,
      };

    case "DELETE_CATEGORY":
      const remainingCategories = state.categories.filter(
        (category) => category.categoryId !== action.payload
      );
      return {
        ...state,
        categories: remainingCategories,
      };

    //loại danh mục
    case "FETCH_TYPECATEGORIES":
      return {
        ...state,
        typeCategories: action.payload,
      };
    case "SET_TYPECATEGORIES":
      return {
        ...state,
        typeCategories: action.payload,
      };

    case "ADD_TYPECATEGORY":
      return {
        ...state,
        typeCategories: [...state.typeCategories, action.payload],
      };
    case "UPDATE_TYPECATEGORY":
      const updatedSub = state.typeCategories.map((category) =>
        category.TypeCategoryId === action.payload.TypeCategoryId
          ? { ...category, ...action.payload }
          : { ...category }
      );
      const updatedProducts = state.products.map((product) =>
        product.TypeCategoryId === action.payload.TypeCategoryId
          ? {
              ...product,
              type_category: {
                ...product.type_category,
                ...action.payload.type_category,
              },
            }
          : { ...product }
      );

      return {
        ...state,
        typeCategories: updatedSub,
        products: updatedProducts,
      };

    // case "DELETE_TYPECATEGORY":
    //   const remainingProductType = state.typeCategories.filter(
    //     (productType) => productType.TypeCategoryId !== action.payload
    //   );
    //   return {
    //     ...state,
    //     typeCategories: remainingProductType,
    //   };

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
    case "UPDATE_PRODUCTTYPE":
      const updatedType = state.productsType.map((category) =>
        category.productTypeId === action.payload.productTypeId
          ? { ...category, ...action.payload }
          : { ...category }
      );
      const updatedProductsOfType = state.products.map((product) =>
        product.productTypeId === action.payload.productTypeId
          ? {
              ...product,
              product_type: {
                ...product.product_type,
                ...action.payload.product_type,
              },
            }
          : { ...product }
      );

      return {
        ...state,
        productsType: updatedType,
        products: updatedProductsOfType,
      };

    //units
    case "FETCH_UNITS":
      return {
        ...state,
        units: action.payload,
      };

    case "SET_UNITS":
      return {
        ...state,
        units: action.payload,
      };
    case "ADD__UNIT":
      return {
        ...state,
        units: [action.payload, ...state.units],
      };
    case "UPDATE_UNIT":
      const updatedUnit = state.units.map((category) =>
        category.unitId === action.payload.unitId
          ? { ...category, ...action.payload }
          : { ...category }
      );
      const updatedProductsOfUnit = state.products.map((product) =>
        product.unitId === action.payload.unitId
          ? {
              ...product,
              unit: {
                ...product.unit,
                ...action.payload.unit,
              },
            }
          : { ...product }
      );

      return {
        ...state,
        units: updatedUnit,
        products: updatedProductsOfUnit,
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

const DataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <DataContext.Provider value={{ state, dispatch }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;
