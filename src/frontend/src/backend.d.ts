import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface GenerationRecord {
    id: bigint;
    height: bigint;
    platform: string;
    imageUrl: string;
    timestamp: Timestamp;
    prompt: string;
    width: bigint;
}
export type Timestamp = bigint;
export interface backendInterface {
    deleteGenerationRecord(id: bigint): Promise<void>;
    getAllGenerationRecords(): Promise<Array<GenerationRecord>>;
    saveGenerationRecord(prompt: string, platform: string, imageUrl: string, width: bigint, height: bigint): Promise<void>;
}
