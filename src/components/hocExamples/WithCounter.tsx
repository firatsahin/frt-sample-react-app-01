import React, { useState } from "react";

// HOC usage example (This is wrapper component)

export type withCounterInnerProps = {
    count: number,
    decreaseFn: () => void,
    increaseFn: () => void,
}

const [min, max] = [0, 10];

const withCounter = (WrappedComponent: React.FC<withCounterInnerProps>, initCount = min) => {
    const WithCounter: React.FC = () => {
        let [count, setCount] = useState(initCount < min ? min : (initCount > max ? max : initCount)); // min-max limitation

        const decreaseCount = () => { if (count > min) setCount(count - 1) }
        const increaseCount = () => { if (count < max) setCount(count + 1) }

        return (
            <WrappedComponent count={count} decreaseFn={decreaseCount} increaseFn={increaseCount} />
        )
    }

    return WithCounter
}

export default withCounter