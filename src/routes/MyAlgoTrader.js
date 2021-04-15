import React, { Component, Suspense } from 'react';
import AppSettings from '../data/AppSettings';

const BrowseCoinsModal = React.lazy(() => import("../components/myAlgoTrader/BrowseCoinsModal"));

class MyAlgoTrader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            backTesting: props.backTesting || false,
            baseCoin: 'USDT',
            baseCoinBalance: 100,
            commissionRate: 0.001,
            buySellColType: 'auto',
            autoBuySellCheckFreq: 10, // in seconds
            autoBuySellMakeSureTimes: 3, // after N checks, if desired margin stays still > do the trade
            coins: [], // symbol list (which can be traded with USDT)
            coinsModalOpen: false,
            myCoins: []
        };
        this.interestedCoins = ["TLM", "XLMUP", "WAN", "XRPUP", "BTC", "ETH", "LTC", "BNB", "XRP", "ENJ", "ETC", "YFI", "DOGE", "EOSUP", "BEAM", "IOST", "ADAUP"];
        this.klineTypes = {
            last500kline: {
                each1min: ['1m', 500],   // last 8,33hours | 1min density 
                each3min: ['3m', 500],   // last 1,04days  | 3min density
                each5min: ['5m', 500],   // last 1,74days  | 5min density
                each15min: ['15m', 500], // last 5,20days  | 15min density
            },
            last1000kline: {
                each1min: ['1m', 1000],   // last 16,66hours | 1min density 
                each3min: ['3m', 1000],   // last 2,08days   | 3min density
                each5min: ['5m', 1000],   // last 3,47days   | 5min density
                each15min: ['15m', 1000], // last 10,41days  | 15min density
            },
            last24h: {
                each3min: ['3m', 480],  // last 24 hours | 3min density
                each5min: ['5m', 288],  // last 24 hours | 5min density
                each15min: ['15m', 96], // last 24 hours | 15min density
                each30min: ['30m', 48], // last 24 hours | 30min density
                each1h: ['1h', 24],     // last 24 hours | 1h density
            },
            last7d: {
                each15min: ['15m', 96 * 7], // last 7 days | 15min density
                each30min: ['30m', 48 * 7], // last 7 days | 30min density
                each1h: ['1h', 24 * 7],     // last 7 days | 1h density
            }
        };
        this.klineTypeSelection = 'last24h.each15min';
    }

    addCoinToMyCoins(coin) {
        const myNewCoin = {
            coinName: coin,
            symbol: coin + this.state.baseCoin,
            isActive: false, // true: we are in | false: we are out
            autoBuySell: false, // auto buy/sell feature active or not (for that coin)
            backTestRan: false,
            //buySellSurenessLevels: [5, 10, 15], // for margin %4 -> 4.2 | 4.4 | 4.6
            //surenessLevel: 0,
            initialPrice: null,
            buyCount: 0,
            initialBudgetInBaseCoin: Math.floor((this.state.baseCoinBalance - (this.state.baseCoinBalance * this.state.commissionRate)) / this.interestedCoins.length),
            upperMarginTarget: 4,
            lowerMarginTarget: -4
        };
        myNewCoin.budgetInBaseCoin = myNewCoin.initialBudgetInBaseCoin;
        this.state.myCoins.push(myNewCoin);
        this.setState(this.state);
    }

    initListeners() {
        if (this.state.backTesting) return;

        // Binance WebSocket stream (every 1sec.)
        this.binanceWsConnection = new WebSocket('wss://stream.binance.com:9443/ws');
        this.binanceWsConnection.onopen = () => {
            console.log("socket(binance) opened");
            this.binanceWsConnection.send(JSON.stringify({
                "method": "SUBSCRIBE",
                "params": this.state.myCoins.map(myCoin => myCoin.symbol.toLowerCase() + "@miniTicker"), // ethusdt@miniTicker | ltcusdt@ticker
                "id": 1
            }));
            /*this.binanceWsConnection.send(JSON.stringify({
                "method": "LIST_SUBSCRIPTIONS",
                "id": 1
            }));*/
        }
        this.binanceWsConnection.addEventListener('message', (message) => {
            const data = JSON.parse(message.data);
            //console.log(data);
            if (data.e === "24hrMiniTicker") {
                this.state.myCoins.forEach((myCoin) => {
                    if (myCoin.symbol === data.s) { // check related coin
                        this.priceNMarginUpdates(myCoin, data.c);
                    }
                });
                this.setState(this.state);
            }
        });

        this.autoBuySellCheckInterval = setInterval(() => { // autoBuySellCheck fired every [this.state.autoBuySellCheckFreq] second
            console.log("autoBuySellCheck cycle called");
            this.state.myCoins.forEach((myCoin) => this.autoBuySellCheck(myCoin));
        }, this.state.autoBuySellCheckFreq * 1000);
    }

    priceNMarginUpdates(myCoin, priceStr) {
        myCoin.price = parseFloat(priceStr);
        if (!myCoin.initialPrice) myCoin.initialPrice = myCoin.price;
        if (myCoin.isActive) { // I'm in > tracking the max
            if (myCoin.price > myCoin.maxPriceSinceLastBuy) myCoin.maxPriceSinceLastBuy = myCoin.price;
            myCoin.lowerMargin = (myCoin.price / myCoin.maxPriceSinceLastBuy * 100) - 100;
            myCoin.budgetInBaseCoin = myCoin.targetCoinAmount * myCoin.price; // re-calculating current budget (then it's used in win/lose calculation)
        } else { // I'm out > tracking the min
            if (!myCoin.minPriceSinceLastSell) myCoin.minPriceSinceLastSell = myCoin.price;
            if (myCoin.price < myCoin.minPriceSinceLastSell) myCoin.minPriceSinceLastSell = myCoin.price;
            myCoin.upperMargin = (myCoin.price / myCoin.minPriceSinceLastSell * 100) - 100;
        }
    }

    priceNMarginUpdatesWithKline(myCoin, kline) {
        myCoin.price = parseFloat(kline[4]); // the price at the end of kline
        if (!myCoin.initialPrice) myCoin.initialPrice = myCoin.price;
        if (myCoin.isActive) { // I'm in > tracking the max
            const klineMax = parseFloat(kline[2]);
            if (klineMax > myCoin.maxPriceSinceLastBuy) myCoin.maxPriceSinceLastBuy = klineMax;
            myCoin.lowerMargin = (myCoin.price / myCoin.maxPriceSinceLastBuy * 100) - 100;
        } else { // I'm out > tracking the min
            const klineMin = parseFloat(kline[3]);
            if (!myCoin.minPriceSinceLastSell) myCoin.minPriceSinceLastSell = myCoin.price;
            if (klineMin < myCoin.minPriceSinceLastSell) myCoin.minPriceSinceLastSell = klineMin;
            myCoin.upperMargin = (myCoin.price / myCoin.minPriceSinceLastSell * 100) - 100;
        }
    }

    backTestStrategyFor(myCoin) {
        if (myCoin.backTestRan) return;
        console.log("started back test for:", myCoin);

        const ktsSegments = this.klineTypeSelection.split('.');
        const currentKline = this.klineTypes[ktsSegments[0]][ktsSegments[1]];

        myCoin.autoBuySell = true;
        fetch('https://api.binance.com/api/v3/klines?symbol=' + myCoin.symbol + '&interval=' + currentKline[0] + '&limit=' + currentKline[1]).then((response) => {
            response.json().then(data => {
                //console.log(data);
                /*data.forEach((kline) => {
                    this.priceNMarginUpdates(myCoin, kline[1]);
                    this.autoBuySellCheck(myCoin);
                });*/
                const klineCallback = async (i) => {
                    if (i > data.length - 1) {
                        myCoin.backTestRan = true;
                        this.setState(this.state);
                        console.log("back test completed!"); return;
                    }
                    const kline = data[i];
                    //console.log("klineCallback iteration #" + i, kline);

                    if (true) {
                        // strategy 1: [get price value every X minutes & do buy/sell check]
                        this.priceNMarginUpdates(myCoin, kline[1]);
                    } else {
                        // strategy 2: [get price value every second (which means we have real min-max) & do buy/sell check every X minutes]
                        this.priceNMarginUpdatesWithKline(myCoin, kline);
                    }

                    this.autoBuySellCheck(myCoin);
                    //this.setState(this.state); await new Promise(resolve => setTimeout(resolve)); // do it animated (comment out for getting result directly)
                    klineCallback(i + 1);
                };
                klineCallback(0);
            });
        });
    }

    surenessCheck(myCoin, side) {
        let areWeSureEnough = false;
        if (side === 'BUY') {
            areWeSureEnough = true;// TEMP!!
        }
        if (side === 'SELL') {
            areWeSureEnough = true;// TEMP!!
        }
        return areWeSureEnough;
    }

    autoBuySellCheck(myCoin) {
        if (!myCoin.autoBuySell) return;
        if (myCoin.isActive) { // I'm in > tracking the max
            if (myCoin.lowerMargin < myCoin.lowerMarginTarget) { // we've reached the target margin
                const areWeSureEnough = this.surenessCheck(myCoin, 'SELL'); // sureness check
                if (areWeSureEnough) this.sell(myCoin); // we're sure enough (we were over the margin N times) > so sell
            }
            else myCoin.surenessLevel = 0; // we're below the target margin, reset the "sureness"
        } else { // I'm out > tracking the min
            if (myCoin.upperMargin > myCoin.upperMarginTarget) { // we've reached the target margin
                const areWeSureEnough = this.surenessCheck(myCoin, 'BUY'); // sureness check
                if (areWeSureEnough) this.buy(myCoin); // we're sure enough (we were over the margin N times) > so buy
            }
            else myCoin.surenessLevel = 0; // we're below the target margin, reset the "sureness"
        }
    }

    buy(myCoin) {
        if (myCoin.isActive) { console.log("can't buy the bought!!"); return; }
        if (!myCoin.price) { console.log("Price not ready yet. Couldn't buy."); return; }

        // commission included to the budget (Ex. buying 6 USDT)
        const grossPurchaseInBaseCoin = myCoin.budgetInBaseCoin; // 6 USDT
        const netPurchaseInBaseCoin = grossPurchaseInBaseCoin / (1 + this.state.commissionRate); // 5.994005994005994 USDT

        if (this.state.baseCoinBalance - grossPurchaseInBaseCoin < 0) { console.log("Your wallet balance is not enough. Couldn't buy."); return; }

        myCoin.isActive = true;
        myCoin.targetCoinAmount = parseFloat((netPurchaseInBaseCoin / myCoin.price).toFixed(6)); // how many target coins could I buy
        if (myCoin.buyCount === 0) myCoin.firstBuyPrice = myCoin.price;
        myCoin.buyCount++;
        myCoin.lastBuyPrice = myCoin.price;
        myCoin.maxPriceSinceLastBuy = myCoin.lastBuyPrice;

        myCoin.upperMargin = 0; // reset upper margin after buy
        myCoin.budgetInBaseCoin = netPurchaseInBaseCoin; // update budget after buy (commission subtracted from budget)

        this.setState({ ...this.state, baseCoinBalance: (this.state.baseCoinBalance - grossPurchaseInBaseCoin) });
    }

    sell(myCoin) {
        if (!myCoin.isActive) { console.log("can't sell the sold!!"); return; }
        myCoin.isActive = false;
        myCoin.lastSellPrice = myCoin.price;
        myCoin.minPriceSinceLastSell = myCoin.lastSellPrice;

        // commission included to the budget (Ex. selling 5 USDT)
        const grossSellInBaseCoin = myCoin.targetCoinAmount * myCoin.price; // 5 USDT
        const netSellInBaseCoin = grossSellInBaseCoin / (1 + this.state.commissionRate); // +4.9950049950049955 USDT

        myCoin.lowerMargin = 0; // reset lower margin after sell
        myCoin.budgetInBaseCoin = netSellInBaseCoin; // update budget after buy (commission subtracted from budget)

        this.setState({ ...this.state, baseCoinBalance: (this.state.baseCoinBalance + netSellInBaseCoin) });
    }

    calculateTotalBalance() { // total balance calculation (considering active coins & their sell commissions)
        let myActives = 0;
        this.state.myCoins.forEach((myCoin) => { if (myCoin.isActive) myActives += myCoin.targetCoinAmount * myCoin.price; });
        return this.state.baseCoinBalance + myActives - (myActives * this.state.commissionRate);
    }

    render() {
        return (
            <>
                <div>
                    <div style={{ float: 'left' }}>
                        <div>My Wallet Balance: <b>{parseFloat(this.state.baseCoinBalance).toFixed(4)}</b> {this.state.baseCoin}</div>
                        <div>My Total Balance: <b>{parseFloat(this.calculateTotalBalance()).toFixed(4)}</b> {this.state.baseCoin}</div>
                    </div>
                    <div style={{ float: 'right' }}>
                        <div style={{ display: (this.state.backTesting ? 'inline-block' : 'none'), marginRight: 25 }}>
                            <b>Back-Test Data:</b> {this.klineTypeSelection.split('.')[0]}.
                            <select value={this.klineTypeSelection} onChange={(e) => { this.klineTypeSelection = e.target.value; this.setState(this.state); }}>
                                {(() => {
                                    const options = [];
                                    for (const key1 in this.klineTypes) {
                                        options.push(<optgroup label={key1} key={key1}></optgroup>);
                                        for (const key2 in this.klineTypes[key1]) {
                                            const keysCombined = key1 + '.' + key2;
                                            options.push(<option value={keysCombined} key={keysCombined}>{key2}</option>);
                                        }
                                        options.push(<option disabled={true} key={key1 + 'seperator'}>-----------</option>)
                                    }
                                    return options;
                                })()}
                            </select>
                        </div>
                        <button onClick={() => this.setState({ ...this.state, coinsModalOpen: true })}>Browse Coins</button>
                    </div>
                    <div style={{ clear: 'both' }}></div>
                </div>
                <div style={{ overflow: 'hidden' }}>
                    {[true, false].map((isActiveTable) => (
                        <div style={{ float: 'left', width: (isActiveTable ? '44' : '56') + '%' }} key={isActiveTable}>
                            {isActiveTable ? (
                                <h4 style={{ color: 'green' }}>Active Coins (we are IN)</h4>
                            ) : (
                                <h4 style={{ color: 'orange' }}>Passive Coins (we are OUT)</h4>
                            )}
                            <table className="myCoinsTable" style={{ width: '100%' }}>
                                <thead>
                                    <tr>
                                        <th>Coin</th>
                                        <th>Price<br />(Live)</th>
                                        <th>Price<br />Chng %</th>
                                        <th>Win<br />Lose</th>
                                        <th>Buy Price</th>
                                        <th hidden={!isActiveTable}>Max Price</th>
                                        <th hidden={!isActiveTable}>Lower<br />Margin</th>
                                        <th hidden={isActiveTable}>Sell Price</th>
                                        <th hidden={isActiveTable}>Min Price</th>
                                        <th hidden={isActiveTable}>Upper<br />Margin</th>
                                        <th>Buy/Sell&nbsp;&nbsp;
                                            <select value={this.state.buySellColType} onChange={(e) => { this.setState({ ...this.state, buySellColType: e.target.value }); }}>
                                                <option value="auto">Auto</option>
                                                <option value="manual">Manual</option>
                                            </select>
                                            <input type="checkbox" hidden={isActiveTable} onChange={(e) => { this.state.myCoins.forEach((myCoin) => myCoin.autoBuySell = e.target.checked); this.setState(this.state); }} />
                                        </th>
                                        <th hidden={!this.state.backTesting}>Back Testing <button onClick={() => this.state.myCoins.forEach((myCoin) => this.backTestStrategyFor(myCoin))}>Back-Test All</button></th>
                                        <th>Budget</th>
                                    </tr>
                                </thead>
                                {this.state.myCoins.map((myCoin, i) => {
                                    if (myCoin.isActive !== isActiveTable) return null;
                                    return (
                                        <tbody key={i}>
                                            <tr className={myCoin.isActive ? 'iam-in' : (myCoin.autoBuySell ? 'iam-watching' : '')}>
                                                <td>
                                                    {myCoin.isActive ? myCoin.targetCoinAmount : ''} {myCoin.coinName}
                                                </td>
                                                <td>
                                                    {myCoin.price || 'N/A'}
                                                </td>
                                                <td>{(() => { // calculate price chng %
                                                    let value = 0;
                                                    if (myCoin.initialPrice) value = ((myCoin.price / myCoin.initialPrice) - 1) * 100;
                                                    return <span style={{ color: value > 0 ? 'green' : (value < 0 ? 'red' : '') }}>{(value > 0 ? '+' : '') + value.toFixed(2)}%</span>
                                                })()}
                                                </td>
                                                <td>{(() => { // calculate win/lose situation
                                                    let value = ((myCoin.budgetInBaseCoin / myCoin.initialBudgetInBaseCoin) - 1) * 100;
                                                    return <span style={{ color: value > 0 ? 'green' : (value < 0 ? 'red' : '') }}>{(value > 0 ? '+' : '') + value.toFixed(2)}%</span>
                                                })()}
                                                </td>
                                                <td>
                                                    {myCoin.lastBuyPrice || 'N/A'}
                                                    <br />
                                                    Buys: ({myCoin.buyCount})
                                                </td>
                                                <td hidden={!isActiveTable}>
                                                    {myCoin.maxPriceSinceLastBuy || 'N/A'}
                                                </td>
                                                <td hidden={!isActiveTable} style={{ color: 'red' }}>
                                                    {myCoin.lowerMargin !== undefined ? parseFloat(myCoin.lowerMargin).toFixed(2) : 'N/A'} / {parseFloat(myCoin.lowerMarginTarget).toFixed(2)}
                                                    <div hidden={myCoin.lowerMargin === undefined} style={{ position: 'relative' }}>
                                                        <div style={{ position: 'absolute', width: (myCoin.lowerMargin / myCoin.lowerMarginTarget * 100) + '%', height: 10, backgroundColor: 'red' }}></div>
                                                    </div>
                                                </td>
                                                <td hidden={isActiveTable}>
                                                    {myCoin.lastSellPrice || 'N/A'}
                                                </td>
                                                <td hidden={isActiveTable}>
                                                    {myCoin.minPriceSinceLastSell || 'N/A'}
                                                </td>
                                                <td hidden={isActiveTable} style={{ color: 'green' }}>
                                                    {myCoin.upperMargin !== undefined ? '+' + parseFloat(myCoin.upperMargin).toFixed(2) : 'N/A'} / {'+' + parseFloat(myCoin.upperMarginTarget).toFixed(2)}
                                                    <div hidden={myCoin.upperMargin === undefined} style={{ position: 'relative' }}>
                                                        <div style={{ position: 'absolute', width: (myCoin.upperMargin / myCoin.upperMarginTarget * 100) + '%', height: 10, backgroundColor: 'green' }}></div>
                                                    </div>
                                                </td>
                                                <td>
                                                    {this.state.buySellColType === 'auto' ? (
                                                        <>
                                                            <label><input type="checkbox" checked={myCoin.autoBuySell} onChange={(e) => { myCoin.autoBuySell = e.target.checked; this.setState(this.state); }} />Auto Buy/Sell</label>
                                                            <br />
                                                            <span style={{ marginLeft: 8 }}>
                                                                Buy/Sell Mrgns:&nbsp;
                                                                <input type="number" min={0.2} max={99.8} step={0.1} value={myCoin.upperMarginTarget} onChange={(e) => { myCoin.upperMarginTarget = parseFloat(e.target.value); this.setState(this.state); }} style={{ width: 40, backgroundColor: 'lightgreen' }} />
                                                                <input type="number" min={0.2} max={99.8} step={0.1} value={-myCoin.lowerMarginTarget} onChange={(e) => { myCoin.lowerMarginTarget = -parseFloat(e.target.value); this.setState(this.state); }} style={{ width: 40, backgroundColor: 'orangered' }} />
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button hidden={isActiveTable} onClick={() => { this.buy(myCoin); }}>Buy</button>
                                                            <button hidden={!isActiveTable} onClick={() => { this.sell(myCoin); }}>Sell</button>
                                                        </>
                                                    )}
                                                </td>
                                                <td hidden={!this.state.backTesting}>
                                                    <button hidden={myCoin.backTestRan} onClick={(e) => { this.backTestStrategyFor(myCoin); }}>Back-Test This Strategy</button>
                                                </td>
                                                <td>
                                                    <input type="number" min={0.2} step={0.1} disabled={myCoin.firstBuyPrice} value={myCoin.budgetInBaseCoin} onChange={(e) => { myCoin.budgetInBaseCoin = parseFloat(e.target.value); this.setState(this.state); }} style={{ width: 40 }} />{this.state.baseCoin}
                                                </td>
                                            </tr>
                                        </tbody>
                                    );
                                })}
                            </table>
                        </div>
                    ))}
                    <div style={{ clear: 'both' }}></div>
                </div>
                {
                    this.state.coinsModalOpen ? (
                        <Suspense>
                            <BrowseCoinsModal
                                modalOpen={this.state.coinsModalOpen}
                                loadCoinsToState={(data) => this.setState({ ...this.state, coins: data })}
                                closeModalFn={() => this.setState({ ...this.state, coinsModalOpen: false })}
                                coins={this.state.coins}
                                myCoins={this.state.myCoins} />
                        </Suspense>
                    ) : null
                }
            </>
        );
    }

    // component lifecycle events
    componentDidMount() {
        console.log("component did mount");
        document.title = "My Algo Trader | " + AppSettings.seoTitle;

        this.interestedCoins.forEach((coin) => this.addCoinToMyCoins(coin));
        this.initListeners();
    }
    componentDidUpdate() {
        //console.log("component did update");
    }
    componentWillUnmount() {
        console.log("component will unmount");

        // close web socket connection (if exists)
        if (this.binanceWsConnection) this.binanceWsConnection.close();

        // clear intervals
        clearInterval(this.autoBuySellCheckInterval);
    }
}

export default MyAlgoTrader;