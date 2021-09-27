var GasLimit = {
    // addLiquidity: 3600000,
    // addLiquidityETH: 3800000,
    // removeLiqulity: 800000,
    // transitForBSC: 70000,
    // transitETHForBSC: 50000,
    // withdrawFromBSC: 120000,
    // withdrawTransitToken: 1500000,
    // paybackTransit: 81000,
    // mintReward: 300000,
    // collectReward: 180000,
    // deposit: 160000,
    // withdraw: 120000,
    // vote: 160000,
    // swapExactTokensForETH: 2300000,
    // swapExactTokensForTokens: 2300000,
    // swapExactETHForTokens: 2300000,
    // swapTokensForExactTokens: 2300000,
    // swapTokensForExactETH: 2300000,
    // swapETHForExactTokens: 2300000,
    // approve: 76000
};

export function getGasLimit(name) {
    return GasLimit[name];
}
