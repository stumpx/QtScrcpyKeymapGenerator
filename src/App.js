import React from 'react';
// import logo from './logo.svg';
import './App.css';
import Draggable from 'react-draggable';
import {Helmet} from "react-helmet";
import { v4 } from 'uuid';

class Key extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {count:0,index:props.index,name: props.name,x: props.x,y:props.y,pos:props.pos,height: props.height,width: props.width};
    this.handleStop = this.handleStop.bind(this);
    this.start = this.start.bind(this);
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.setState = (state,callback)=>{
        return;
    };
  }

  componentDidMount() {
    this._isMounted = true;
  }

  handleDrag = (event, info) => {
    if(this._isMounted){
      const x = (info.x/this.state.width) * 1;
      const y = (info.y/this.state.height) * 1;
      const pos = {x:x,y:y};
      this.setState({pos:pos,x:info.x,y:info.y});
      
      
    }
   
  }

  handleStop(event,info) {
    console.log(info);
    //this.props.parentCallback(this.state.index,this.state.pos);
  }

  hover(){
    this.setState({hover:true});
    
  }

  leave(){
    this.setState({hover:false});
  }

  

  start(info){
    var count = this.state.count;
    if(count > 1){
      console.log(info);
    } else {  
      count += 0.1;
      console.log(count);
      this.setState({count:count});
    }
  }

  render(){
    return <Draggable onStol={this.props.parentCallback}  onDrag={this.handleDrag} defaultPosition={{x: this.state.x, y: this.state.y}}>
    <div data-index={this.props.index} data-x={this.state.x} data-y={this.state.y} className={'key-map '+this.props.className} onDoubleClick={this.props.onDoubleClick}>
      <span>{ this.state.name }<br/>X : { (this.state.pos.x).toFixed(2) }<br/>Y : { (this.state.pos.y).toFixed(2) }</span>
    </div>
  </Draggable>
  }
}


class Mouse extends React.Component {
  constructor(props) {
    super(props);
    this.state = {data:props.data,height: props.height,width: props.width};
  }

  componentWillUnmount() {
    this.setState = (state,callback)=>{
        return;
    };
  }

  handleDrag = (event, info) => {
    const x = (info.x/this.state.width) * 1;
    const y = (info.y/this.state.height) * 1;
    this.setState({pos:{x:x,y:y}});
   
  }

  render(){
    const width = this.state.width;
    const height = this.state.height;
    const x = this.state.data.startPos.x * width;
    const y = this.state.data.startPos.y * height;
    const x1 = this.state.data.smallEyes.pos.x * width;
    const y1 = this.state.data.smallEyes.pos.y * height;
    return (
      <div>
        <Key name={"MouseMap"} pos={this.state.data.startPos} x={x} y={y} width={width} height={height} />
        <Key name={this.state.data.smallEyes.key} pos={this.state.data.smallEyes.pos} x={x1} y={y1} width={width} height={height} />
      </div>
    )
  }
}

class ModalResult extends React.Component {
  constructor(props) {
    super(props)
    
  }

  componentWillUnmount() {
    this.setState = (state,callback)=>{
        return;
    };
  }

  render() {
    const showHideClassName = this.props.show ? "modal display-block" : "modal display-none";
      return (
        <div className={showHideClassName}>
        <section className="modal-main">
          <p>Result Json</p>
            <div className="modal-body">
              <pre dangerouslySetInnerHTML={{ __html:this.props.data }} id="result"></pre>
            </div>
          <button type="button" onClick={this.props.handleClose}>
            Close
          </button>
        </section>
      </div>
      );
    }
}


class ModalKey extends React.Component {
  constructor(props) {
    super(props)
    this.state = {keys:props.keys,data:props.data,index:props.index}
    this.saveChange = this.saveChange.bind(this);
    this.updateParam = this.updateParam.bind(this);
    this.deleteKey = this.deleteKey.bind(this);
    this.setState({data:this.props.data});
  }

  componentWillUnmount() {
    this.setState = (state,callback)=>{
        return;
    };
  }

  componentDidMount(){
    this.setState({data:this.props.data})
    fetch('/json-file/keys.json')
    .then((r) => r.json())
    .then((data) =>{
      this.setState({keys:data});
    })
  }

  saveChange(){
    if(this.props.index && this.props.parentUpdate){
      this.props.parentUpdate(this.props.index,this.state.data);
    }
  }

  deleteKey(){
    if(this.props.index && this.props.parentRemove){
      this.props.parentRemove(this.props.index);
      this.props.handleClose();
    }
  }

