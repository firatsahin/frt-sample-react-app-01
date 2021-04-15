import React, { Component } from "react";

class BrowseCoinsModal extends Component {
    componentDidMount() {
        fetch('https://api.binance.com/api/v3/ticker/24hr').then((response) => {
            response.json().then(data => {
                console.log("All Coins in Binance: ", data.length);
                data = data.filter((coin) => {
                    return (coin.symbol.indexOf('USDT') !== -1 && coin.symbol.substr(coin.symbol.length - 4) === 'USDT' && parseFloat(coin.priceChangePercent) !== 0);
                });
                data = data.map((coin) => { // normalize each coin data
                    coin.priceChangePercent = parseFloat(coin.priceChangePercent);
                    return coin;
                });
                data.sort((a, b) => a.priceChangePercent < b.priceChangePercent ? 1 : -1);
                //console.log("XXX_USDT Coins: ", data);
                this.props.loadCoinsToState(data);
            });
        });
    }
    render() {
        const thTd = { border: '1px dashed gray', padding: '6px 8px' };
        return (
            <>
                <div id="coin-list-wrapper" hidden={!this.props.modalOpen}>
                    <div style={{ position: 'absolute', width: '100%', textAlign: 'center', margin: '20px 0px 0px 290px' }}><button onClick={this.props.closeModalFn}>CLOSE</button></div>
                    <div style={{ width: 500, height: 'calc(100% - 40px)', margin: '20px auto 0 auto', backgroundColor: 'white', overflowY: 'auto' }}>
                        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                            <thead>
                                <tr>
                                    <th style={thTd}>Symbols ({this.props.coins.length})</th>
                                    <th style={thTd}>24h Change %</th>
                                    <th style={thTd}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.props.coins.map((coin, idx) => {
                                    const myCoinIdx = this.props.myCoins.findIndex((myCoin) => myCoin.symbol === coin.symbol);
                                    const trBgColor = myCoinIdx !== -1 ? (this.props.myCoins[myCoinIdx].isActive ? 'greenyellow' : 'orange') : '';
                                    return (
                                        <tr key={idx} style={{ backgroundColor: trBgColor }}>
                                            <td style={thTd} onClick={() => console.log(coin)}>{coin.symbol}</td>
                                            <td style={{ ...thTd, color: coin.priceChangePercent > 0 ? 'green' : (coin.priceChangePercent < 0 ? 'red' : '') }}>
                                                {coin.priceChangePercent > 0 ? '+' : ''}{coin.priceChangePercent.toFixed(2)}
                                            </td>
                                            <td style={thTd}>
                                                <button hidden={!(myCoinIdx === -1)}>+ Start Watching</button>
                                                <button hidden={!(myCoinIdx !== -1 && !this.props.myCoins[myCoinIdx].isActive)}>- End Watching</button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </>
        );
    }
}

export default BrowseCoinsModal;