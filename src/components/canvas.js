import React, { useRef, useEffect } from 'react'

const Canvas = props => {

    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        //Our first draw
        props.draw(context);
    }, [props.draw])

    return <canvas dir="ltr" ref={canvasRef} {...props} />
}

export default Canvas