/*
  * Author: Sameer Sitre
  * https://www.linkedin.com/in/sameersitre/
  * https://github.com/sameersitre
  * File Description:  
 */

import {
  PRODUCT_LIST,
  USER_CART,
  SIZE_FILTER,
  CART_REMOVE,
  MOVIE_DATA, TVSHOW_DATA, DETAILS_DATA, BUFFER_ENABLE, SEARCH_RESULTS
} from '../actions/types';

import Genres from '../../utils/Genres';
const initialState = {
  Genres,
  buffer_enable: true,
  user_cart: [{
    "id": 12,
    "title": "Cat Tee Black T-Shirt",
    "description": "4 MSL",
    "availableSizes": ["S", "XS"],
    "style": "Black with custom print",
    "price": 10.9,
    "installments": 9,
    "currencyId": "USD",
    "currencyFormat": "$",
    "isFreeShipping": true,
    "src_1": "/products/113_1.jpg",
    "src_2": "/products/113_2.jpg"
  },

  {
    "id": 13,
    "title": "Dark Thug Blue-Navy T-Shirt",
    "description": "",
    "availableSizes": ["M"],
    "style": "Front print and paisley print",
    "price": 29.45,
    "installments": 5,
    "currencyId": "USD",
    "currencyFormat": "$",
    "isFreeShipping": true,
    "src_1": "/products/114_1.jpg",
    "src_2": "/products/114_2.jpg"
  }],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case PRODUCT_LIST:
      return {
        ...state,
        product_list: action.payload,
      };
    case USER_CART:
      return {
        ...state,
        user_cart: action.payload,
      };
    case SIZE_FILTER:
      return {
        ...state,
        size_filter: action.payload,
      };
    case MOVIE_DATA:
      return {
        ...state,
        movie_data: action.payload,
      };
    case TVSHOW_DATA:
      return {
        ...state,
        tvshow_data: action.payload,
      };
    case DETAILS_DATA:
      return {
        ...state,
        details_data: action.payload,
      }
    case CART_REMOVE:
      return {
        ...state,
        cart_remove: action.payload,
      };
    case BUFFER_ENABLE:
      return {
        ...state,
        buffer_enable: action.payload,
      };
      case SEARCH_RESULTS:
        return {
          ...state,
          search_results: action.payload,
        };

    default:
      return state;
  }
}