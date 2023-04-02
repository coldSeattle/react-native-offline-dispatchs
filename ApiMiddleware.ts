import Dispatcher from './Dispatcher';
import GraphqlClient from './GraphqlClient';
import { thunkStringType } from './share/alias-types';

type thunksType = any;

interface IApiMiddleware<D, G> {
    Dispatcher: Dispatcher<D>;
    mutableArray: thunksType;
    GraphqlClient: GraphqlClient<G>;
    addToThunksMiddleWareCollection: (action: any) => void;
    removeThunkFromThunkMiddlewareCollection: (action: any) => void;
    getSpecificThunk: (id: any) => { id: string; thunk: thunkStringType } | undefined;
    getThunks: () => thunksType[];
    setOfflineActions: (actions: any) => void;
    onCrash: () => {};
}

class ApiMiddleware<D, G> {
    public static thunks: thunksType[] = [];
    private static instance: IApiMiddleware<D, G> = {
        Dispatcher: new Dispatcher(),
        GraphqlClient: new GraphqlClient(),
        mutableArray: ApiMiddleware.thunks,
        addToThunksMiddleWareCollection: ApiMiddleware.addToThunksMiddleWareCollection,
        removeThunkFromThunkMiddlewareCollection: ApiMiddleware.removeThunkFromThunkMiddlewareCollection,
        getSpecificThunk: ApiMiddleware.getSpecificThunk,
        getThunks: ApiMiddleware.getThunks,
        setOfflineActions: ApiMiddleware.setOfflineActions,
        // @ts-ignore
        onCrash: () => {},
    };
    private constructor() {}

    public static getInstance() {
        return ApiMiddleware.instance;
    }

    public static async onCrash() {
        return await ApiMiddleware.instance.onCrash();
    }

    public static addToThunksMiddleWareCollection({ id, action }) {
        console.log('add thusnk 1', typeof action, action);

        if (typeof action !== 'function') {
            return console.log('passed action is not a function');
        }
        const getThunk = ApiMiddleware.thunks.find(item => item.id == id);
        if (getThunk) {
            return console.warn('thunk already exits in collection as a middleware');
        }
        console.log('thunks', ApiMiddleware.thunks);
        ApiMiddleware.thunks.push({ id, thunk: action });
        console.log('thunks', ApiMiddleware.thunks);
    }

    public static removeThunkFromThunkMiddlewareCollection({ id, thunk }) {
        if (typeof thunk !== 'function') {
            return Error('passed action is not a function');
        }
        return ApiMiddleware.thunks.filter(item => item.id != id);
    }

    public static getSpecificThunk({ id }) {
        return ApiMiddleware.thunks.find(item => item.id == id);
    }

    public static getThunks() {
        return ApiMiddleware.thunks;
    }

    public static setOfflineActions(actions) {
        ApiMiddleware.thunks = [actions];
    }
}
export default ApiMiddleware;
