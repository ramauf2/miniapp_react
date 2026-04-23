export interface Attribute {
    name: string,
    rarity: number,
    class: string,
}
export interface Attribute2 {
    name: string,
    rarity: number,
}
export interface Gift {
    id: number,
    title: string,
    num: string,
    img: string,
    animation: string,
    status: string,
    collection: string,
    price: any,
    attributes: Array<Attribute>,
    attributes2: {
        model: Attribute2,
        pattern: Attribute2,
        backdrop: Attribute2,
    }
}