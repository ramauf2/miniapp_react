
interface UserItems {
    gifts: Array<number>,
    tons: string,
}
export interface TradeData {
    isCreator: boolean,
    code: string,
    user_items: UserItems,
    partner_items: UserItems,
    connected_at: string,
    user_accepted_at: string,
    partner_accepted_at: string,
    user: string,
    user_avatar: string,
    partner: string,
    partner_avatar: string,
    is_completed: boolean,
}