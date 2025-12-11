/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponse_PayResultDTO_ } from '../models/ApiResponse_PayResultDTO_';
import type { ApiResponse_string_ } from '../models/ApiResponse_string_';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AliPayControllerService {
    /**
     * notify
     * @returns ApiResponse_string_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static notifyUsingPost(): CancelablePromise<ApiResponse_string_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/notify',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * generatePayQrCode
     * @param itemId itemId
     * @param num num
     * @returns ApiResponse_PayResultDTO_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static generatePayQrCodeUsingPost(
        itemId?: number,
        num?: number,
    ): CancelablePromise<ApiResponse_PayResultDTO_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/pay',
            query: {
                'itemId': itemId,
                'num': num,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * queryPayStatus
     * @param outTradeNo outTradeNo
     * @returns string OK
     * @returns any Created
     * @throws ApiError
     */
    public static queryPayStatusUsingPost(
        outTradeNo?: string,
    ): CancelablePromise<string | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/query',
            query: {
                'outTradeNo': outTradeNo,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}
