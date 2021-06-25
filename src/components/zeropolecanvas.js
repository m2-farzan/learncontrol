import React from 'react';
import Canvas from './canvas';
import {drawAxis, drawXTicks, drawYTicks, drawGrid} from './plottools';

class ZeroPoleCanvas extends React.Component {
    state = {
        num_roots: [],
        den_roots: [],
        last_run_tf: [],
    }

    update_canvas() {
        import("learncontrolwasm").then((learncontrolwasm) => {
            const num_roots = learncontrolwasm.roots(this.props.tf[0]);
            const den_roots = learncontrolwasm.roots(this.props.tf[1]);
            this.setState({num_roots, den_roots});
        });
    }

    componentDidMount() {
        this.update_canvas();
    }

    draw(context) {
        // clear canvas
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);

        // bail if wasm_result is not available
        if (this.state.den_roots.length == 0) {
            return;
        }

        // set y, t multipliers and shifts
        // const my = -context.canvas.height / 15.0;
        const my = 20;
        const sy = 0.5 * context.canvas.height;
        // const mx = context.canvas.width / 15.0;
        const mx = 20;
        const sx = 0.5 * context.canvas.width;

        // common config
        context.lineWidth = 3;
        context.font = "15px monospace";
        context.textBaseline = 'middle';
        context.textAlign = "center";

        // draw axis
        // context.strokeStyle = "#000";
        // context.beginPath();
        // context.moveTo(0, sy);
        // context.lineTo(context.canvas.width, sy);
        // context.moveTo(sx, 0);
        // context.lineTo(sx, context.canvas.height);
        // context.stroke();
        var plot_options = {
            sx,
            mx,
            sy,
            my: -my,
            xrange: [-20.0, 20.0],
            yrange: [-10.0, 10.0],
            n_yticks: 4,
            n_xticks: 8,
            n_gpt_x: 1,
            n_gpt_y: 1,
        }
        drawGrid(context, plot_options);
        drawAxis(context, plot_options);
        drawXTicks(context, plot_options);
        drawYTicks(context, plot_options);

        // draw poles
        context.beginPath();
        context.strokeStyle = "#f00";
        for (var i=0; i<this.state.den_roots.length; i+=2) {
            const re = this.state.den_roots[i];
            const im = this.state.den_roots[i+1];
            const s = 8;
            context.moveTo(mx * re + sx + s, my * im + sy + s);
            context.lineTo(mx * re + sx - s, my * im + sy - s);
            context.moveTo(mx * re + sx + s, my * im + sy - s);
            context.lineTo(mx * re + sx - s, my * im + sy + s);
        }
        context.stroke();

        // draw zeros
        context.strokeStyle = "#00f";
        for (var i=0; i<this.state.num_roots.length; i+=2) {
            context.beginPath();
            const re = this.state.num_roots[i];
            const im = this.state.num_roots[i+1];
            const s = 8;
            context.arc(mx * re + sx, my * im + sy, s, 0, 2 * Math.PI);
            context.stroke();
        }

        // // draw y_ticks
        // context.strokeStyle = "#000";
        // context.beginPath();
        // context.moveTo(st - 10, my + sy);
        // context.lineTo(st + 10, my + sy);
        // context.stroke();
        // context.fillText("1", st - 20, my + sy + 10)

        // // draw x_ticks
        // context.strokeStyle = "#000";
        // context.beginPath();
        // context.moveTo(mt * 10 + st, sy - 10);
        // context.lineTo(mt * 10 + st, sy + 10);
        // context.stroke();
        // context.fillText("10", mt * 10 + st + 15, sy + 40)
        
        // // draw curve
        // context.strokeStyle = "#f00";
        // context.beginPath();
        // context.moveTo(mt * 0 + st, my * this.state.wasm_result[0] + sy);
        // for (var i = 0; i < n_steps; i++) {
        //     const t = dt * i;
        //     context.lineTo(mt * t + st, my * this.state.wasm_result[i] + sy);
        // }
        // context.stroke();

        // // draw y_limit
        // const y_as = this.props.tf[0][this.props.tf[0].length - 1] / this.props.tf[1][this.props.tf[1].length - 1]
        // context.strokeStyle = "#00f";
        // context.setLineDash([10, 10]);
        // context.beginPath();
        // context.moveTo(0, my * y_as + sy);
        // context.lineTo(context.canvas.width, my * y_as + sy);
        // context.stroke();
        // context.setLineDash([]);

        }

    render() {      
        if (this.props.tf != this.state.tf) {
            this.setState({tf: this.props.tf});
            this.update_canvas();
        }
        
        return (
            <Canvas width="800" height="300" draw={this.draw.bind(this)}/>
        );
    }
}

export default ZeroPoleCanvas;