import './App.css';
import './slider.css';
import React from 'react';
import PlantBodePanel from './components/plantbodepanel';
import PlantSelectPanel from './components/plantselectpanel';
import PlantParamsPanel from './components/plantparamspanel';
import PlantStepResponsePanel from './components/plantstepresponsepanel';
import PlantZeroPolePanel from './components/plantzeropolepanel';
import ControllerBodePanel from './components/controllerbodepanel';
import ControllerSelectPanel from './components/controllerselectpanel';
import ControllerParamsPanel from './components/controllerparamspanel';
import ControllerStepResponsePanel from './components/controllerstepresponsepanel';
import ControllerZeroPolePanel from './components/controllerzeropolepanel';

import plants from './core/plants.js'
import controllers from './core/controllers.js'

class App extends React.Component {
    state = {
        selected_plant: plants[0],
        plant_param_values: this.load_param_values(this.state ? this.state.plant_param_values : {}, plants[0]),
        selected_controller: controllers[0],
        controller_param_values: this.load_param_values(this.state ? this.state.controller_param_values : {}, controllers[0]),

        mathjax_dirty_check: [plants[0].key, controllers[0].key],
    }

    load_param_values(current_params_object, new_plant) {
        for (const param of new_plant.params) {
            if (!(param.key in current_params_object)) {
                current_params_object[param.key] = param.default;
            }
        }
        return current_params_object;
    }

    on_plant_selection_change(new_plant) {
        this.setState({selected_plant: new_plant, plant_param_values: this.load_param_values(this.state ? this.state.plant_param_values : {}, new_plant)});
        setTimeout(window.MathJax.typeset, 100);
    }

    on_controller_selection_change(new_controller) {
        this.setState({selected_controller: new_controller, controller_param_values: this.load_param_values(this.state ? this.state.controller_param_values : {}, new_controller)});
        setTimeout(window.MathJax.typeset, 100);
    }

    on_plant_param_change(key, value) {
        var plant_param_values = this.state.plant_param_values;
        plant_param_values[key] = value;
        this.setState({plant_param_values});
    }

    on_controller_param_change(key, value) {
        var controller_param_values = this.state.controller_param_values;
        controller_param_values[key] = value;
        this.setState({controller_param_values});
    }
    
    // componentDidUpdate() {
    //     this.update_mathjax_if_needed();
    // }

    render() {
        return (
            <div className="App" dir="rtl">
                <div className="App-content app-panels-horizontal">
                    <div className="app-panels-vertical">
                        <PlantSelectPanel selected_plant={this.state.selected_plant} on_selection_change={this.on_plant_selection_change.bind(this)}/>
                        <PlantParamsPanel params_info={this.state.selected_plant.params} param_values={this.state.plant_param_values} on_param_change={this.on_plant_param_change.bind(this)}/>
                        <ControllerSelectPanel selected_controller={this.state.selected_controller} on_selection_change={this.on_controller_selection_change.bind(this)}/>
                        <ControllerParamsPanel params_info={this.state.selected_controller.params} param_values={this.state.controller_param_values} on_param_change={this.on_controller_param_change.bind(this)}/>
                    </div>
                    <div className="app-panels-vertical">
                        <PlantStepResponsePanel tf={this.state.selected_plant.tf(this.state.plant_param_values)}/>
                        <PlantZeroPolePanel tf={this.state.selected_plant.tf(this.state.plant_param_values)}/>
                        <PlantBodePanel tf={this.state.selected_plant.tf(this.state.plant_param_values)}/>
                    </div>
                    <div className="app-panels-vertical">
                        <ControllerStepResponsePanel
                            tf={this.state.selected_controller.tf_system(
                                this.state.controller_param_values,
                                this.state.selected_plant.tf(this.state.plant_param_values)
                            )}/>
                        <ControllerZeroPolePanel
                            tf={this.state.selected_controller.tf_system(
                                this.state.controller_param_values,
                                this.state.selected_plant.tf(this.state.plant_param_values)
                            )}/>
                        <ControllerBodePanel
                            tf={this.state.selected_controller.tf_openloop(
                                this.state.controller_param_values,
                                this.state.selected_plant.tf(this.state.plant_param_values)
                            )}/>
                    </div>
                </div>
                <footer className="App-footer">
                    <img height="50" src={require('./img/iust.svg').default}/>
                    <a href="https://github.com/m2-farzan/learncontrol">
                        <img height="30" style={{marginLeft: 9, marginTop: 3, marginBottom: -3}} src={require('./img/github.svg').default}/>
                    </a>
                </footer>
            </div>
        );
    }
}

export default App;
