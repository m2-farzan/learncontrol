import React from 'react';
import Canvas from './canvas';
import {drawAxis, drawXTicks, drawYTicks, drawYGrid, drawXLabel, drawYLabel, drawLogXTicks} from './plottools';

class BodeCanvas extends React.Component {
    state = {
        wasm_result: [],
        last_run_tf: [],
    }

    update_canvas() {
        import("learncontrolwasm").then((learncontrolwasm) => {
            const wasm_result = learncontrolwasm.bode(this.props.tf[0], this.props.tf[1], 0.01, 10000.0, 100);
            this.setState({wasm_result});
        });
    }

    componentDidMount() {
        this.update_canvas();
    }

    draw(context) {
        // clear canvas
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);

        // bail if wasm_result is not available
        if (this.state.wasm_result.length == 0) {
            return;
        }

        // set dt
        var dt = 0.01;

        // set n_steps, read meta variables
        var n_steps = this.state.wasm_result.length / 2;

        // common config
        context.lineWidth = 3;
        context.font = "15px monospace";
        context.textBaseline = 'middle';
        context.textAlign = "center";

        // set y, t multipliers and shifts
        var my = -context.canvas.height / 100.0;
        var sy = 0.1 * context.canvas.height;
        const mt = context.canvas.width / 1.5;
        const st = 0.1 * context.canvas.width;

        // draw axis
        // context.strokeStyle = "#000";
        // context.beginPath();
        // context.moveTo(0, sy);
        // context.lineTo(context.canvas.width, sy);
        // context.moveTo(st, 0);
        // context.lineTo(st, 0.45 * context.canvas.height);
        // context.stroke();
        var plot_options = {
            sx: st,
            mx: mt/5,
            sy,
            my: my,
            xrange: [0.01, 10000.0],
            yrange: [-30.0, 10.0],
            n_yticks: 8,
            n_xticks: 6,
            n_gpt_x: 1,
            n_gpt_y: 1,
            xlabel: 'omega (rad/s)',
            ylabel: 'Amplitude (dB)'
        }
        drawYGrid(context, plot_options);
        drawAxis(context, plot_options);
        drawLogXTicks(context, plot_options);
        drawYTicks(context, plot_options);
        drawYLabel(context, plot_options);
        drawXLabel(context, plot_options);
        
        // draw curve (mag)
        var mag_roots = [];
        context.strokeStyle = "#f00";
        context.beginPath();
        context.moveTo(mt * 0 + st, my * this.state.wasm_result[0] + sy);
        for (var i = 0; i < n_steps; i++) {
            const t = dt * i;
            context.lineTo(mt * t + st, my * this.state.wasm_result[i] + sy);
            // store roots
            if (i != 0 && this.state.wasm_result[i-1] * this.state.wasm_result[i] < 0.0) {
                const root_estimate =
                    (Math.abs(this.state.wasm_result[i-1]) * (i) + Math.abs(this.state.wasm_result[i]) * (i-1)) /
                    (Math.abs(this.state.wasm_result[i-1]) + Math.abs(this.state.wasm_result[i]))
                mag_roots.push(root_estimate);
            }
        }
        context.stroke();

        if (this.props.stabilityInfo) {
            // vline at roots
            context.strokeStyle = "#0c0";
            context.beginPath();
            for (const i of mag_roots) {
                const t = dt * (i);
                context.moveTo(mt * t + st, 0.05 * context.canvas.height);
                context.lineTo(mt * t + st, 0.95 * context.canvas.height);
            }
            context.stroke();
        }

        // draw phase
        // set y, t multipliers and shifts
        var my = -context.canvas.height / 600.0;
        var sy = 0.6 * context.canvas.height;

        var plot_options = {
            sx: st,
            mx: mt/5,
            sy,
            my: my,
            xrange: [0.01, 10000.0],
            yrange: [-180.0, 60.0],
            n_yticks: 8,
            n_xticks: 6,
            n_gpt_x: 1,
            n_gpt_y: 1,
            xlabel: 'omega (rad/s)',
            ylabel: 'Lag (deg)',
        }
        drawYGrid(context, plot_options);
        drawAxis(context, plot_options);
        drawLogXTicks(context, plot_options);
        drawYTicks(context, plot_options);
        drawYLabel(context, plot_options);
        drawXLabel(context, plot_options);

        // draw axis
        context.strokeStyle = "#000";
        context.beginPath();
        context.moveTo(0, sy);
        context.lineTo(context.canvas.width, sy);
        context.moveTo(st, 0.55 * context.canvas.height);
        context.lineTo(st, context.canvas.height);
        context.stroke();
        
        // draw curve (phase)
        context.strokeStyle = "#f00";
        context.beginPath();
        context.moveTo(mt * 0 + st, my * this.state.wasm_result[n_steps] + sy);
        for (var i = 0; i < n_steps; i++) {
            const t = dt * i;
            context.lineTo(mt * t + st, my * this.state.wasm_result[n_steps + i] + sy);
        }
        context.stroke();

        context.strokeStyle = "#00f";
        context.setLineDash([10, 10]);
        context.beginPath();
        context.moveTo(0, my * (-180.0) + sy);
        context.lineTo(context.canvas.width, my * (-180.0) + sy);
        context.stroke();
        context.setLineDash([]);
    }

    render() {      
        if (this.props.tf != this.state.tf) {
            this.setState({tf: this.props.tf});
            this.update_canvas();
        }
        
        return (
            <Canvas width="800" height="600" draw={this.draw.bind(this)}/>
        );
    }
}

export default BodeCanvas;