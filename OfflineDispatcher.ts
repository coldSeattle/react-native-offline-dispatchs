import ApiMiddleware from './ApiMiddleware';
import NetStateService from './NetStateService';
import OfflineDispatcherStorageService from './OfflineDispatcherStorageService';
import { IOfflineDispatcher } from './share/alias-types';
import { isPlainAction, matchObjRefWith } from './share/validations';

let ThunkMiddleware = ApiMiddleware.getInstance();

const Storage = new OfflineDispatcherStorageService();

function matchObjMethodRefWith(str: string) {
    let test = str.match(/[^.]*$/gm);
    if (test && test[0]) {
        return test;
    }
    return null;
}

class OfflineDispatcher {
    netState: boolean = false;
    constructor() {}

    private useDispatch() {
        const dispatch = ApiMiddleware.getInstance().Dispatcher.useDispatch();
        return dispatch;
    }

    private async dispatchPlainAction({ actionString = null, payload, id }: IOfflineDispatcher) {
        let dispatch = this.useDispatch();
        const actionsDataFromStore = await Storage.getStoredActions();
        const wasActionStored = actionsDataFromStore?.find(item => item.id == id);
        if (wasActionStored && actionString == null) {
            await Storage.removeActionFromStore({ id });
        }
        return () => dispatch(payload);
    }

    private async storePlainAction({ actionString, payload, id }: IOfflineDispatcher) {
        return await Storage.storeAction({ actionString, payload, id });
    }

    private async storeThunkAction({ actionString, payload, id }: IOfflineDispatcher) {
        return await Storage.storeAction({ actionString, payload, id });
    }

    private dispatchWithThunk({ actionString, payload }) {
        const dispatch = this.useDispatch();
        const offlineActions = ThunkMiddleware.getThunks();

        const getObjRefFromString = matchObjRefWith(actionString);
        const getObjMethodRefFromString = matchObjMethodRefWith(actionString);
        const offlineActionsObjItem = offlineActions.find(item => {
            if (item[getObjRefFromString!![0]][getObjMethodRefFromString!![0]]) {
                return true;
            }
            return false;
        });
        let thunk = offlineActionsObjItem[getObjRefFromString!![0]][getObjMethodRefFromString!![0]];
        if (!thunk) {
            return () => null;
        }
        return async () => await dispatch(thunk(payload));
    }

    public async takeAction({ actionString, payload, id }: IOfflineDispatcher) {
        console.log('entry to take action', actionString);

        // @ts-ignore
        const isPlain = isPlainAction(actionString);

        let dispatchPlainAction = await this.dispatchPlainAction({ actionString, payload, id });

        let dispatchWithThunk = this.dispatchWithThunk({ actionString, payload });

        if (this.netState) {
            try {
                if (isPlain) {
                    return dispatchPlainAction();
                }
                if (!isPlain && dispatchWithThunk) {
                    await Storage.removeActionFromStore({ id });
                    const items = await Storage.getStoredActions();
                    console.log('items: ', items?.length, items);

                    await dispatchWithThunk();
                }
            } catch (error) {
                console.warn('net error', JSON.stringify(error), actionString);
            }
        } else {
            console.log('offline start');

            try {
                console.log('offline try');

                if (isPlain) {
                    await this.storePlainAction({ actionString: null, payload, id });
                }
                if (!isPlain) {
                    await this.storeThunkAction({ actionString, payload, id });
                }
            } catch (error) {
                return console.warn('undefined action type', error);
            }
        }
    }

    private async runStoredActions() {
        const getStoredActions = await Storage.getStoredActions();
        if (getStoredActions) {
            // let reversed = getStoredActions.reverse();
            for (let index = 0; index <= getStoredActions.length; index++) {
                await this.takeAction(getStoredActions[index]);
            }
        }
        return;
    }

    public async update(subject: NetStateService) {
        if (subject instanceof NetStateService) {
            this.netState = subject.netState;
            if (this.netState) {
                try {
                    await this.runStoredActions();
                } catch (error) {
                    return Error('error with dispatching thunks');
                }
            }
        }
    }
}

export default OfflineDispatcher;
