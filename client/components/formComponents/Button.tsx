import React from 'react'

interface ButtonProps { onclick: (e: any) => void, type: string | any, className: string, title: string }

function Button(props: ButtonProps) {
    const { onclick, type, className, title } = props;
    return (
        <button type={type} className={className} onClick={onclick}>
            {title}
        </button>
    )
}

export default Button