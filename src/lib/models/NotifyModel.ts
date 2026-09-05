export interface NotifyModel<T = undefined> {
    type: MessageTypes;
    message: string;
    stackTrace?: string;
    isSuccess?: boolean;
    isError?: boolean;
    object?: T;
}

export enum MessageTypes {
    success = 'Success',
    error = 'Error',
    warning = 'Warning',
    notFound = 'NotFound',
    accessDenied = 'AccessDenied',
};
