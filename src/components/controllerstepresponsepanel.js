import React from 'react';
import Panel from './panel';
import StepResponseCanvas from './stepresponsecanvas';

import {LOCAL} from '../local';

class ControllerStepResponsePanel extends React.Component {
    render() {
        return (
            <Panel title={LOCAL('Closed-loop Step Response')}>
                <StepResponseCanvas tf={this.props.tf}/>
            </Panel>
        );
    }
}

export default ControllerStepResponsePanel;