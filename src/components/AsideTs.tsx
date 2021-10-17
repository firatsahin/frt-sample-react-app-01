import React from 'react';

type AsideTsProps = {
    title: string,
    paragraph: string,
    color: "red" | "green",
    isFirst?: boolean
}

const AsideTs: React.FC<AsideTsProps> = ({ title, paragraph, color, isFirst = false }) => {
    console.log(title, paragraph, color, isFirst);

    return (
        <aside>
            <h2>{title}</h2>
            <p style={{ color: color }}>
                {paragraph}
            </p>
            {isFirst === true ? <AsideTs title="My Title Inner" paragraph="This my inner paragraph." color="green" /> : null}
        </aside>
    )
}

export default AsideTs