import React from 'react';
import Panel from './panel';
import ZeroPoleCanvas from './zeropolecanvas';

class PlantZeroPolePanel extends React.Component {
    render() {
        return (
            <Panel title="دیاگرام صفر و قطب پلنت">
                <ZeroPoleCanvas tf={this.props.tf}/>
            </Panel>
        );
    }
}

export default PlantZeroPolePanel;