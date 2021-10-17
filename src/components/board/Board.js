import React from 'react';
import PropTypes from 'prop-types';

//import './Board.css'; // Import regular stylesheet
import styles from './Board.module.css'; // Import css modules stylesheet as styles

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.rowsOfBoard = [];
        for (let i = 0; i < this.props.rows; i++) {
            const cols = [];
            for (let j = 0; j < this.props.cols; j++) {
                cols.push({
                    colIndex: j,
                    value: 0
                });
            }
            this.rowsOfBoard.push({
                rowIndex: i,
                cols: cols
            });
        }
        console.log(this.rowsOfBoard);
        this.state = {
            rowsOfBoard: this.rowsOfBoard
        };
    }

    cellClicked(col) {
        //console.log("cell clicked", col);
        switch (this.props.settings.whatToDo) {
            case "increment": col.value++; break;
            case "decrement": col.value--; break;
            default: break;
        }
        this.setState(this.state); // manually triggering re-render
    }

    renderColsOfRow(row) {
        const rowsOfBoard = row.cols.map((col) =>
            <div className={styles["board-col"]} key={col.colIndex} onClick={this.cellClicked.bind(this, col)}>
                {col.value}
            </div>
        );
        return rowsOfBoard;
    }

    renderBoard() {
        const rowsOfBoard = this.state.rowsOfBoard.map((row) =>
            <div className={styles["board-row"]} key={row.rowIndex}>
                {this.renderColsOfRow(row)}
            </div>
        );
        return rowsOfBoard;
    }

    calcBoardTotal() {
        let total = 0;
        this.state.rowsOfBoard.forEach(row => {
            row.cols.forEach(col => total += col.value);
        });
        return total;
    }

    render() {
        return (
            <div style={{ flex: 1, flexDirection: 'column' }}>
                <h4>Board Game #{this.props.boardNo} ({this.props.rows}x{this.props.cols})</h4>
                <div>Board Total: {this.calcBoardTotal()}</div>
                <div id="board-root">
                    {this.renderBoard()}
                    <div>
                        Prop Val: {this.props.settings.whatToDo}
                    </div>
                </div>
            </div>
        );
    }
}

Board.propTypes = {
    rows: PropTypes.number.isRequired,
    cols: PropTypes.number.isRequired,
    settings: PropTypes.object.isRequired
};

export default Board;