
interface TradeItem {
    img: string,
    title: string,
}

export interface TradeHistory {
    isCreator: boolean,
    user_items: TradeItem[],
    partner_items: TradeItem[],
    code: string,
    created_at: string,
    user: string,
    partner: string,
}