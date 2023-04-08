import React from 'react';
// import logo from './logo.svg';
import './App.css';
import Draggable from 'react-draggable';
import {Helmet} from "react-helmet";
import {v4} from 'uuid';

// 按键组件
class Key extends React.Component {
    _isMounted = false;

    // 构造方法
    constructor(props) {
        super(props);
        this.state = {count: 0, index: props.index, name: props.name, x: props.x, y: props.y, pos: props.pos, height: props.height, width: props.width};
        this.handleStop = this.handleStop.bind(this);
        this.start = this.start.bind(this);
        this.setMouseMoveMap = this.setMouseMoveMap.bind(this);
    }

    // 销毁事件
    componentWillUnmount() {
        this._isMounted = false;
        this.setState = (state, callback) => {
            return;
        };
    }

    // 挂载事件
    componentDidMount() {
        this._isMounted = true;
    }

    // 鼠标拖动事件
    handleDrag = (event, info) => {
        if (this._isMounted) {
            let x = (info.x / this.state.width) * 1;
            let y = (info.y / this.state.height) * 1;
            x = parseFloat(x.toFixed(6))
            y = parseFloat(y.toFixed(6))
            const pos = {x: x, y: y};
            this.setState({pos: pos, x: info.x, y: info.y});

            // 鼠标视角
            if (this.props.setMouseMoveMap && this.props.name === 'MouseMap') {
                let mouseMoveMap = {
                    startPos: {
                        x,
                        y
                    }
                }
                this.props.setMouseMoveMap(mouseMoveMap)
            }

            // 小眼睛
            if (this.props.setMouseMoveMap && this.props.name === 'Key_Alt') {
                let mouseMoveMap = {
                    smallEyes: {
                        comment: "小眼睛",
                        type: "KMT_CLICK",
                        key: "Key_Alt",
                        pos: {
                            x,
                            y
                        },
                        switchMap: false
                    }
                }
                this.props.setMouseMoveMap(mouseMoveMap)
            }
        }
    }

    handleStop(event, info) {
        console.log('Key.handleStop', event, info)
        console.log(info);
        // this.props.parentCallback(this.state.index,this.state.pos);
    }

    // 鼠标悬浮事件
    hover() {
        this.setState({hover: true});
    }

    // 鼠标离开事件
    leave() {
        this.setState({hover: false});
    }

    // 鼠标进入事件
    start(info) {
        var count = this.state.count;
        if (count > 1) {
            console.log(info);
        } else {
            count += 0.1;
            console.log(count);
            this.setState({count: count});
        }
    }

    // 调用父组件方法
    setMouseMoveMap(obj) {
        this.props.setMouseMoveMap(obj)
    }

    // 渲染函数
    render() {
        return <Draggable onStol={this.props.parentCallback} onDrag={this.handleDrag} defaultPosition={{x: this.state.x, y: this.state.y}}>
            <div data-index={this.props.index} data-x={this.state.x} data-y={this.state.y} className={'key-map ' + this.props.className} onDoubleClick={this.props.onDoubleClick}>
                {/*<span>{this.state.name}<br/>X : {(this.state.pos.x).toFixed(2)}<br/>Y : {(this.state.pos.y).toFixed(2)}</span>*/}
                <span>{this.state.name.replace('KMT_', '').replace('Key_', '')}</span>
            </div>
        </Draggable>
    }
}

// 鼠标组件
class Mouse extends React.Component {
    // 构造方法
    constructor(props) {
        super(props);
        this.state = {data: props.data, height: props.height, width: props.width};
        this.setMouseMoveMap = this.setMouseMoveMap.bind(this);
    }

    // 销毁事件
    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        };
    }

    // 拖动事件
    handleDrag = (event, info) => {
        const x = (info.x / this.state.width) * 1;
        const y = (info.y / this.state.height) * 1;
        this.setState({pos: {x, y}});
    }

    // 调用父组件方法
    setMouseMoveMap(obj) {
        this.props.setMouseMoveMap(obj)
    }

    // 渲染函数
    render() {
        const width = this.state.width;
        const height = this.state.height;
        const x = this.state.data.startPos.x * width;
        const y = this.state.data.startPos.y * height;
        const x1 = this.state.data.smallEyes.pos.x * width;
        const y1 = this.state.data.smallEyes.pos.y * height;
        return (
            <div>
                <Key setMouseMoveMap={this.setMouseMoveMap} name={"MouseMap"} pos={this.state.data.startPos} x={x} y={y} width={width} height={height}/>
                <Key setMouseMoveMap={this.setMouseMoveMap} name={this.state.data.smallEyes.key} pos={this.state.data.smallEyes.pos} x={x1} y={y1} width={width} height={height}/>
            </div>
        )
    }
}

