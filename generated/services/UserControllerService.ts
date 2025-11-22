/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponse_boolean_ } from '../models/ApiResponse_boolean_';
import type { ApiResponse_long_ } from '../models/ApiResponse_long_';
import type { ApiResponse_PageResult_User_ } from '../models/ApiResponse_PageResult_User_';
import type { ApiResponse_User_ } from '../models/ApiResponse_User_';
import type { ApiResponse_UserLoginVO_ } from '../models/ApiResponse_UserLoginVO_';
import type { ApiResponse_UserUpdateVO_ } from '../models/ApiResponse_UserUpdateVO_';
import type { UpdateUserPsswordRequest } from '../models/UpdateUserPsswordRequest';
import type { UserLoginRequest } from '../models/UserLoginRequest';
import type { UserQueryRequest } from '../models/UserQueryRequest';
import type { UserRegisterRequest } from '../models/UserRegisterRequest';
import type { UserUpdateRequest } from '../models/UserUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserControllerService {
    /**
     * deleteUser
     * @param id id
     * @returns ApiResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static deleteUserUsingPost(
        id: number,
    ): CancelablePromise<ApiResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/admin/deleteUser',
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
     * getUserById
     * @param id id
     * @returns ApiResponse_User_ OK
     * @throws ApiError
     */
    public static getUserByIdUsingGet(
        id?: number,
    ): CancelablePromise<ApiResponse_User_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user/admin/getUserById',
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
     * listUsersByPage
     * @param userQueryRequest userQueryRequest
     * @returns ApiResponse_PageResult_User_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listUsersByPageUsingPost(
        userQueryRequest: UserQueryRequest,
    ): CancelablePromise<ApiResponse_PageResult_User_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/admin/listUsersByPage',
            body: userQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * resetPassword
     * @param id id
     * @returns ApiResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static resetPasswordUsingPost(
        id: number,
    ): CancelablePromise<ApiResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/admin/resetPassword',
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
     * updateUserByAdmin
     * @param userUpdateRequest userUpdateRequest
     * @returns ApiResponse_UserUpdateVO_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateUserByAdminUsingPost(
        userUpdateRequest: UserUpdateRequest,
    ): CancelablePromise<ApiResponse_UserUpdateVO_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/admin/update',
            body: userUpdateRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * updateUserRole
     * @param id id
     * @param role role
     * @returns ApiResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateUserRoleUsingPost(
        id: number,
        role: number,
    ): CancelablePromise<ApiResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/admin/updateUserRole',
            query: {
                'id': id,
                'role': role,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * updateUserStatus
     * @param id id
     * @param status status
     * @returns ApiResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateUserStatusUsingPost(
        id: number,
        status: number,
    ): CancelablePromise<ApiResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/admin/updateUserStatus',
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
    /**
     * getLoginUser
     * @returns ApiResponse_UserLoginVO_ OK
     * @throws ApiError
     */
    public static getLoginUserUsingGet(): CancelablePromise<ApiResponse_UserLoginVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user/getLoginUser',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getPublicUserInfoById
     * @param id id
     * @returns ApiResponse_UserLoginVO_ OK
     * @throws ApiError
     */
    public static getPublicUserInfoByIdUsingGet(
        id?: number,
    ): CancelablePromise<ApiResponse_UserLoginVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user/getPublicUserInfoById',
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
     * userLogin
     * @param userLoginRequest userLoginRequest
     * @returns ApiResponse_UserLoginVO_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static userLoginUsingPost(
        userLoginRequest: UserLoginRequest,
    ): CancelablePromise<ApiResponse_UserLoginVO_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/login',
            body: userLoginRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * logout
     * @returns ApiResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static logoutUsingPost(): CancelablePromise<ApiResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/logout',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * register
     * @param user user
     * @returns ApiResponse_long_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static registerUsingPost(
        user: UserRegisterRequest,
    ): CancelablePromise<ApiResponse_long_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/register',
            body: user,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * updateUser
     * @param userUpdateRequest userUpdateRequest
     * @returns ApiResponse_UserUpdateVO_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateUserUsingPost(
        userUpdateRequest: UserUpdateRequest,
    ): CancelablePromise<ApiResponse_UserUpdateVO_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/update',
            body: userUpdateRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * updateUserPassword
     * @param updateUserPsswordRequest updateUserPsswordRequest
     * @returns ApiResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateUserPasswordUsingPost(
        updateUserPsswordRequest: UpdateUserPsswordRequest,
    ): CancelablePromise<ApiResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/updateUserPassword',
            body: updateUserPsswordRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}
