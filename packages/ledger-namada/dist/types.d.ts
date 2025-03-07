/// <reference types="node" />
import { LedgerError } from './common';
export interface ResponseBase {
    errorMessage: string;
    returnCode: LedgerError;
}
export interface ResponseAddress extends ResponseBase {
    publicKey: Buffer;
    address: Buffer;
}
export interface ResponseVersion extends ResponseBase {
    testMode: boolean;
    major: number;
    minor: number;
    patch: number;
    deviceLocked: boolean;
    targetId: string;
}
export interface ResponseAppInfo extends ResponseBase {
    appName: string;
    appVersion: string;
    flagLen: number;
    flagsValue: number;
    flagRecovery: boolean;
    flagSignedMcuCode: boolean;
    flagOnboarded: boolean;
    flagPINValidated: boolean;
}
export interface ResponseDeviceInfo extends ResponseBase {
    targetId: string;
    seVersion: string;
    flag: string;
    mcuVersion: string;
}
export interface ResponseShieldedAddress extends ResponseBase {
    raw_pkd: Buffer;
    bech32m_len: number;
    bech32m_addr: Buffer;
}
export interface ResponseIncomingViewingKey extends ResponseBase {
    raw_ivk: Buffer;
}
export interface ResponseOutgoingViewingKey extends ResponseBase {
    raw_ovk: Buffer;
}
export interface ResponseNullifier extends ResponseBase {
    raw_nf: Buffer;
}
export interface ISignature {
    pubkey: Buffer;
    raw_salt: Buffer;
    raw_signature: Buffer;
    wrapper_salt: Buffer;
    wrapper_signature: Buffer;
    raw_indices: Buffer;
    wrapper_indices: Buffer;
}
export declare class Signature implements ISignature {
    pubkey: Buffer;
    raw_salt: Buffer;
    raw_signature: Buffer;
    wrapper_salt: Buffer;
    wrapper_signature: Buffer;
    raw_indices: Buffer;
    wrapper_indices: Buffer;
    isFilled: boolean;
    constructor(signature?: ISignature);
}
export interface ResponseSign extends ResponseBase {
    signature?: Signature;
}
