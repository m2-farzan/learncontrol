import React from 'react';
import './panel.css'
import { ChevronDown, ChevronUp } from 'react-bootstrap-icons';

class Panel extends React.Component {
    state = {
        collapsed: this.props.initiallyCollapsed || false,
    }

    toogle_collapsed() {
        this.setState({collapsed: !this.state.collapsed});
        setTimeout(window.MathJax.typeset, 100);
    }

    render_expanded() {
        return (
            <div className="panel-panel">
                <div className="panel-header" onClick={this.toogle_collapsed.bind(this)}>
                    <a className="panel-header-caption">{this.props.title}</a>
                    <div className="panel-header-button">
                        <ChevronUp/>
                    </div>
                </div>
                <div className="panel-body">
                    {this.props.children}
                </div>
            </div>
        );
    }

    render_collapsed() {
        return (
            <div className="panel-panel">
                <div className="panel-header panel-header-collapsed" onClick={this.toogle_collapsed.bind(this)}>
                    <a className="panel-header-caption">{this.props.title}</a>
                    <div className="panel-header-button">
                        <ChevronDown/>
                    </div>
                </div>
            </div>
        );
    }


    render() {
        return this.state.collapsed ? this.render_collapsed() : this.render_expanded();
    }
}

export default Panel;