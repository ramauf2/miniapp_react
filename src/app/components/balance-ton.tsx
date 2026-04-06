import { useState } from 'react';
import User from '../User';
import { TON_WALLET } from '../../../config';
import {TonConnectUI} from "@tonconnect/ui";

interface BalanceTonProps {
    ui: TonConnectUI;
    handleCancelDeposit: () => void;
    blockhainBalance: any;
    localBalance: any;
}

export function BalanceTon({ui, handleCancelDeposit, blockhainBalance, localBalance}: BalanceTonProps) {
    const [amountDeposit, setAmountDeposit] = useState('');
    const [amountWithdraw, setAmountWithdraw] = useState('');
    const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');
    const handleDepositTon = () => {
        ui.sendTransaction({
            validUntil: Math.floor(Date.now() / 1000) + 300,
            messages: [{
                address: TON_WALLET,
                amount: (parseFloat(amountDeposit) * 1000000000).toString(),
                payload: localStorage.getItem('comment') ?? ''
            }],
        });
    }

    const handleWithdrawTon = () => {
        if (!ui.account) {
            return;
        }
        User.withdraw(localStorage.getItem('bearerToken'), [], amountWithdraw, ui.account.address).then(data => {
            if (data.success) {
                alert('Withdraw request success!');
            } else {
                alert(data.data);
            }
        });
    }

    const prepareAmount = (amount: string) => {
        let preparedAmount = amount.replace(',', '.');
        let m1 = preparedAmount.match(/\d+\.\d+/);
        let m2 = preparedAmount.match(/\d+\./);
        let m3 = preparedAmount.match(/\./);
        if (m1) {
            preparedAmount = m1[0];
        } else if (m2) {
            preparedAmount = m2[0];
        } else if (m3) {
            preparedAmount = '0' + m3[0];
        }
        return preparedAmount;
    }
    const prepareAmountDeposit = (amount: string) => {
        setAmountDeposit(prepareAmount(amount));
    }
    const prepareAmountWithdraw = (amount: string) => {
        let preparedAmount = prepareAmount(amount);
        if (parseFloat(preparedAmount) > parseFloat(localBalance)) {
            preparedAmount = localBalance;
        }
        setAmountWithdraw(preparedAmount);
    }

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md z-40" onClick={handleCancelDeposit} />

            {/* Modal */}
            <div className="fixed bottom-0 left-0 right-0 bg-[#1C1C1E] rounded-t-[30px] p-6 z-50 animate-slide-up max-w-[390px] mx-auto" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                {/* Toggle Tabs */}
                <div className="relative bg-[#303030] rounded-[25px] p-1 mb-6">
                    {/* Sliding Background */}
                    <div
                        className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#505050] rounded-[22px] transition-all duration-300 ease-in-out shadow-lg"
                        style={{
                            left: activeTab === 'deposit' ? '4px' : 'calc(50% + 0px)',
                        }}
                    />

                    {/* Buttons */}
                    <div className="relative flex">
                        <button
                            onClick={() => setActiveTab('deposit')}
                            className={`flex-1 h-[50px] rounded-[22px] text-[16px] font-semibold transition-colors duration-300 z-10 ${
                                activeTab === 'deposit' ? 'text-white' : 'text-[#999]'
                            }`}
                        >
                            Пополнение
                        </button>
                        <button
                            onClick={() => setActiveTab('withdraw')}
                            className={`flex-1 h-[50px] rounded-[22px] text-[16px] font-semibold transition-colors duration-300 z-10 ${
                                activeTab === 'withdraw' ? 'text-white' : 'text-[#999]'
                            }`}
                        >
                            Вывод
                        </button>
                    </div>
                </div>

                {activeTab === 'deposit' ? (
                    <>
                        {/* Deposit Section */}
                        <div className="bg-[#303030] rounded-[20px] p-5 mb-6">
                            <div className="mb-4">
                                <p className="text-[#999] text-[14px] mb-3">Сумма пополнения</p>
                                <div className="bg-[#1C1C1E] border-2 border-[#595959] rounded-[15px] h-[60px] px-4 flex items-center justify-between focus-within:border-[#007AFF] transition-colors">
                                    <input
                                        type="text"
                                        placeholder="0.0 TON"
                                        className="bg-transparent text-white text-[24px] outline-none flex-1 placeholder-[#595959]"
                                        value={amountDeposit}
                                        onChange={e => prepareAmountDeposit(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between bg-[#1C1C1E] rounded-[12px] p-3">
                                <span className="text-[#999] text-[14px]">Баланс в кошельке</span>
                                <span className="text-[#007AFF] text-[16px] font-semibold">{blockhainBalance} TON</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleCancelDeposit}
                                className="flex-1 bg-transparent border-2 border-[#999] rounded-[25px] h-[55px] text-[#999] text-[18px] font-semibold hover:border-white hover:text-white transition-colors"
                            >
                                Отмена
                            </button>

                            <button
                                onClick={handleDepositTon}
                                disabled={!amountDeposit || parseFloat(amountDeposit) <= 0}
                                className={`flex-1 rounded-[25px] h-[55px] text-white text-[18px] font-semibold transition-all ${
                                    !amountDeposit || parseFloat(amountDeposit) <= 0
                                        ? 'bg-[#515151] cursor-not-allowed'
                                        : 'bg-[#007AFF] hover:bg-[#0066CC]'
                                }`}
                            >
                                Пополнить
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Withdraw Section */}
                        <div className="bg-[#303030] rounded-[20px] p-5 mb-6">
                            <div className="mb-4">
                                <p className="text-[#999] text-[14px] mb-3">Сумма вывода</p>
                                <div className="bg-[#1C1C1E] border-2 border-[#595959] rounded-[15px] h-[60px] px-4 flex items-center justify-between focus-within:border-[#007AFF] transition-colors">
                                    <input
                                        type="text"
                                        placeholder="0.0 TON"
                                        className="bg-transparent text-white text-[24px] outline-none flex-1 placeholder-[#595959]"
                                        value={amountWithdraw}
                                        onChange={e => prepareAmountWithdraw(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between bg-[#1C1C1E] rounded-[12px] p-3">
                                <span className="text-[#999] text-[14px]">Баланс в системе</span>
                                <span className="text-[#007AFF] text-[16px] font-semibold">{localBalance} TON</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleCancelDeposit}
                                className="flex-1 bg-transparent border-2 border-[#999] rounded-[25px] h-[55px] text-[#999] text-[18px] font-semibold hover:border-white hover:text-white transition-colors"
                            >
                                Отмена
                            </button>

                            <button
                                onClick={handleWithdrawTon}
                                disabled={!amountWithdraw || parseFloat(amountWithdraw) <= 0}
                                className={`flex-1 rounded-[25px] h-[55px] text-white text-[18px] font-semibold transition-all ${
                                    !amountWithdraw || parseFloat(amountWithdraw) <= 0
                                        ? 'bg-[#515151] cursor-not-allowed'
                                        : 'bg-[#007AFF] hover:bg-[#0066CC]'
                                }`}
                            >
                                Вывести
                            </button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}