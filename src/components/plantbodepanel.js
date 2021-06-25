import React from 'react';
import BodeCanvas from './bodecanvas';
import Panel from './panel';

import {LOCAL} from '../local';

class PlantBodePanel extends React.Component {
    render() {      
        return (
            <Panel title={LOCAL('Plant Bode Diagram')} initiallyCollapsed>
                <BodeCanvas tf={this.props.tf}/>
            </Panel>
        );
    }
}

export default PlantBodePanel;