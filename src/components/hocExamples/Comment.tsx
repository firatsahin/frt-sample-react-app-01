import React from 'react';
import { withCounterInnerProps } from '../hocExamples/WithCounter';

// HOC usage example (This is one of the wrapped components)

const Comment: React.FC<withCounterInnerProps> = ({ count, decreaseFn, increaseFn }) => {
    return (
        <div style={{ marginBottom: 8 }}>
            <button onClick={decreaseFn}>-</button>
            <span style={{ padding: '0px 6px' }}>{count} comment{count !== 1 ? 's' : ''}</span>
            <button onClick={increaseFn}>+</button>
        </div>
    )
}

export default Comment