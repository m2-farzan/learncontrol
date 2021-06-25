import React from 'react';
import Panel from './panel';
import StepResponseCanvas from './stepresponsecanvas';

import {LOCAL} from '../local';

class PlantStepResponsePanel extends React.Component {
    render() {      
        return (
            <Panel title={LOCAL('Plant Step Response')}>
                <StepResponseCanvas tf={this.props.tf}/>
            </Panel>
        );
    }
}

export default PlantStepResponsePanel;