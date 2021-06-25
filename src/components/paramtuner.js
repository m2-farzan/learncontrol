import React from 'react';
import './paramtuner.css'

class ParamTuner extends React.Component {
    on_value_change(event) {
        this.setState({value: event.target.value});
    }

    render() {
        return (
            <div className="paramtuner-row" dir="ltr">
                <a className="paramtuner-paramlabel">\({this.props.name}\)</a>
                <input value={this.props.value} onChange={(event)=>{this.props.on_param_change(this.props.key_, event.target.value)}} className="paramtuner-input"/>
                <input value={this.props.value} onChange={(event)=>{this.props.on_param_change(this.props.key_, event.target.value)}} className="paramtuner-slider" type="range" step={(this.props.max-this.props.min)/100.0} min={this.props.min} max={this.props.max}></input>
            </div>
        );
    }
}

export default ParamTuner;