  updateParam(param,value){
    var data = this.props.data;
    if(data){
      data[param] = value;
      this.setState({data:data});
    }
  }

  render() {
  
    var opts = [];
    
  
    if(this.state.keys){
      for (let i = 0; i < this.state.keys.length; i++) {
        const e = this.state.keys[i];
        opts.push(<option key={'key-'+i}>{e}</option>);
      }
    }

    const showHideClassName = this.props.show ? "modal display-block" : "modal display-none";
      return (
        <div className={showHideClassName}>
        <section className="modal-main">
          <p>Keymap Setting </p>
            <div className="modal-body">
              {this.props.data?<div>
              <div>
                <label>Type : </label>
                <select value={this.props.data.type} onChange={(event)=>{this.updateParam('type',event.target.value);}}>
                  <option value="KMT_CLICK">KMT_CLICK</option>
                  <option value="KMT_CLICK_TWICE">KMT_CLICK_TWICE</option>
                  <option value="KMT_CLICK_MULTI">KMT_CLICK_MULTI</option>
                  <option value="KMT_CLICK_MULTI">KMT_DRAG</option>
                </select>
              </div>
              <br/>
              <div>
                <label>Key : </label>
                <select value={this.props.data.key} onChange={(event)=>{this.updateParam('key',event.target.value);}}>
                  {opts}
                </select>
              </div>
              </div>:<div></div>}
              <br/>
              <button type="button" onClick={this.deleteKey}>
                Delete
              </button>
              <button type="button" onClick={this.saveChange}>
                Save
              </button>
              <br/>
            </div>
          <button type="button" onClick={this.props.handleClose}>
            Close
          </button>
        </section>
      </div>
      );
    }
}




