import React from 'react';

import FiltersForm from './FiltersForm';

export class Filters extends React.Component {
    
    constructor() {
        super();
        this.state = {
            value: "",
            showFilter: false,
        }
        this.showFilters = this.showFilters.bind(this);
    }

    showFilters(){
        this.setState({showFilter: !this.state.showFilter})
    }

    render() {
        return (

            <div className={this.state.showFilter ? 'filters-container active' : 'filters-container'}>
                <h1 className={this.state.showFilter ? 'trigger-filters active' : 'trigger-filters'} onClick={this.showFilters}>Filter <i className="fas fa-angle-down"></i></h1>

                <div className={this.state.showFilter ? 'filters active' : 'filters'}>
                    <h2 className="collapsed" data-toggle="collapse" href="#multiCollapseAge" role="button" aria-expanded="false" aria-controls="multiCollapseAge">Age</h2>
                    <h2 className="collapsed" data-toggle="collapse" data-target="#multiCollapseLocation" aria-expanded="false" aria-controls="multiCollapseLocation">Location</h2>
                    <h2 className="collapsed" data-toggle="collapse" data-target="#multiCollapseScore" aria-expanded="false" aria-controls="multiCollapseScore">Score</h2>
                    <h2 className="collapsed" data-toggle="collapse" data-target="#multiCollapseTags" aria-expanded="false" aria-controls="multiCollapseTags">Tags</h2>
                </div>
                <FiltersForm optionsTags={this.props.tags.data} />
            </div>
        )
        
    }
}