function downloadFile(data, type, filename) {
    let text = JSON.stringify(data, undefined, 2)
    let blob = null
    if (type === 'blob') {
        blob = new window.Blob([text], {
            type: "text/plain;charset=utf-8"
        })
    } else if (type === 'json') {
        blob = new window.Blob([text], {
            type: 'application/json'
        })
    } else if (type === 'markdown') {
        blob = new window.Blob([text], {
            type: 'text/markdown'
        })
    }

    // 根据 blob生成 url链接
    const objectURL = window.URL.createObjectURL(blob)
    const domElement = document.createElement('a')
    domElement.href = objectURL
    domElement.download = filename
    domElement.click()
    URL.revokeObjectURL(objectURL)
}

// 结果弹窗组件
class ModalResult extends React.Component {
    constructor(props) {
        super(props)
        this.onClickDownload = this.onClickDownload.bind(this)
    }

    // 销毁事件
    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        };
    }

    onClickDownload(e) {
        downloadFile(JSON.parse(this.props.data), "json", "键盘映射.json")
    }

    // 渲染函数
    render() {
        const showHideClassName = this.props.show ? "modal display-block" : "modal display-none";
        return (
            <div className={showHideClassName}>
                <section className="modal-main">
                    <p>结果：</p>
                    <br/>
                    <div className="modal-body">
                        {/*<pre dangerouslySetInnerHTML={{__html: this.props.data}} id="result"></pre>*/}
                        <textarea
                            id="result"
                            name="result"
                            value={this.props.data}
                            rows={20}
                            cols={54}
                        />
                    </div>
                    <br/>
                    <button type="button" onClick={this.props.handleClose}>关闭</button>
                    <button type="button" onClick={this.onClickDownload}>保存到本地</button>
                </section>
            </div>
        );
    }
}

// 双击按键后弹窗组件
class ModalKey extends React.Component {
    // 构造方法
    constructor(props) {
        console.log('ModalKey.props', props)
        super(props)
        this.state = {keys: props.keys, data: props.data, index: props.index}
        this.saveChange = this.saveChange.bind(this);
        this.updateParam = this.updateParam.bind(this);
        this.deleteKey = this.deleteKey.bind(this);
    }

    // 销毁事件
    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        };
    }

    // 挂载事件
    componentDidMount() {
        // this.setState({data: this.props.data});
        this.setState({data: this.props.data})
        fetch('json-file/keys.json')
            .then((r) => r.json())
            .then((data) => {
                this.setState({keys: data});
            })
    }

    // 保存事件
    saveChange() {
        console.log('ModalKey.saveChange')
        if (this.props.index && this.props.parentUpdate) {
            this.props.parentUpdate(this.props.index, this.state.data);
        }

    }

    // 删除按键事件
    deleteKey() {
        console.log('ModalKey.deleteKey')
        if (this.props.index && this.props.parentRemove) {
            this.props.parentRemove(this.props.index);
            this.props.handleClose();
        }
    }

    // 更新参数
    updateParam(param, value) {
        console.log('ModalKey.updateParam', param, value)
        var data = this.props.data;
        if (data) {
            data[param] = value;
            this.setState({data: data});
        }
    }

    // 渲染函数
    render() {

        var opts = [];

        if (this.state.keys) {
            for (let i = 0; i < this.state.keys.length; i++) {
                const e = this.state.keys[i];
                opts.push(<option key={'key-' + i}>{e}</option>);
            }
        }

        const showHideClassName = this.props.show ? "modal display-block" : "modal display-none";
        return (
            <div className={showHideClassName}>
                <section className="modal-main">
                    <p>按键设置</p>
                    <br/>
                    <div className="modal-body">
                        {this.props.data ? <div>
                            <div>
                                <label htmlFor="ModalKeyType">类型：</label>
                                <select name="ModalKeyType" value={this.props.data.type} onChange={(event) => {
                                    this.updateParam('type', event.target.value);
                                }}>
                                    <option value="KMT_CLICK">KMT_CLICK</option>
                                    <option value="KMT_CLICK_TWICE">KMT_CLICK_TWICE</option>
                                    <option value="KMT_CLICK_MULTI">KMT_CLICK_MULTI</option>
                                    <option value="KMT_CLICK_MULTI">KMT_DRAG</option>
                                </select>
                            </div>
                            <br/>
                            <div>
                                <label htmlFor="ModalOneKey">按键：</label>
                                <select name="ModalOneKey" value={this.props.data.key} onChange={(event) => {
                                    this.updateParam('key', event.target.value);
                                }}>
                                    {opts}
                                </select>
                            </div>
                        </div> : <div></div>}
                        <br/>
                        <button type="button" onClick={this.deleteKey}>删除</button>
                        <button type="button" onClick={this.saveChange}>保存</button>
                        <button type="button" onClick={this.props.handleClose}>关闭</button>
                    </div>
                </section>
            </div>
        );
    }
}

