// 'object.thunk-function'
export type thunkStringType = string;

type payload = string | number | [] | {};
export interface IOfflineDispatcher {
    actionString: thunkStringType | null;
    payload: payload;
    id: string;
}
