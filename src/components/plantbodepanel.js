import React from 'react';
import BodeCanvas from './bodecanvas';
import Panel from './panel';

class PlantBodePanel extends React.Component {
    render() {      
        return (
            <Panel title="دیاگرام بُد پلنت" initiallyCollapsed>
                <BodeCanvas tf={this.props.tf}/>
            </Panel>
        );
    }
}

export default PlantBodePanel;