// 页面组件
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {height: props.height, width: props.width, dataJson: props.dataJson, show: false, showSetting: false};
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
        this.setMouseMoveMap = this.setMouseMoveMap.bind(this);

    }

    // 显示弹窗
    showModal = () => {
        console.log('App.showModal')
        this.updateJson();
        this.setState({show: true});
    };

    //更新JSON
    updateJson() {
        var keymaps = document.getElementsByClassName("key-map");
        var dataJson = this.state.dataJson;
        for (let i = 0; i < keymaps.length; i++) {

            const e = keymaps[i];
            const x = (e.dataset.x / this.state.width) * 1;
            const y = (e.dataset.y / this.state.height) * 1;
            const pos = {x: x, y: y};
            if (dataJson.keyMapNodes[e.dataset.index]) {
                if (dataJson.keyMapNodes[e.dataset.index].pos) {
                    dataJson.keyMapNodes[e.dataset.index].pos = pos;
                }
                if (dataJson.keyMapNodes[e.dataset.index].centerPos) {
                    dataJson.keyMapNodes[e.dataset.index].centerPos = pos;
                }

            }

        }
        this.setState({dataJson: dataJson})
    }

    // 显示按键弹窗
    showModalKey = (index) => {
        this.updateJson();
        console.log('App.showModalKey', this.state.dataJson.keyMapNodes[index], index)
        this.setState({showSetting: true, selectedKey: this.state.dataJson.keyMapNodes[index], index: index});
    }

    // 隐藏弹窗
    hideModal = () => {
        // this.updateJson();
        this.setState({show: false});
    };

    // 隐藏按键弹窗
    hideModalKey = () => {
        // this.updateJson();
        this.setState({showSetting: false});
    };

    // 更新数据
    updateData(index, data) {
        var datas = this.state.dataJson;
        if (datas.keyMapNodes) {
            datas.keyMapNodes[index] = data
            this.setState({dataJson: datas})

        }
    }

    // 删除数据
    removeData(index) {
        var datas = this.state.dataJson;
        if (datas.keyMapNodes) {
            var arr = datas.keyMapNodes;
            arr.splice(index, 1);
            datas.keyMapNodes = arr;

            this.setState({dataJson: datas})
        }

        //this.forceUpdate();
    }

    // 挂载前事件
    componentWillMount() {

    }

    selectedFileName = localStorage.getItem('selectedFileName') || 'codm_k40.json'

    // 挂载事件
    componentDidMount() {
        this.setState({height: document.getElementById('image').clientHeight, width: document.getElementById('image').clientWidth});


        console.log('App.componentDidMount.selectedFileName', this.selectedFileName)
        fetch('json-file/' + this.selectedFileName)
            .then((r) => r.json())
            .then((data) => {
                // var data = data.keyMapNodes = [];
                this.setState({dataJson: data});
            })
    }

    // 选择Json文件模板
    selectTemplate(e) {
        console.log('App.selectTemplate.selectedFileName', e.target.value)
        localStorage.setItem('selectedFileName', e.target.value)
        fetch('json-file/' + e.target.value)
            .then((r) => r.json())
            .then((data) => {
                this.setState({dataJson: data});
            })
    }

    //got memory leak if call from child
    // 更新按键位置节点列表
    updatePosKeyMapNodes(event, info) {
        //console.log(this.state.listKeys)
        // var datas = this.state.dataJson;
        // const x = (info.x/this.state.width) * 1;
        // const y = (info.y/this.state.height) * 1;
        // const pos = {x:x + 0.02,y:y + 0.02};
        // datas.keyMapNodes[info.node.dataset.index].pos = pos;
        // this.setState({dataJson:datas})
    }

    //got memory leak if call from child
    // 更新按键中间位置节点列表
    updateCenterPosKeyMapNodes(event, info) {
        // var datas = this.state.dataJson;
        // const x = (info.x/this.state.width) * 1;
        // const y = (info.y/this.state.height) * 1;
        // const pos = {x:x + 0.02,y:y + 0.02};
        // datas.keyMapNodes[info.node.dataset.index].centerPos = pos;
        // this.setState({dataJson:datas})
    }

    // 添加按键
    addKey() {
        // this.updateJson();
        var dataJson = this.state.dataJson;
        if (dataJson.keyMapNodes) {
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

        this.setState({dataJson: dataJson});
    }

    // 拖动事件
    handleDraggable(event, info) {
        console.log(info);
    }

    // 高亮
    syntaxHighlight(json) {
        if (typeof json != 'string') {
            json = JSON.stringify(json, undefined, 2);
        }
        if (json) {
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

    // 设置图片地址
    handleImg = (e) => {
        if (e.target.files[0]) {
            document.getElementById("image").src = URL.createObjectURL(e.target.files[0]);
        }
    }

    // 加载Json文件内容
    handleJsonFile = (e) => {
        let _this = this
        if (e.target.files[0]) {
            // document.getElementById("image").src = URL.createObjectURL(e.target.files[0]);
            let reader = new FileReader();//新建一个FileReader
            reader.readAsText(e.target.files[0], "UTF-8");//读取文件
            reader.onload = function (evt) { //读取完文件之后会回来这里
                try {
                    let fileString = evt.target.result; // 读取文件内容
                    console.log("fileString", fileString);
                    let data = JSON.parse(fileString);
                    _this.setState({dataJson: data});
                    _this.updateJson();
                } catch (e) {
                    // console.log("in4-");
                    alert("请选择Json文件");
                }
            }
        }
    }

    // 下级调用方法修改鼠标
    setMouseMoveMap(obj) {
        this.state.dataJson.mouseMoveMap = Object.assign(this.state.dataJson.mouseMoveMap, obj)
    }

    // 渲染函数
    render() {

        const width = this.state.width;
        const height = this.state.height;

        let listKeys = [];

        if (this.state.dataJson) {
            if (this.state.dataJson.mouseMoveMap) {
                listKeys.push(<Mouse setMouseMoveMap={this.setMouseMoveMap} key={"mouse"} data={this.state.dataJson.mouseMoveMap} width={width} height={height}/>)
            }
            if (this.state.dataJson.keyMapNodes) {
                this.state.dataJson.keyMapNodes.map((data, index) => {

                    // console.log('my data', data)

                    if (data) {
                        if (data.pos) {
                            const x = data.pos.x * width;
                            const y = data.pos.y * height;

                            listKeys.push(<Key className={`node-${index}`} onDoubleClick={this.showModalKey.bind(this, index)} index={index} name={data.key} key={v4()} pos={data.pos} x={x} y={y} width={width} height={height} parentCallback={this.updatePosKeyMapNodes}/>)
                        } else if (data.centerPos) {
                            const x = data.centerPos.x * width;
                            const y = data.centerPos.y * height;

                            listKeys.push(<Key className={`node-center-${index}`} onDoubleClick={this.showModalKey.bind(this, index)} index={index} name={data.key || data.type} key={v4()} pos={data.centerPos} x={x} y={y} width={width} height={height} parentCallback={this.updateCenterPosKeyMapNodes}/>)
                        }
                    }
                });
            }
        }

        // console.log('App.render.this.selectedFileName', this.selectedFileName)
        return (
            <div>
                <Helmet>
                    <title>QTScrcpy Keymapper Generator</title>
                    <meta name="description" content="QTScrcpy Keymapper Generator"/>
                </Helmet>
                <img src="./codm_k40_001_20230404153007.jpg" id="image"/>
                <div className="map">
                    {listKeys}
                </div>
                {/*<ModalResult show={this.state.show} handleClose={this.hideModal} data={this.syntaxHighlight(JSON.stringify(this.state.dataJson, undefined, 4))}/>*/}
                <ModalResult show={this.state.show} handleClose={this.hideModal} data={JSON.stringify(this.state.dataJson, undefined, 4)}/>
                <div className="list-button">
                    <select onChange={this.selectTemplate} defaultValue={this.selectedFileName}>
                        <option value={"codm_k40.json"}>模板codm_k40</option>
                        <option value={"pubg.json"}>模板pubg</option>
                        <option value={"genshin.json"}>模板genshin</option>
                    </select>
                    <input id="jsonFile" type="file" placeholder="Choose background" title="choose background" onChange={this.handleJsonFile}/>
                    <label htmlFor="jsonFile">选择本地Json文件</label>
                    <input id="bg" type="file" placeholder="Choose background" title="choose background" onChange={this.handleImg}/>
                    <label htmlFor="bg">选择截图</label>
                    <button type="button" className="button" onClick={this.showModal}>显示结果&保存</button>
                    <button type="button" className="button" onClick={this.addKey}>增加按键</button>
                </div>
                <ModalKey show={this.state.showSetting} handleClose={this.hideModalKey} data={this.state.selectedKey} index={this.state.index} parentUpdate={this.updateData} parentRemove={this.removeData}/>
            </div>
        );
    }
}

export default App;
