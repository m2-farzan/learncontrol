import React from 'react';
import Panel from './panel';
import Select from 'react-select';

import plants from '../core/plants.js'
import './plantselectpanel.css'

import {LOCAL, DIR} from '../local';

class PlantSelectPanel extends React.Component {
    on_selection_change(new_value) {
        for (const plant of plants) {
            if (plant.key == new_value.value) {
                this.props.on_selection_change(plant);
                break;
            }
        }
    }

    render() {
        return (
            <Panel title={LOCAL('Plant Selection')}>
                <img className="plantselect-image" src={require('../img/plants/' + this.props.selected_plant.key + '.svg').default} width="300"/>
                <Select
                    value={{value: this.props.selected_plant.key, label: this.props.selected_plant.name}}
                    options={plants.map(plant => {return {value: plant.key, label: plant.name}})}
                    onChange={this.on_selection_change.bind(this)}
                    isRtl={DIR === 'rtl'}
                    placeholder={LOCAL('Select...')}
                />
            </Panel>
        );
    }
}

export default PlantSelectPanel;