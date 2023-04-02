interface IDispatchHandler {
    fnName: string;
    fn: () => void;
    args: {};
}

interface IApolloHandler {}

type IOfflineService = IDispatchHandler | IApolloHandler;
class OfflineService {
    constructor({}: IOfflineService) {}
}

export default OfflineService;
