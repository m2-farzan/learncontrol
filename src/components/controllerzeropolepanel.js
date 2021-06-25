import React from 'react';
import Panel from './panel';
import ZeroPoleCanvas from './zeropolecanvas';

class ControllerZeroPolePanel extends React.Component {
    render() {
        return (
            <Panel title="دیاگرام صفر و قطب مجموعه">
                <ZeroPoleCanvas tf={this.props.tf}/>
            </Panel>
        );
    }
}

export default ControllerZeroPolePanel;