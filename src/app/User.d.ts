export default class User {
    static login(refUser: string, initData?: string, testUser?: string | null): Promise<any>;
    static getUserData(bearerToken: string): Promise<any>;
    static withdraw(bearerToken: string|null, items: array, amount: string = '', address: string = ''): Promise<any>;
}
