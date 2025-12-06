/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponse_boolean_ } from '../models/ApiResponse_boolean_';
import type { ApiResponse_List_SignInRule_ } from '../models/ApiResponse_List_SignInRule_';
import type { ApiResponse_SignInRule_ } from '../models/ApiResponse_SignInRule_';
import type { SignInRuleAddRequest } from '../models/SignInRuleAddRequest';
import type { SignInRuleUpdateRequest } from '../models/SignInRuleUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SignInRuleControllerService {
    /**
     * addSignInRuleByAdmin
     * @param signInRuleAddRequest signInRuleAddRequest
     * @returns ApiResponse_SignInRule_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static addSignInRuleByAdminUsingPost(
        signInRuleAddRequest: SignInRuleAddRequest,
    ): CancelablePromise<ApiResponse_SignInRule_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/signInRule/admin/add',
            body: signInRuleAddRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * deleteSignInRuleByAdmin
     * @param id id
     * @returns ApiResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static deleteSignInRuleByAdminUsingPost(
        id: number,
    ): CancelablePromise<ApiResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/signInRule/admin/delete',
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
     * updateSignInRuleByAdmin
     * @param signInRuleUpdateRequest signInRuleUpdateRequest
     * @returns ApiResponse_SignInRule_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateSignInRuleByAdminUsingPost(
        signInRuleUpdateRequest: SignInRuleUpdateRequest,
    ): CancelablePromise<ApiResponse_SignInRule_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/signInRule/admin/update',
            body: signInRuleUpdateRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getSignInRuleDetail
     * @param id id
     * @returns ApiResponse_SignInRule_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static getSignInRuleDetailUsingPost(
        id?: number,
    ): CancelablePromise<ApiResponse_SignInRule_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/signInRule/getRuleDetail',
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
     * listSignInRules
     * @returns ApiResponse_List_SignInRule_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listSignInRulesUsingPost(): CancelablePromise<ApiResponse_List_SignInRule_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/signInRule/list',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}
