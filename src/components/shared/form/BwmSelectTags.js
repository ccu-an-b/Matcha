import React from 'react';
import Select, { Creatable } from 'react-select';
var options = [
    { label: 'test', value: 'test', color: '#E31864'},
    { label: 'ok', value: 'ok', color: '#6216A3'},
    { label: 'bien', value: 'bien'}
];


// export class BwmSelectTags extends React.Component {
    
//     constructor() {
//         super();
//         this.state = {
//           value: "",
//           isTrue: false,
//           inputValue: {},
//           recent: "",
//           tagedit: false,
//           id: 0,
//           curLabel: "",
//           option: option,
    
//         }
//     }
    
//         setValue = (value) => {
//             this.setState({ value });
//         }
    
//        _handleKeyPress = (e) => {
//          var key = e.which;
//          if (key === 96) {
//           const newState = this.state;
//           newState.value[0].label = this.state.inputValue ? this.state.inputValue : this.state.value[0].label;
//           newState[this.state.curLabel] = false;
//           newState.tagedit = true;
//           this.setState({ newState });
//         }
//       }
    
//       updateInputValue = (evt) => {
//         this.setState({
//           inputValue: evt.target.value
//         });
//       }
    
//         renderValue = (option) => {
//            return <input type="text" defaultValue={this.state.label} ref={c => {
//             this.inputSelComp = c;
//         }} onKeyPress={this._handleKeyPress} onChange={this.updateInputValue}  /> 
//         }
    
//        componentDidUpdate() {
//          console.log(this.state);
//       }
    
//       onValueClick = (val) => { 

//         const curOptionId= this.state.options.find(x => x.label === val.label).id;

//         this.setState({ id: curOptionId, inputValue: "", label: val.label, });
//             setTimeout(function() { 
//             const curLabel = (val.value).replace(/ /g, '');
//                 if(curOptionId === this.state.id) {
//                 this.setState({ [curLabel]: true, tagedit:false, curLabel: curLabel}); 
//             }
//         }.bind(this), 500);
    
//    }
//     render() {

//         const curLabelData = this.state.curLabel;
//             // console.log(curLabelData);
//             // console.log(this.state[curLabelData])
//             const aa = {'data-foo': 'bar'}; 

//         return (<div>
//             <Select.Creatable
//                 allowCreate={true}
//                 onInputChange={(inputValue) => this._inputValue = inputValue}
//                options={this.state.option}
//                 optionRenderer={this.renderOption}
//                 onChange={this.setValue}
//                 value ={this.state.value}
//                valueRenderer ={this.state[curLabelData] ? this.renderValue: this.renderStr }
//                 onValueClick={this.onValueClick}
//                 inputProps={aa}
//                 id="Element"
//                multi
//            /></div>
//         //    <ReactSelect
//         //    allowCreate={true}
//         //    options={this.state.option}
//         //  />
        
//         )
//     }
// }

 

export class BwmSelectTags extends React.Component {

    constructor(){
        super();
    this.state = {
      selectedOption: '',
      option: options,
      value : []
    }
    this.handleChange = this.handleChange.bind(this)
}
    // handleChange = (selectedOption) => {
    //   this.setState({ selectedOption });
    //   console.log(`Selected: ${selectedOption.label}`);
    // }

    handleChange(event) {
        debugger;
        let newVal =event.value
        let stateVal = this.state.value.slice()
        
        console.log(stateVal)
        console.log(newVal)

        stateVal.indexOf(newVal) === -1
          ? stateVal.push(newVal)
          : stateVal.length === 1
            ? (stateVal = [])
            : stateVal.splice(stateVal.indexOf(newVal), 1)
    
        this.setState({ value: stateVal })
    }
    previewTags() {
        let div = []
        const { value } = this.state;
 
        for (let i = 0; i < value.length; i++) {
            div.push(
                <div  key={i}>
                    {value[i]}
                </div>
            )
        }
        return div
    }

    render() {
       
      return (
          <div>
       <Creatable
            allowCreate={true}
            options={this.state.option}
           
            value={this.state.value}
            onChange={this.handleChange}
            multi={true}
            delimiter=';'
       />
       {this.previewTags()}
       </div>
      );
    }
  }

