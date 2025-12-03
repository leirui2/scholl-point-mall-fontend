/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponse_boolean_ } from '../models/ApiResponse_boolean_';
import type { ApiResponse_Category_ } from '../models/ApiResponse_Category_';
import type { ApiResponse_long_ } from '../models/ApiResponse_long_';
import type { ApiResponse_PageResult_Category_ } from '../models/ApiResponse_PageResult_Category_';
import type { ApiResponse_PageResult_CategoryVO_ } from '../models/ApiResponse_PageResult_CategoryVO_';
import type { CategoryAddRequest } from '../models/CategoryAddRequest';
import type { CategoryQueryRequest } from '../models/CategoryQueryRequest';
import type { CategoryUpdateRequest } from '../models/CategoryUpdateRequest';
import type { HotCategoryQueryRequest } from '../models/HotCategoryQueryRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CategoryControllerService {
    /**
     * addCategory
     * @param categoryAddRequest categoryAddRequest
     * @returns ApiResponse_long_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static addCategoryUsingPost(
        categoryAddRequest: CategoryAddRequest,
    ): CancelablePromise<ApiResponse_long_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/category/add',
            body: categoryAddRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listCategoryByPage
     * @param categoryQueryRequest categoryQueryRequest
     * @returns ApiResponse_PageResult_Category_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listCategoryByPageUsingPost(
        categoryQueryRequest: CategoryQueryRequest,
    ): CancelablePromise<ApiResponse_PageResult_Category_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/category/admin/listCategoryByPage',
            body: categoryQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * deleteCategory
     * @param id id
     * @returns ApiResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static deleteCategoryUsingPost(
        id: number,
    ): CancelablePromise<ApiResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/category/deleteCategory',
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
     * getCategoryById
     * @param id id
     * @returns ApiResponse_Category_ OK
     * @throws ApiError
     */
    public static getCategoryByIdUsingGet(
        id?: number,
    ): CancelablePromise<ApiResponse_Category_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/category/getCategoryById',
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
     * hotCategoryByPage
     * @param hotCategoryQueryRequest hotCategoryQueryRequest
     * @returns ApiResponse_PageResult_CategoryVO_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static hotCategoryByPageUsingPost(
        hotCategoryQueryRequest: HotCategoryQueryRequest,
    ): CancelablePromise<ApiResponse_PageResult_CategoryVO_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/category/hotCategoryByPage',
            body: hotCategoryQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * updateCategory
     * @param categoryUpdateRequest categoryUpdateRequest
     * @returns ApiResponse_Category_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateCategoryUsingPost(
        categoryUpdateRequest: CategoryUpdateRequest,
    ): CancelablePromise<ApiResponse_Category_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/category/update',
            body: categoryUpdateRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}
