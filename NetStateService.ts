interface INetStateService {
    attach(observer: Observer): void;
    detach(observer: Observer): void;
    notify(): void;
}

class NetStateService implements INetStateService {
    private static instance: NetStateService;

    private constructor() {}

    public static getInstance(): NetStateService {
        if (!NetStateService.instance) {
            NetStateService.instance = new NetStateService();
        }

        return NetStateService.instance;
    }

    public netState: boolean = false;

    private observers: Observer[] = [];

    public attach(observer: Observer): void {
        const isExist = this.observers.includes(observer);
        if (isExist) {
            return console.log('Subject: Observer has been attached already.');
        }

        console.log('Subject: Attached an observer.');
        this.observers.push(observer);
    }

    public detach(observer: Observer): void {
        const observerIndex = this.observers.indexOf(observer);
        if (observerIndex === -1) {
            return console.log('Subject: Nonexistent observer.');
        }

        this.observers.splice(observerIndex, 1);
        console.log('Subject: Detached an observer.');
    }

    public notify(): void {
        console.log('Subject: Notifying observers...');
        for (const observer of this.observers) {
            observer.update(this);
        }
    }

    public subscribe(state: boolean): void {
        this.netState = state;
        console.log('subscribe 1');

        this.notify();
    }
}

export interface Observer {
    update(subject: INetStateService): void;
}

export default NetStateService;
