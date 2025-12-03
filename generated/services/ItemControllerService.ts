/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponse_boolean_ } from '../models/ApiResponse_boolean_';
import type { ApiResponse_Item_ } from '../models/ApiResponse_Item_';
import type { ApiResponse_ItemCategoryVO_ } from '../models/ApiResponse_ItemCategoryVO_';
import type { ApiResponse_long_ } from '../models/ApiResponse_long_';
import type { ApiResponse_PageResult_Item_ } from '../models/ApiResponse_PageResult_Item_';
import type { ApiResponse_PageResult_ItemCategoryVO_ } from '../models/ApiResponse_PageResult_ItemCategoryVO_';
import type { ApiResponse_PageResult_ItemVO_ } from '../models/ApiResponse_PageResult_ItemVO_';
import type { HotItemQueryRequest } from '../models/HotItemQueryRequest';
import type { ItemAddRequest } from '../models/ItemAddRequest';
import type { ItemQueryRequest } from '../models/ItemQueryRequest';
import type { ItemUpdateRequest } from '../models/ItemUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ItemControllerService {
    /**
     * addItem
     * @param itemAddRequest itemAddRequest
     * @returns ApiResponse_long_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static addItemUsingPost(
        itemAddRequest: ItemAddRequest,
    ): CancelablePromise<ApiResponse_long_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/item/add',
            body: itemAddRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * deleteItem
     * @param id id
     * @returns ApiResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static deleteItemUsingPost(
        id?: number,
    ): CancelablePromise<ApiResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/item/deleteItem',
            query: {
                'id': id,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getItemById
     * @param id id
     * @returns ApiResponse_ItemCategoryVO_ OK
     * @throws ApiError
     */
    public static getItemByIdUsingGet(
        id?: number,
    ): CancelablePromise<ApiResponse_ItemCategoryVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/item/getItemById',
            query: {
                'id': id,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * hotListItemByPage
     * @param hotItemQueryRequest hotItemQueryRequest
     * @returns ApiResponse_PageResult_ItemVO_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static hotListItemByPageUsingPost(
        hotItemQueryRequest: HotItemQueryRequest,
    ): CancelablePromise<ApiResponse_PageResult_ItemVO_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/item/hotListItemByPage',
            body: hotItemQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listItemByPage
     * @param itemQueryRequest itemQueryRequest
     * @returns ApiResponse_PageResult_Item_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listItemByPageUsingPost(
        itemQueryRequest: ItemQueryRequest,
    ): CancelablePromise<ApiResponse_PageResult_Item_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/item/listItemByPage',
            body: itemQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listItemByPageUser
     * @param itemQueryRequest itemQueryRequest
     * @returns ApiResponse_PageResult_ItemVO_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listItemByPageUserUsingPost(
        itemQueryRequest: ItemQueryRequest,
    ): CancelablePromise<ApiResponse_PageResult_ItemVO_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/item/listItemByPageUser',
            body: itemQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listItemCategoryByPage
     * @param itemQueryRequest itemQueryRequest
     * @returns ApiResponse_PageResult_ItemCategoryVO_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listItemCategoryByPageUsingPost(
        itemQueryRequest: ItemQueryRequest,
    ): CancelablePromise<ApiResponse_PageResult_ItemCategoryVO_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/item/listItemCategoryByPage',
            body: itemQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * updateItem
     * @param itemUpdateRequest itemUpdateRequest
     * @returns ApiResponse_Item_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateItemUsingPost(
        itemUpdateRequest: ItemUpdateRequest,
    ): CancelablePromise<ApiResponse_Item_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/item/update',
            body: itemUpdateRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * updateItemStatus
     * @param id id
     * @param status status
     * @returns ApiResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateItemStatusUsingPost(
        id?: number,
        status?: number,
    ): CancelablePromise<ApiResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/item/updateItemStatus',
            query: {
                'id': id,
                'status': status,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}
