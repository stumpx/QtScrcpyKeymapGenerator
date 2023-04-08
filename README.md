
### 预览图
![alt 预览图](/public/Snipaste_2023-04-09_00-07-32.png)

### 本项目从https://github.com/bagusindrayana/qtscrcpy-keymap-generator修改而来
### 完成以下工作
1. 翻译成中文；
1. 解决弹窗按钮恢复原来位置的问题；
1. 尝试tauri打包成exe；
1. mouseMoveMap节点的startPos位置，mouseMoveMap节点的smallEyes.pos位置；

### 运行
`yarn run start`

### 构建
`yarn run build`

### 打包exe，tauri文档里面的
`yarn tauri build`
### 打包exe，电脑有rust开发环境
`cd src-tauri`
`cargo build --release`


====================

Web : https://qtscrcpy-keymap.netlify.app


# Keymapper Generator for QTScrcpy - https://github.com/barry-ran/QtScrcpy
- Upload a screenshot of the controls from the game
- customize each map key
- get the result in the form of json

# limitation
- there is a problem in accuracy
- only a few key types are available


I do not know if there are already available third party applications for customization of the keyboard and mouse so I created this to help organize the layout


I'm learning React JS so I made this an exercise and the result is of course messy


