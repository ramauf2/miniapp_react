declare module 'tonweb' {
    export default class TonWeb {
        static utils: {
            fromNano(value: string | number): string;
            toNano(value: string | number): string;
        };
    }
}
