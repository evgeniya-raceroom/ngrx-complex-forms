import { Injectable } from '@angular/core';
import { LineItemService } from '@core/services/line-item.service';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { AppState } from '@state/app.interfaces';
import { DeleteLineItem, DeleteLineItemFail, DeleteLineItemSuccess } from '@state/line-item/line-item.actions';
import { UpdateOrder } from '@state/order/order.actions';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, exhaustMap, map, mergeMap } from 'rxjs/operators';
import {
  LineItemActionTypes,
  LoadLineItem,
  LoadLineItemFail,
  LoadLineItemSuccess,
  LoadLineItemsFail,
  LoadLineItemsSuccess,
  UpsertLineItems,
  UpsertLineItemsFail,
  UpsertLineItemsSuccess
} from './line-item.actions';
import { LineItem } from './line-item.model';

@Injectable()
export class LineItemEffects {
  @Effect()
  delete: Observable<Action> = this.actions$
    .pipe(
      ofType<DeleteLineItem>(LineItemActionTypes.DeleteLineItem),
      map(action => action.payload.id),
      exhaustMap(id => this.service.delete(id)),
      map((id: number) => new DeleteLineItemSuccess({ id })),
      catchError(err => of(new DeleteLineItemFail()))
    );

  @Effect()
  load: Observable<Action> = this.actions$
    .pipe(
      ofType(LineItemActionTypes.LoadLineItems),
      exhaustMap(() => this.service.getLineItems()),
      map((lineItems: LineItem[]) => new LoadLineItemsSuccess({ lineItems: lineItems })),
      catchError(err => of(new LoadLineItemsFail()))
    );

  @Effect()
  loadById: Observable<Action> = this.actions$
    .pipe(
      ofType<LoadLineItem>(LineItemActionTypes.LoadLineItem),
      exhaustMap(action => this.service.getLineItem(action.payload.id)),
      map((lineItem: LineItem) => new LoadLineItemSuccess({ lineItem: lineItem })),
      catchError(err => of(new LoadLineItemFail()))
    );

  @Effect()
  upsertLineItems: Observable<Action> = this.actions$.pipe(
    ofType<UpsertLineItems>(LineItemActionTypes.UpsertLineItems),
    map(action => action.payload),
    mergeMap(payload =>
      forkJoin(payload.lineItems.map(lineItem => this.service.save(lineItem))).pipe(
        map(lineItems =>
          lineItems.map(lineItem => ({
            id: lineItem.id,
            changes: lineItem
          }))
        ),
        map(updates => new UpsertLineItemsSuccess({ lineItems: updates, order: payload.order })),
        catchError(err => of(new UpsertLineItemsFail()))
      )
    )
  );

  @Effect()
  updateOrderFromLineItemsSuccess: Observable<Action> = this.actions$
    .pipe(
      ofType<UpsertLineItemsSuccess>(LineItemActionTypes.UpsertLineItemsSuccess),
      map(action => ({
        ...action.payload.order,
        lineItemIds: action.payload.lineItems.map(lineItem => +lineItem.id)
      })),
      map(order => new UpdateOrder({ order }))
    );

  constructor(private actions$: Actions, private service: LineItemService, private store: Store<AppState>) {}
}