class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {height: props.height,width: props.width,dataJson:props.dataJson,show: false,showSetting:false};
    this.updatePosKeyMapNodes = this.updatePosKeyMapNodes.bind(this)
    this.updateCenterPosKeyMapNodes = this.updateCenterPosKeyMapNodes.bind(this)
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    //this.showModalKey = this.showModalKey.bind(this);
    this.hideModalKey = this.hideModalKey.bind(this);
    this.updateData = this.updateData.bind(this);
    this.removeData = this.removeData.bind(this);
    this.addKey = this.addKey.bind(this);
    this.updateJson = this.updateJson.bind(this);
    this.selectTemplate = this.selectTemplate.bind(this);
    
  }

  showModal = () => {
    
    this.updateJson();
    this.setState({ show: true });
  };

  //get with dom instead
  updateJson(){
    var keymaps = document.getElementsByClassName("key-map");
    var dataJson = this.state.dataJson;
    for (let i = 0; i < keymaps.length; i++) {
      
      const e = keymaps[i];
      const x = (e.dataset.x/this.state.width) * 1;
      const y = (e.dataset.y/this.state.height) * 1;
      const pos = {x:x,y:y};
      if(dataJson.keyMapNodes[e.dataset.index]){
        if(dataJson.keyMapNodes[e.dataset.index].pos){
          dataJson.keyMapNodes[e.dataset.index].pos = pos;
        }
        if(dataJson.keyMapNodes[e.dataset.index].centerPos){
          dataJson.keyMapNodes[e.dataset.index].centerPos = pos;
        }
        
      }
      
    }
    this.setState({dataJson:dataJson})
  }

  showModalKey = (index) => {
  
    this.setState({ showSetting: true,selectedKey:this.state.dataJson.keyMapNodes[index],index:index });
  }

  hideModal = () => {
    this.setState({ show: false });
  };

  hideModalKey = () => {
    this.setState({ showSetting: false });
  };

  updateData(index,data){
    var datas = this.state.dataJson;
    if(datas.keyMapNodes){
      datas.keyMapNodes[index] = data
      this.setState({dataJson:datas})
     
    }
  }

  removeData(index){
    var datas = this.state.dataJson;
    if(datas.keyMapNodes){
      var arr = datas.keyMapNodes;
      arr.splice(index,1);
      datas.keyMapNodes = arr;
      
      this.setState({dataJson:datas})
    }

    //this.forceUpdate();
  }

  componentWillMount(){
    
    
  }

  componentDidMount(){
    this.setState({height: document.getElementById('image').clientHeight,width: document.getElementById('image').clientWidth});
    
    fetch('/json-file/genshin.json')
    .then((r) => r.json())
    .then((data) =>{
      // var data = data.keyMapNodes = [];
      this.setState({dataJson:data});
    })

    
  }

  selectTemplate(e){
    fetch('/json-file/'+e.target.value)
    .then((r) => r.json())
    .then((data) =>{
      this.setState({dataJson:data});
    })
  }


  //got memory leak if call from child
  updatePosKeyMapNodes(event,info){
    //console.log(this.state.listKeys)
    // var datas = this.state.dataJson;
    // const x = (info.x/this.state.width) * 1;
    // const y = (info.y/this.state.height) * 1;
    // const pos = {x:x + 0.02,y:y + 0.02};
    // datas.keyMapNodes[info.node.dataset.index].pos = pos;
    // this.setState({dataJson:datas})
  }

  //got memory leak if call from child
  updateCenterPosKeyMapNodes(event,info){
    // var datas = this.state.dataJson;
    // const x = (info.x/this.state.width) * 1;
    // const y = (info.y/this.state.height) * 1;
    // const pos = {x:x + 0.02,y:y + 0.02};
    // datas.keyMapNodes[info.node.dataset.index].centerPos = pos;
    // this.setState({dataJson:datas})
  }

  addKey(){
    this.updateJson();
    var dataJson = this.state.dataJson;
    if(dataJson.keyMapNodes){
      dataJson.keyMapNodes.push({
        "comment": "New Key",
        "type": "KMT_CLICK",
        "key": "Key_W",
        "pos": {
          "x": 0.40,
          "y": 0.1
        },
        "switchMap": false
      });
    }

    this.setState({dataJson:dataJson});
  }

  handleDraggable(event,info){
    console.log(info);
  }

  syntaxHighlight(json) {
      if (typeof json != 'string') {
          json = JSON.stringify(json, undefined, 2);
      }
      if(json){
        var json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            var cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
      }
  }

  handleImg = (e) => {
      if(e.target.files[0]) {
          document.getElementById("image").src = URL.createObjectURL(e.target.files[0]);
      }   
  }

  render() {
 
    const width = this.state.width;
    const height = this.state.height;

    let listKeys = [];

    if(this.state.dataJson){
      if(this.state.dataJson.mouseMoveMap){
        listKeys.push(<Mouse key={"mouse"} data={this.state.dataJson.mouseMoveMap} width={width} height={height}/>)
      }
      if(this.state.dataJson.keyMapNodes){
        this.state.dataJson.keyMapNodes.map((data, index) => {
          
          if(data){
            if(data.pos){
              const x = data.pos.x * width;
              const y = data.pos.y * height;
           
              listKeys.push(<Key className={`node-${index}`} onDoubleClick={this.showModalKey.bind(this, index)}  index={index} name={data.key} key={v4()} pos={data.pos} x={x} y={y} width={width} height={height} parentCallback = {this.updatePosKeyMapNodes}/>)
            } else if(data.centerPos) {
              const x = data.centerPos.x * width;
              const y = data.centerPos.y * height;
     
              listKeys.push(<Key className={`node-center-${index}`} onDoubleClick={this.showModalKey.bind(this, index)}  index={index} name={data.key || data.type} key={v4()} pos={data.centerPos} x={x} y={y} width={width} height={height} parentCallback = {this.updateCenterPosKeyMapNodes}/>)
            }
          }
        });
      }
    } 
    
   
    return (
      <div>
        <Helmet>
            <title>QTScrcpy Keymapper Generator</title>
            <meta name="description" content="QTScrcpy Keymapper Generator" />
        </Helmet>
        <img  src="./Screenshot_20210315-161641.png" id="image"/>
        <div className="map">
          {listKeys}
        </div>
        <ModalResult show={this.state.show} handleClose={this.hideModal} data={this.syntaxHighlight(JSON.stringify(this.state.dataJson, undefined, 4))}/>
        <div className="list-button">
          <select onChange={this.selectTemplate}>
            <option value="pubg.json">
              pubg.json
            </option>
            <option value="genshin.json" selected>
              genshin.json
            </option>
          </select>
          <input id="bg" type="file" placeholder="Choose background" title="choose background" onChange={this.handleImg}/> 
          <label for="bg">Choose background</label>
          <button type="button" className="button" onClick={this.showModal}>
            Result
          </button>
          <button type="button" className="button" onClick={this.addKey}>
            Add Key
          </button>
        </div>
        <ModalKey show={this.state.showSetting} handleClose={this.hideModalKey} data={this.state.selectedKey} index={this.state.index} parentUpdate={this.updateData} parentRemove={this.removeData}/>
      </div>
    );
  }
}

export default App;
