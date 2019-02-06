import React from 'react';
import FiltersForm from './FiltersForm';

export class Filters extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            value: "",
            showFilter: false,
            isClear: true
        }
    }

    componentDidMount(){
        this.setState({isClear: false})
    }
    showFilters = () => {
        if (this.state.showFilter){
            this.setState({isClear: true})
        }
        this.setState({showFilter: !this.state.showFilter})
        setTimeout(() => {this.setState({isClear: false})}, )
    }

    render() {
        return (

            <div className={this.state.showFilter ? 'filters-container active' : 'filters-container'}>
                <h1 className={this.state.showFilter ? 'trigger-filters active' : 'trigger-filters'} onClick={this.showFilters}>Filter <i className="fas fa-angle-down"></i></h1>

                <div className={this.state.showFilter ? 'filters active' : 'filters'}>
                    <h2 className={this.state.showFilter ? "collapsed":""} data-toggle="collapse" href="#multiCollapseAge" role="button" aria-expanded="false" aria-controls="multiCollapseAge">age</h2>
                    <h2 className={this.state.showFilter ? "collapsed":""} data-toggle="collapse" data-target="#multiCollapseScore" aria-expanded="false" aria-controls="multiCollapseScore">score</h2>
                    <h2 className={this.state.showFilter ? "collapsed":""} data-toggle="collapse" data-target="#multiCollapseLocation" aria-expanded="false" aria-controls="multiCollapseLocation">location</h2>
                    <h2 className={this.state.showFilter ? "collapsed":""} data-toggle="collapse" data-target="#multiCollapseTags" aria-expanded="false" aria-controls="multiCollapseTags">tags</h2>
                </div>
                {!this.state.isClear &&
                     <FiltersForm isClear={this.state.isClear} optionsTags={this.props.tags.data} />
                }
            </div>
        )
        
    }
}
