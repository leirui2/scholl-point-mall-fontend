/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponse_int_ } from '../models/ApiResponse_int_';
import type { ApiResponse_PageResult_SignInRecord_ } from '../models/ApiResponse_PageResult_SignInRecord_';
import type { SignInRecordQueryRequest } from '../models/SignInRecordQueryRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SignInRecordControllerService {
    /**
     * listSignInRecordByPage
     * @param signInRecordQueryRequest signInRecordQueryRequest
     * @returns ApiResponse_PageResult_SignInRecord_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listSignInRecordByPageUsingPost(
        signInRecordQueryRequest: SignInRecordQueryRequest,
    ): CancelablePromise<ApiResponse_PageResult_SignInRecord_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/signInRecord/listSignInRecordByPage',
            body: signInRecordQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * signIn
     * @returns ApiResponse_int_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static signInUsingPost(): CancelablePromise<ApiResponse_int_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/signInRecord/signIn',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}
