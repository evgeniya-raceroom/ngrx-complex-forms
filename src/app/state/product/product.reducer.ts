import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Product } from './product.model';
import { ProductActions, ProductActionTypes } from './product.actions';

export interface State extends EntityState<Product> {
  // additional entities state properties
  selectedProductId: number;
  loading: boolean;
  error: string;
}

export const adapter: EntityAdapter<Product> = createEntityAdapter<Product>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  selectedProductId: null,
  loading: false,
  error: ''
});

export function reducer(state = initialState, action: ProductActions): State {
  switch (action.type) {
    case ProductActionTypes.AddProduct: {
      return adapter.addOne(action.payload.product, state);
    }

    case ProductActionTypes.UpsertProduct: {
      return adapter.updateOne(action.payload.product, state); // was upset
    }

    case ProductActionTypes.AddProducts: {
      return adapter.addMany(action.payload.products, state);
    }

    case ProductActionTypes.UpsertProducts: {
      return adapter.updateMany(action.payload.products, state); // was upset
    }

    case ProductActionTypes.UpdateProduct: {
      return adapter.updateOne(action.payload.product, state);
    }

    case ProductActionTypes.UpdateProducts: {
      return adapter.updateMany(action.payload.products, state);
    }

    case ProductActionTypes.DeleteProduct: {
      return adapter.removeOne(action.payload.product.id, state);
    }

    case ProductActionTypes.DeleteProducts: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case ProductActionTypes.LoadProducts: {
      return {
        ...adapter.removeAll(state),
        loading: true,
        error: ''
      };
    }

    case ProductActionTypes.LoadProductsSuccess: {
      return {
        ...adapter.addMany(action.payload.products, state),
        loading: false
      };
    }

    case ProductActionTypes.LoadProductsFail: {
      return {
        ...state,
        loading: false,
        error: 'error loading products'
      };
    }

    case ProductActionTypes.LoadProduct: {
      return {
        ...state,
        loading: true,
        error: ''
      };
    }

    case ProductActionTypes.LoadProductSuccess: {
      return {
        ...adapter.addOne(action.payload.product, state),
        selectedProductId: action.payload.product.id,
        loading: false
      };
    }

    case ProductActionTypes.LoadProductFail: {
      return {
        ...state,
        loading: false,
        error: 'error loading product'
      };
    }

    case ProductActionTypes.ClearProducts: {
      return adapter.removeAll(state);
    }

    default: {
      return state;
    }
  }
}

export const getSelectedId = (state: State) => state.selectedProductId;
export const getLoading = (state: State) => state.loading;
export const getError = (state: State) => state.error;
