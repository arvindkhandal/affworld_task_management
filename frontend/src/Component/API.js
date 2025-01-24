const BASE_URL = 'https://affworld-task-management-t2wg.vercel.app/api/v1/';
export const CREATE_USER = `${BASE_URL}users/register`;
export const LOGIN_USER = `${BASE_URL}users/login`;
export const FORGOT_PASSWORD = `${BASE_URL}users/forgotPassword`;
export const RESET_PASSWORD = `${BASE_URL}users/resetPassword`;
export const CREATE_TASK = `${BASE_URL}task/createTask/`;
export const GET_ALL_TASKS = `${BASE_URL}task/tasks`;
export const UPDATE_TASK = `${BASE_URL}task/getTaskById/`;
export const DELETE_TASK = `${BASE_URL}task/getTaskById/`;
export const GET_TASK_BY_ID = `${BASE_URL}task/getTaskById/`;
export const CREATE_POST = `${BASE_URL}post/createPost/`;
export const GET_ALL_POSTS = `${BASE_URL}post/getAllPost`;
export const DELETE_POST = `${BASE_URL}post/postById/`;
export const GOOGLE_AUTH_URL = `${BASE_URL}users/auth/google`;

