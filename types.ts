
export enum Page {
    HOME = 'home',
    INSTANCES = 'instances',
    MODS = 'mods',
    SETTINGS = 'settings',
    NEWS = 'news'
}

export type VersionType = 'release' | 'snapshot' | 'old_beta' | 'old_alpha';
export type LoaderType = 'Vanilla' | 'Fabric' | 'Forge' | 'Quilt';

export interface User {
    username: string;
    uuid: string;
    accessToken: string;
    type: 'offline' | 'amethyst';
}

export interface Version {
    id: string;
    type: VersionType;
    url: string;
    time: string;
    releaseTime: string;
}

export interface VersionManifest {
    latest: {
        release: string;
        snapshot: string;
    };
    versions: Version[];
}

export interface Instance {
    id: string;
    name: string;
    version: string;
    type: LoaderType;
    lastPlayed: string;
    icon: string;
    color: string;
}

export interface Mod {
    id: string;
    name: string;
    version: string;
    author: string;
    enabled: boolean;
    description: string;
}

export interface LauncherSettings {
    ram: number;
    javaPath: string;
    closeOnLaunch: boolean;
    gamePath: string;
    theme: 'dark' | 'light';
    rpcEnabled: boolean;
    showSnapshots: boolean;
    showOldVersions: boolean;
    language?: 'en' | 'ru';
}

export interface LaunchConfig {
    versionId: string;
    loaderType: LoaderType;
    username: string;
    uuid: string;
    accessToken: string;
    memory: number;
    gamePath: string;
    javaPath: string;
    versionJsonUrl: string;
}

export interface NewsItem {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    date: string;
}
