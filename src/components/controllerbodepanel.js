import React from 'react';
import BodeCanvas from './bodecanvas';
import Panel from './panel';

class ControllerBodePanel extends React.Component {
    render() {      
        return (
            <Panel title="دیاگرام بُد حلقه باز" initiallyCollapsed>
                <BodeCanvas stabilityInfo tf={this.props.tf}/>
            </Panel>
        );
    }
}

export default ControllerBodePanel;