interface LocaleSetting {
    id: string;
    firstDayOfWeek: number;
    masks: {
        L: string;
    };
}
declare const localeSettings: Record<string, LocaleSetting>;
export default localeSettings;
