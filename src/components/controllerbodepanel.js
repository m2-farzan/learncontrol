import React from 'react';
import BodeCanvas from './bodecanvas';
import Panel from './panel';
import {LOCAL} from '../local';

class ControllerBodePanel extends React.Component {
    render() {      
        return (
            <Panel title={LOCAL('Open Loop Bode Diagram')} initiallyCollapsed>
                <BodeCanvas stabilityInfo tf={this.props.tf}/>
            </Panel>
        );
    }
}

export default ControllerBodePanel;