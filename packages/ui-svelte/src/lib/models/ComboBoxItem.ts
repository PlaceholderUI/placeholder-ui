import type { NotifyModel } from "./NotifyModel.js";

export interface ComboBoxGroup {
    label: string;
    items: ComboBoxItem[];
    showGroupName?: boolean;
}

export interface ComboBoxItem {
    label: string;
    value: string;
    href?: string;
    class?: string;
    selected?: boolean;
    component?: any;
    componentProps?: any;
    selectedComponent?: any;
    selectedComponentProps?: any;
    groupName?: string;
    imageSrc?: string;
    description?: string;
}

export type FetchFunctionType = (() => Promise<NotifyModel<ComboBoxItem[]>>);
export type SearchFunctionType = ((query: string) => Promise<NotifyModel<ComboBoxItem[]>>);
export type RetrieveLabelFunctionType = ((value: any) => Promise<NotifyModel<string | undefined>>);