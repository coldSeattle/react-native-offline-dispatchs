import AsyncStorage from '@react-native-async-storage/async-storage';

import { actionsSessionKey } from './share/actionsSessionKey';
import { IOfflineDispatcher } from './share/alias-types';
import { isPlainAction } from './share/validations';
class OfflineDispatcherStorageService {
    private readyToStoreData({ actionString, payload, id }: IOfflineDispatcher) {
        const isPlain = isPlainAction(actionString);
        if (!isPlain) {
            return { actionString, payload, id };
        }
        if (isPlain) {
            return { action: null, payload, id };
        }
        Error('unknown action type');
        return;
    }

    public async storeAction({ actionString, payload, id }: IOfflineDispatcher) {
        const dataToStore = this.readyToStoreData({ actionString, payload, id });
        try {
            let update: any[] = [];

            const actionsData = await this.getStoredActions();

            if (actionsData == null) {
                update.push({ ...dataToStore });
            } else {
                const array = [...actionsData, { ...dataToStore }];
                update.push(...array);
            }
            console.log('get data to store new actionString', actionString);

            const jsonValue = JSON.stringify(update);
            await AsyncStorage.setItem(actionsSessionKey, jsonValue);
        } catch (e) {
            // saving error
        }
    }

    public async getStoredActions(): Promise<IOfflineDispatcher[] | null | undefined> {
        try {
            const jsonValue = await AsyncStorage.getItem(actionsSessionKey);
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
            // error reading value
        }
    }

    public async removeActionFromStore({ id }: any) {
        try {
            const actionsData = await this.getStoredActions();
            if (!actionsData) {
                return console.warn(`not found action by id:${id} in actions store in removeActionFromStore function`);
            }
            const filtered = actionsData.filter(item => {
                return item.id !== id;
            });

            const update = JSON.stringify(filtered);
            await AsyncStorage.setItem(actionsSessionKey, update);
            return;
        } catch (e) {
            console.warn('WARN: removeActionFromStore');

            // error reading value
        }
    }
}

export default OfflineDispatcherStorageService;
