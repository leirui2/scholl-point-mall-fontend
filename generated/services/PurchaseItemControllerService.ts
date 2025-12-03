/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponse_boolean_ } from '../models/ApiResponse_boolean_';
import type { ApiResponse_PageResult_PurchaseRecordListVO_ } from '../models/ApiResponse_PageResult_PurchaseRecordListVO_';
import type { PurchaseItemRequest } from '../models/PurchaseItemRequest';
import type { PurchaseRecordQueryRequest } from '../models/PurchaseRecordQueryRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PurchaseItemControllerService {
    /**
     * purchaseItem
     * @param purchaseItemRequest purchaseItemRequest
     * @returns ApiResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static purchaseItemUsingPost(
        purchaseItemRequest: PurchaseItemRequest,
    ): CancelablePromise<ApiResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/purchase_record/addPurchaseItem',
            body: purchaseItemRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listAllRecord
     * @param purchaseRecordQueryRequest purchaseRecordQueryRequest
     * @returns ApiResponse_PageResult_PurchaseRecordListVO_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listAllRecordUsingPost(
        purchaseRecordQueryRequest: PurchaseRecordQueryRequest,
    ): CancelablePromise<ApiResponse_PageResult_PurchaseRecordListVO_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/purchase_record/listAllRecord',
            body: purchaseRecordQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}
