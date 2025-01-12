declare global {
    namespace ReactNavigation {
        /**
         * @link https://reactnavigation.org/docs/typescript/#specifying-default-types-for-usenavigation-link-ref-etc
         */
        interface RootParamList extends RootStackParamList {}
    }
}

export type RootStackParamList = {
    Tabs: undefined;
    SketchPad: {
        imagePath: string;
    };
    AlbumScreens: {
        albumTitle: string;
    };
};
export type TabParamList = {
    Gallery: undefined;
    Camera: undefined;
    Video: undefined;
};
