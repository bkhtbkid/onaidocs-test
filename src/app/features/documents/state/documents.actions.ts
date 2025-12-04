import {createActionGroup, emptyProps, props} from "@ngrx/store";
import {IDocument, IFilterDocuments} from '@app/features';

export const DocumentsActions = createActionGroup({
  source: "Documents",
  events: {
    "Load Documents": props<{ filters: IFilterDocuments }>(),
    "Load Documents Success": props<{ items: IDocument[], total: number }>(),
    "Load Documents Error": props<{ error: string }>(),

    "Load Document": props<{ id: number }>(),
    "Load Document Success": props<{ document: IDocument }>(),
    "Load Document Error": props<{ error: string }>(),
    "Clear Selected Document": emptyProps(),
  }
});
