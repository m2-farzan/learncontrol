import React from 'react';
import Canvas from './canvas';
import {drawAxis, drawXTicks, drawYTicks, drawGrid, drawXLabel, drawYLabel} from './plottools';

const dt = 0.05;
const tmax = 10;
const n_steps = Math.floor(tmax / dt);

class StepResponseCanvas extends React.Component {
    state = {
        wasm_result: [],
        last_run_tf: [],
        is_convergent: true,
    }

    update_canvas() {
        import("learncontrolwasm").then((learncontrolwasm) => {
            const wasm_result = learncontrolwasm.step_response(this.props.tf[0], this.props.tf[1], dt, n_steps);
            
            var is_convergent = true;
            const den_roots = learncontrolwasm.roots(this.props.tf[1]);
            for (var i = 0; i < den_roots.length; i+=2) {
                if (den_roots[i] > 1e-5) {
                    is_convergent = false;
                    break;
                }
            }

            this.setState({wasm_result, is_convergent});
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

        // set n_steps, read meta variables
        var n_steps = this.state.wasm_result.length - 3; // the last three elements represent (maximum_overshoot, risetime, settling_time)
        var maximum_overshoot = this.state.wasm_result[n_steps];
        var risetime = this.state.wasm_result[n_steps+1];
        var settling_time = this.state.wasm_result[n_steps+2];

        // set y, t multipliers and shifts
        const my = -context.canvas.height / 2.0;
        const sy = 0.9 * context.canvas.height;
        const mt = context.canvas.width / tmax;
        const st = 0.1 * context.canvas.width;

        // common config
        context.lineWidth = 3;
        context.font = "15px monospace";
        context.textBaseline = 'middle';
        context.textAlign = "center";

        // draw axis
        var plot_options = {
            sx: st,
            mx: mt,
            sy: sy,
            my: my,
            xrange: [0, tmax],
            yrange: [0, 2.0],
            n_yticks: 4,
            n_gpt_x: 1,
            n_gpt_y: 2,
            xlabel: 't (s)',
            ylabel: 'y',
        }
        drawGrid(context, plot_options);
        drawAxis(context, plot_options);
        drawXTicks(context, plot_options);
        drawYTicks(context, plot_options);
        drawXLabel(context, plot_options);
        drawYLabel(context, plot_options);
        
        // draw curve
        context.strokeStyle = "#f00";
        context.beginPath();
        context.moveTo(mt * 0 + st, my * this.state.wasm_result[0] + sy);
        for (var i = 0; i < n_steps; i++) {
            const t = dt * i;
            context.lineTo(mt * t + st, my * this.state.wasm_result[i] + sy);
        }
        context.stroke();

        // draw y_limit
        // const y_as = this.props.tf[0][this.props.tf[0].length - 1] / this.props.tf[1][this.props.tf[1].length - 1]
        const y_as = 1.0;
        context.strokeStyle = "#00f";
        context.setLineDash([10, 10]);
        context.beginPath();
        context.moveTo(st, my * y_as + sy);
        context.lineTo(context.canvas.width, my * y_as + sy);
        context.stroke();
        context.setLineDash([]);
    }

    render() {      
        if (this.props.tf != this.state.tf) {
            this.setState({tf: this.props.tf});
            this.update_canvas();
        }

        const n_steps = this.state.wasm_result.length - 3; // the last three elements represent (maximum_overshoot, risetime, settling_time)
        const maximum_overshoot = this.state.wasm_result[n_steps];
        const risetime = this.state.wasm_result[n_steps+1];
        const settling_time = this.state.wasm_result[n_steps+2];
        const ss_response = this.props.tf[0][this.props.tf[0].length - 1] / this.props.tf[1][this.props.tf[1].length - 1] || this.state.wasm_result[n_steps - 1];
        const is_convergent = this.state.is_convergent;
        
        return (
            <>
                <Canvas width="800" height="300" draw={this.draw.bind(this)}/>
                <table className="panel-insider-footer">
                    <tr style={{fontSize: 10}}>
                        <td>بیشترین فراجهش:
                            <a style={{marginRight: 5}} dir="ltr">
                                {maximum_overshoot && maximum_overshoot > 0.0 ? maximum_overshoot.toFixed(1) + ' %' : '-'}
                            </a>
                        </td>
                        <td>زمان صعود:
                            <a style={{marginRight: 5}} dir="ltr">
                                {risetime && risetime > 0.0 ? risetime.toFixed(2) + ' s' : '-'}
                            </a>
                        </td>
                        <td>زمان نشست:
                            <a style={{marginRight: 5}} dir="ltr">
                                {settling_time && settling_time > 0.0 ? settling_time.toFixed(2) + ' s' : '-'}
                            </a>
                        </td>
                        {
                        is_convergent ? (
                            <td>خطای حالت ماندگار:
                                <a style={{marginRight: 5}} dir="ltr">
                                    {(1.0 - ss_response).toFixed(2)}
                                </a>
                            </td>
                        ) : (
                            <td>ناپایدار</td>
                        )
                        }
                    </tr>
                </table>
            </>
        );
    }
}

export default StepResponseCanvas;