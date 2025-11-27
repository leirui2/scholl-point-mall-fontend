/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FileInfo } from '../models/FileInfo';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FileDetailControllerService {
    /**
     * upload
     * @param file file
     * @returns FileInfo OK
     * @returns any Created
     * @throws ApiError
     */
    public static uploadUsingPost(
        file?: Blob,
    ): CancelablePromise<FileInfo | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/file/upload',
            body: file,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * uploadImage
     * @param file file
     * @returns FileInfo OK
     * @returns any Created
     * @throws ApiError
     */
    public static uploadImageUsingPost(
        file?: Blob,
    ): CancelablePromise<FileInfo | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/file/upload-image',
            body: file,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * uploadPlatform
     * @param file file
     * @returns FileInfo OK
     * @returns any Created
     * @throws ApiError
     */
    public static uploadPlatformUsingPost(
        file?: Blob,
    ): CancelablePromise<FileInfo | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/file/upload-platform',
            body: file,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * upload2
     * @param file file
     * @returns string OK
     * @returns any Created
     * @throws ApiError
     */
    public static upload2UsingPost(
        file?: Blob,
    ): CancelablePromise<string | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/file/upload2',
            body: file,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}
