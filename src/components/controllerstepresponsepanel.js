import React from 'react';
import Panel from './panel';
import StepResponseCanvas from './stepresponsecanvas';

class ControllerStepResponsePanel extends React.Component {
    render() {
        return (
            <Panel title="پاسخ پله مجموعه">
                <StepResponseCanvas tf={this.props.tf}/>
            </Panel>
        );
    }
}

export default ControllerStepResponsePanel;