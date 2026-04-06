export default class Trades {
    static create(bearerToken: string): Promise<any>;
    static status(bearerToken: string): Promise<any>;
    static info(bearerToken: string, code: string): Promise<any>;
    static connectToTrade(bearerToken: string, code: string): Promise<any>;
    static getLastHistory(bearerToken: string): Promise<any>;
    static getUserHistory(bearerToken: string, page?: int|null): Promise<any>;
    static update(bearerToken: string, postData: object): Promise<any>;
}
