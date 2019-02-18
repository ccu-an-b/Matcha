import React from 'react';
import {Link} from 'react-router-dom';
import Select from 'react-select';
import { Field, reduxForm } from "redux-form";
import { BwmSelectLocation } from "components/shared/form/BwmSelectLocation";
import { BwmIntervalSlider } from "components/shared/form/BwmIntervalSlider";
import { BwmMultiSelect } from "components/shared/form/BwmMultiSelect";
import { BwmAutocomplete } from "components/shared/form/BwmAutocomplete";


class SearchForm extends React.Component{
    constructor() {
        super();
        this.state = {
            showFilter: false,
        }
    }

    showFilters = () => {
        this.setState({showFilter: !this.state.showFilter})
    }  
    render(){
        const tags = this.props.optionsTags; 
        const users = this.props.users;
        const {showFilter} = this.state;

        const groupedOptions = [
            {
                title: 'Tags',
                options: tags,
            },
            {
                title: 'Username',
                options: users,
            },
        ];
        

        return (
            <form>
                <div className="my-select no-border search">
                <Field
                    name="search"
                    component={BwmAutocomplete}
                    groupedOptions={groupedOptions}
                />
                    {/* <Select 
                        placeholder="Search..."
                        options={groupedOptions}
                    /> */}
                </div>
                <div className="toggle-filter" onClick={() => this.showFilters()}>
                    <i className="fas fa-sliders-h"></i>
                </div>
                <div className="start-search">
                    <div>Let's go !</div>
                </div>
                {showFilter && 
                <div className="search-filter">
                     <div className="search-titles">
                            <h2 className="collapsed" data-toggle="collapse" href="#multiCollapseAge" role="button" aria-expanded="false" aria-controls="multiCollapseAge">age</h2>
                            <h2 className="collapsed" data-toggle="collapse" data-target="#multiCollapseScore" aria-expanded="false" aria-controls="multiCollapseScore">score</h2>
                            <h2 className="collapsed" data-toggle="collapse" data-target="#multiCollapseLocation" aria-expanded="false" aria-controls="multiCollapseLocation">location</h2>
                            <h2 className="collapsed" data-toggle="collapse" data-target="#multiCollapseTags" aria-expanded="false" aria-controls="multiCollapseTags">tags</h2>
                     </div>
                      <div className="row">
                      <div className="col">
                          <div className="collapse multi-collapse" id="multiCollapseAge">
                              <div className="my-card card card-body">
                                  <Field 
                                      name="age"
                                      min={18}
                                      max={120}
                                      component={BwmIntervalSlider}
                                      value="ok"
                                  />
                              </div>
                          </div>
                      </div>
                      <div className="col">
                          <div className="collapse multi-collapse" id="multiCollapseScore">
                              <div className="my-card card card-body">
                                  <Field  
                                      name="score"
                                      min={0}
                                      max={500}
                                      component={BwmIntervalSlider}
                                  />
                              </div>
                          </div>
                      </div>
                      <div className="col">
                          <div className="collapse multi-collapse" id="multiCollapseLocation">
                              <div className="my-card card card-body">
                              <Field
                                  name="location"
                                  type="text"
                                  placeholder="Where to ..."
                                  className="my-select no-border location"
                                  component={BwmSelectLocation}
                              />
                              </div>
                          </div>
                      </div>
                      <div className="col">
                          <div className="collapse multi-collapse" id="multiCollapseTags">
                              <div className="my-card card card-body">
                                  <Field 
                                      name="tags"
                                      className="my-select no-border multi"
                                      options={tags}
                                      component={BwmMultiSelect }
                                  />
                              </div>
                          </div>
                      </div>
                  </div>
                </div>
                }
            </form>
        )
    }
}

export default reduxForm({
    form: "searchForm"
  })(SearchForm);