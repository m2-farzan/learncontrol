import React from 'react';
import Panel from './panel';
import ZeroPoleCanvas from './zeropolecanvas';

import {LOCAL} from '../local';

class ControllerZeroPolePanel extends React.Component {
    render() {
        return (
            <Panel title={LOCAL('Closed-loop Pole-zero Plot')}>
                <ZeroPoleCanvas tf={this.props.tf}/>
            </Panel>
        );
    }
}

export default ControllerZeroPolePanel;