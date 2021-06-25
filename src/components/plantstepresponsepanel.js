import React from 'react';
import Panel from './panel';
import StepResponseCanvas from './stepresponsecanvas';

class PlantStepResponsePanel extends React.Component {
    render() {      
        return (
            <Panel title="پاسخ پله پلنت">
                <StepResponseCanvas tf={this.props.tf}/>
            </Panel>
        );
    }
}

export default PlantStepResponsePanel;