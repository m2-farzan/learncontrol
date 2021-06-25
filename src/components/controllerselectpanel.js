import React from 'react';
import Panel from './panel';
import Select from 'react-select';

import controllers from '../core/controllers.js'
import './controllerselectpanel.css'

import {LOCAL, DIR} from '../local';

class ControllerSelectPanel extends React.Component {
    on_selection_change(new_value) {
        for (const controller of controllers) {
            if (controller.key == new_value.value) {
                this.props.on_selection_change(controller);
                break;
            }
        }
    }

    render() {
        return (
            <Panel title={LOCAL('Controller Selection')}>
                <img className="controllerselect-image" src={require('../img/controllers/' + this.props.selected_controller.key + '.svg').default} width="350"/>
                <Select
                    value={{value: this.props.selected_controller.key, label: this.props.selected_controller.name}}
                    options={controllers.map(controller => {return {value: controller.key, label: controller.name}})}
                    onChange={this.on_selection_change.bind(this)}
                    isRtl={DIR === 'rtl'}
                    placeholder={LOCAL('Select...')}
                />
            </Panel>
        );
    }
}

export default ControllerSelectPanel;