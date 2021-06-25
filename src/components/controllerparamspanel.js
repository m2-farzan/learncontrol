import React from 'react';
import Panel from './panel';
import ParamTuner from './paramtuner';
import {LOCAL} from '../local';

class ControllerParamsPanel extends React.Component {
    componentDidMount() {
        window.MathJax && setTimeout(window.MathJax.typeset, 100);
    }

    render() {
        return (
            <Panel title={LOCAL('Controller Parameters')}>
                {this.props.params_info.map(param => <ParamTuner key={param.key} name={param.name} min={param.min} max={param.max} key_={param.key} value={this.props.param_values[param.key]} on_param_change={this.props.on_param_change}/>)}
            </Panel>
        );
    }
}

export default ControllerParamsPanel;