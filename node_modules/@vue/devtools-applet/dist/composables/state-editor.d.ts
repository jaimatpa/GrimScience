import { Ref } from 'vue';

interface StateEditorContext {
    nodeId: string;
    inspectorId: string;
    disableEdit: boolean;
}
export declare function createStateEditorContext(initial: StateEditorContext): {
    context: Ref<{
        nodeId: string;
        inspectorId: string;
        disableEdit: boolean;
    }>;
};
export declare function useStateEditorContext(): Ref<StateEditorContext>;
export type EditorInputValidType = 'number' | 'string' | 'object' | 'null';
export type EditorAddNewPropType = 'object' | 'array';
export declare function useStateEditor(): {
    editingText: Ref<string>;
    editing: Ref<boolean>;
    toggleEditing(t?: EditorInputValidType): void;
    editingType: Ref<EditorInputValidType>;
    nodeId: string;
};
export declare function useStateEditorDrafting(): {
    addNewProp: (type: EditorAddNewPropType, data: any) => void;
    resetDrafting: () => void;
    draftingNewProp: Ref<{
        enable: boolean;
        key: string;
        value: string;
    }>;
};
export {};
