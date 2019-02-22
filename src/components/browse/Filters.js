import React from 'react';
import FiltersForm from './FiltersForm';
import SortFom from './SortForm'

export class Filters extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            value: "",
            showFilter: false,
            isClear: true,
            showOrder: false
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
    showOrder = () => {
        this.setState({showOrder: !this.state.showOrder})
    }

    render() {
        const {order, triggerOrder, tags} = this.props
        const {showFilter, showOrder, isClear} = this.state
        return (

            <div className={showFilter ? 'filters-container active' : 'filters-container'}>
                <div className="order">
                    <h1 className='trigger-filters order' onClick={this.showOrder} >Sort by</h1>
                    <SortFom order={order} triggerOrder={triggerOrder} show={showOrder} />
                </div>
                <h1 className={showFilter ? 'trigger-filters active' : 'trigger-filters'} onClick={this.showFilters}>Filter <i className="fas fa-angle-down"></i></h1>

                <div className={showFilter ? 'filters active' : 'filters'}>
                    <h2 className={showFilter ? "collapsed":""} data-toggle="collapse" href="#multiCollapseAge" role="button" aria-expanded="false" aria-controls="multiCollapseAge">age</h2>
                    <h2 className={showFilter ? "collapsed":""} data-toggle="collapse" data-target="#multiCollapseScore" aria-expanded="false" aria-controls="multiCollapseScore">score</h2>
                    <h2 className={showFilter ? "collapsed":""} data-toggle="collapse" data-target="#multiCollapseLocation" aria-expanded="false" aria-controls="multiCollapseLocation">location</h2>
                    <h2 className={showFilter ? "collapsed":""} data-toggle="collapse" data-target="#multiCollapseTags" aria-expanded="false" aria-controls="multiCollapseTags">tags</h2>
                </div>
                {!isClear &&
                     <FiltersForm isClear={isClear} optionsTags={tags.data} />
                }
            </div>
        )
        
    }
}
