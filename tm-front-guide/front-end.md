# 天马工场前端代码规范

| author        | version    |  date  |
| --------   | :-----:  | :----: |
| 周轩宇        | 1.0        |   2021/3/12    |


## 基本原则

所有的代码都要符合可维护性原则 —— 简单、便于阅读。

规范的目的是为了编写高质量的代码，统一代码风格，降低协同合作的成本，一起快乐搬砖。

引自《阿里规约》的开头片段：

_----现代软件架构的复杂性需要协同开发完成，如何高效地协同呢？无规矩不成方圆，无规范难以协同，比如，制订交通法规表面上是要限制行车权，实际上是保障公众的人身安全，试想如果没有限速，没有红绿灯，谁还敢上路行驶。对软件来说，适当的规范和标准绝不是消灭代码内容的创造性、优雅性，而是限制过度个性化，以一种普遍认可的统一方式一起做事，提升协作效率，降低沟通成本。代码的字里行间流淌的是软件系统的血液，质量的提升是尽可能少踩坑，杜绝踩重复的坑，切实提升系统稳定性，码出质量。_

# 一、编程规约

### (一)命名规范

#### 1.1.1 项目命名

全部采用小写方式， 以中划线分隔。

正例：`mall-management-system`

反例：`mall_management-system / mallManagementSystem`

#### 1.1.2 目录命名

全部采用小写方式， 以中划线分隔，有复数结构时，要采用复数命名法， 缩写不用复数

正例： `scripts / styles / components / images / utils / layouts / demo-styles / demo-scripts / img / doc`

反例： `script / style / demo_scripts / demoStyles / imgs / docs`

#### 1.1.3 JS、CSS、SCSS、HTML、PNG 文件命名

全部采用小写方式， 以中划线分隔

正例： `render-dom.js / signup.css / index.html / company-logo.png`

反例： `renderDom.js / UserManagement.html`

不要在文件名后加数字, 来实现相同功能的多个版本

如:drag1.js、drag2.js、drag3.js是禁止的。

#### 1.1.4 命名严谨性

代码中的命名严禁使用拼音与英文混合的方式。 说明：正确的英文拼写和语法可以让阅读者易于理解，避免歧义，好的命名比注释更有用。

**杜绝完全不规范的缩写，避免望文不知义：**

正例：hor / vert / arr / temp / str / reg / lens 等。

反例：AbstractClass“缩写”命名成 AbsClass；condition“缩写”命名成 condi，此类随意缩写严重降低了代码的可阅读性。

### (二)HTML 规范

#### 1.2.1 HTML 类型

推荐使用 HTML5 的文档类型申明： <!DOCTYPE html>.

正例：

```html
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
    <meta charset="UTF-8" />
    <title>Page title</title>
  </head>
  <body>
    <img src="images/company-logo.png" alt="Company" />
  </body>
</html>
```

#### 1.2.2 缩进

缩进使用 2 个空格（一个 tab）

嵌套的节点应该缩进。

#### 1.2.3 分块注释

在每一个块状元素，列表元素和表格元素后，加上一对 HTML 注释。注释格式

`<!-- 英文 中文 start >`

`<!-- 英文 中文 end >`

正例：

```html
<body>
  <!-- header 头部 start -->
  <header>
    <div class="container">
      <a href="#">
        <img src="images/header.jpg" />
      </a>
    </div>
  </header>
  <!-- header 头部 end -->
</body>
```

#### 1.2.4 换行

标签属性过多时需要换行对齐，方便阅读。

正例：

```html
<Pagination
  total={total}
  pageSizeOptions={["10", "20", "40"]}
  showTotal={(total) => `共${total}条数据`}
  onChange={onChange}
  current={current}
  onShowSizeChange={onShowSizeChange}
  showSizeChanger
  showQuickJumper
/>
```

反例：

```html
<Pagination total={total} pageSizeOptions={["10", "20", "40"]} showTotal={(total) => `共${total}条数据`} onChange={onChange} current={current} onShowSizeChange={onShowSizeChange} showSizeChanger showQuickJumper
/>
```

#### 1.2.5 语义化标签

HTML5 中新增很多语义化标签，所以优先使用语义化标签，避免一个页面都是 div 或者 p 标签

正例

```html
<header></header>
<footer></footer>
<title></title>
<hn></hn>
<main></main>
<p></p>
...
```

反例

```html
<div>
  <div></div>
</div>
```

#### 1.2.6 引号

使用双引号(" ") 而不是单引号(' ') 。

正例： `<div class="news-div"></div>`

反例： `<div class='news-div'></div>`

### (三) CSS 规范

#### 1.3.1 命名

- 类名使用小写字母，以中划线分隔
- id 采用驼峰式命名
- scss 中的变量、函数、混合采用驼峰式命名

ID 和 class 的名称总是使用可以反应元素目的和用途的名称，或其他通用的名称，代替表象和晦涩难懂的名称

反例：

```css
.fw-800 {
  font-weight: 800;
}
.red {
  color: red;
}
```

正例:

```css
.heavy {
  font-weight: 800;
}
.important {
  color: red;
}
```

#### 1.3.2 选择器

1)css 选择器中避免使用标签名
从结构、表现、行为分离的原则来看，应该尽量避免 css 中出现 HTML 标签，并且在 css 选择器中出现标签名会存在潜在的问题。

2)很多前端开发人员写选择器链的时候不使用 直接子选择器（注：直接子选择器和后代选择器的区别）。有时，这可能会导致疼痛的设计问题并且有时候可能会很耗性能。然而，在任何情况下，这是一个非常不好的做法。如果你不写很通用的，需要匹配到 DOM 末端的选择器， 你应该总是考虑直接子选择器。

反例:

```css
.content .title {
  font-size: 2rem;
}
```

正例:

```css
.content > .title {
  font-size: 2rem;
}
```

#### 1.3.3 尽量使用缩写属性

反例：

```css
border-top-style: none;
font-family: palatino, georgia, serif;
font-size: 100%;
line-height: 1.6;
padding-bottom: 2em;
padding-left: 1em;
padding-right: 1em;
padding-top: 0;
```

正例：

```css
border-top: 0;
font: 100%/1.6 palatino, georgia, serif;
padding: 0 1em 2em;
```

#### 1.3.4 每个选择器及属性独占一行

反例：

```css
button {
  width:100px;height:50px;color:#fff;background:#00a0e9;
}
```

正例：

```css
button {
  width:100px;
  height:50px;
  color:#fff;
  background:#00a0e9;
}
```

#### 1.3.5 省略0后面的单位

反例：

```css
div {
  padding-bottom: 0px;
  margin: 0em;
}
```

正例：

```css
div {
  padding-bottom: 0;
  margin: 0;
}
```

**小数点前面的0也可以省略，0.7 写成 .7**

#### 1.3.6 避免使用ID选择器及全局标签选择器防止污染全局样式

反例：

```css
#header {
  padding-bottom: 0px;
  margin: 0em;
}
```

正例：

```css
.header {
  padding-bottom: 0px;
  margin: 0em;
}
```

### (四) LESS/SASS 规范

#### 1.4.1 代码组织
##### 1)将公共less, scss文件放置在styles文件夹

例:// color.less, common.less, mixin.less, variables.less 

##### 2)按以下顺序组织

1、@import;
2、变量声明;
3、样式声明;

```css
@import "mixins.less";
@default-text-color: #333;
.page {
  width: 960px;
  margin: 0 auto;
}
```

#### 1.4.2 避免嵌套层级过多

将嵌套深度限制在3级。对于超过4级的嵌套，给予重新评估。这可以避免出现过于详实的CSS选择器。
避免大量的嵌套规则。当可读性受到影响时，将之打断。推荐避免出现多于20行的嵌套规则出现

反例：

```css
.main {

  .title {
  
    .name {
       color:#fff
    }
  }
}
```

正例：

```css
.main-title {

   .name {
      color:#fff
   }
}
```

#### 1.4.3 每个类之间敲个回车

css一旦多，会显的过于臃肿，适当隔开便于阅读。

反例：

```css
.main {
  width:100px;
  height:50px;
  color:#fff;
  background:#00a0e9;
  .name {
    color:#fff
  }
  .title {
    background: #ccc
  }
  &:hover {
    font-size: 12px
  }
}
```

正例：

```css
.main {
  width:100px;
  height:50px;
  color:#fff;
  background:#00a0e9;
  
  .name {
    color:#fff
  }
  
  .title {
    background: #ccc
  }
  
  &:hover {
    font-size: 12px
  }
}
```

### (五) Javascript 规范

#### 1.5.1 命名

##### 1) 采用小写驼峰命名 lowerCamelCase，代码中的命名均不能以下划线，也不能以下划线或美元符号结束

反例： `_name / name_ / name$`

\***\*其中_通常表示私有的意思\*\***

##### 2) 方法名、参数名、成员变量、局部变量都统一使用 lowerCamelCase 风格，必须遵从驼峰形式。

正例： `localValue / getHttpMessage() / inputUserId`

\***\*其中 method 方法命名必须是 动词 或者 动词+名词 形式\*\***

正例：`saveShopCarData /openShopCarInfoDialog`

反例：`save / open / show / go`

\***\*特此说明，增删查改，详情统一使用如下 5 个单词，不得使用其他（目的是为了统一各个端）\*\***

`add / update / delete / detail / get`


**附： 函数方法常用的动词:**

```js
get 获取/set 设置,
add 增加/remove 删除
create 创建/destory 移除
start 启动/stop 停止
open 打开/close 关闭,
read 读取/write 写入
load 载入/save 保存,
create 创建/destroy 销毁
begin 开始/end 结束,
backup 备份/restore 恢复
import 导入/export 导出,
split 分割/merge 合并
inject 注入/extract 提取,
attach 附着/detach 脱离
bind 绑定/separate 分离,
view 查看/browse 浏览
edit 编辑/modify 修改,
select 选取/mark 标记
copy 复制/paste 粘贴,
undo 撤销/redo 重做
insert 插入/delete 移除,
add 加入/append 添加
clean 清理/clear 清除,
index 索引/sort 排序
find 查找/search 搜索,
increase 增加/decrease 减少
play 播放/pause 暂停,
launch 启动/run 运行
compile 编译/execute 执行,
debug 调试/trace 跟踪
observe 观察/listen 监听,
build 构建/publish 发布
input 输入/output 输出,
encode 编码/decode 解码
encrypt 加密/decrypt 解密,
compress 压缩/decompress 解压缩
pack 打包/unpack 解包,
parse 解析/emit 生成
connect 连接/disconnect 断开,
send 发送/receive 接收
download 下载/upload 上传,
refresh 刷新/synchronize 同步
update 更新/revert 复原,
lock 锁定/unlock 解锁
check out 签出/check in 签入,
submit 提交/commit 交付
push 推/pull 拉,
expand 展开/collapse 折叠
begin 起始/end 结束,
start 开始/finish 完成
enter 进入/exit 退出,
abort 放弃/quit 离开
obsolete 废弃/depreciate 废旧,
collect 收集/aggregate 聚集
```

##### 3) 常量命名全部大写，单词间用下划线隔开，力求语义表达完整清楚，不要嫌名字长。

正例： `MAX_STOCK_COUNT`

反例： `MAX_COUNT`

#### 1.5.2 代码格式

##### 1) 使用 2 个空格进行缩进

正例：

```js
if (x < y) {
  x += 10;
} else {
  x += 1;
}
```

##### 2) 不同逻辑、不同语义、不同业务的代码之间插入一个空行分隔开来以提升可读性。

说明：任何情形，没有必要插入多个空行进行隔开。

#### 1.5.3 字符串

统一使用单引号(‘)，不使用双引号(“)。这在创建 HTML 字符串非常有好处：

正例:

```js
let str = 'foo';
let testDiv = '<div id="test"></div>';
```

反例:

```js
let str = 'foo';
let testDiv = "<div id='test'></div>";
```

#### 1.5.4 使用 ES6+

必须优先使用 ES6+ 中新增的语法糖和函数。这将简化你的程序，并让你的代码更加灵活和可复用。

比如箭头函数，await/async，解构（数组解构，对象解构，参数解构），参数默认值，数组新增方法，对象新增方法等等。

#### 1.5.5 括号

下列关键字后必须有大括号（即使代码块的内容只有一行）：if, else, for, while, do, switch, try, catch, finally。

正例：

```js
if (condition) {
  doSomething();
}
```

反例：

```js
if (condition) doSomething();
```

#### 1.5.6 条件判断和循环最多三层

条件判断能使用三目运算符和逻辑运算符解决的，就不要使用条件判断，但是谨记不要写太长的三目运算符。如果超过 3 层请抽成函数，并写清楚注释。

#### 1.5.7 this 的转换命名

对上下文 this 的引用只能使用'self'来命名。

#### 1.5.8 慎用 console.log

因 console.log 大量使用会有性能问题，所以在非 webpack 项目中谨慎使用 log 功能。
上线之前必须删除所有的console.log。

#### 1.5.9 空格

##### 需要保留空格的情况:

##### 1) 各种运算符, 包括数值操作符(例如:+、-、*、/、%等)、位运算符、比较运算符、三元运算符、复合赋值运算符、赋值运算符前后, 保留一个空格。 “.”(点) 和“(”(左括号)和 “[”(左方括号)例外。

反例：

```js
let a=b+c;
let a=isFlag?1:2;
```

正例：

```js
let a = b + c;
let a = isFlag ? 1 : 2;
```

##### 2) for 循环条件中, 分号后保留一个空格。

反例：

```js
for(let i=0;i<lens;i++){}
```

正例：

```js
for(let i = 0; i < lens; i++){}
```

##### 3) 所有的逗号后保留一个空格, 例如: 变量声明语句、数组值、JSON 对象值、函数参数值等等。

反例：

```js
const arr=[1,2,3];
```

正例：

```js
const arr = [1, 2, 3];
```

##### 4) 冒号后加空格。

反例：

```js
const obj = {
    name:'lucy',
    age:18
};
```

正例：

```js
const obj = {
    name: 'lucy',
    age: 18
};
```

##### 5) if / else / for / while / function / switch / do / try / catch / finally 关键字后，必须有一个空格。

##### 6) 函数调用的括号“(”前, 要出现空格。

##### 7) 注释符前后要有空格。

##### 不需要保留空格的情况:

##### 1) 一元操作符与其操作数之间不应有空格, 如: i++。除非操作符是个单词, 例如: typeof window。

##### 2) 点号前后不要出现空格。

##### 3) 空行不要有空格, 尾不要有空格。

##### 4) 空对象和数组不需要填入空格。[], {}

#### 1.5.10 回车（换行）

##### 1) 每个独立语句结束后必须换行。超长的不可分割的代码允许例外，比如复杂的正则表达式。长字符串不在例外之列。

##### 2) 运算符处换行时，运算符必须在新行的行首。

正例：

```js
if (user.isAuthenticated()
    && user.isInRole('admin')
    && user.hasAuthority('add-admin')
    || user.hasAuthority('delete-admin')
) {
    // Code
}

let result = number1 + number2 + number3
    + number4 + number5;
```

反例：

```js
if (user.isAuthenticated() &&
    user.isInRole('admin') &&
    user.hasAuthority('add-admin') ||
    user.hasAuthority('delete-admin')) {
    // Code
}

var result = number1 + number2 + number3 +
    number4 + number5;
```

##### 2) 不同行为或逻辑的语句集，使用空行隔开，更易阅读。

比如：

```js
// 仅为按逻辑换行的示例，不代表setStyle的最优实现
function setStyle(element, property, value) {
    if (element == null) {
        return;
    }

    element.style[property] = value;
}
```

##### 3) 在语句的行长度超过 120 时，根据逻辑条件合理缩进。

#### 1.5.11 注释

##### 1) 单行注释：必须独占一行。// 后跟一个空格，缩进与下一行被注释说明的代码一致。在注释前插入空行。

正例：

```js
function getType() {
  console.log('fetching type...');

  // set the default type to 'no type'
  const type = this._type || 'no type';

  return type;
}
```

反例：

```js
function getType() {
  console.log('fetching type...');
  // set the default type to 'no type'
  const type = this._type || 'no type';

  return type;
}
```

##### 2) 多行注释：避免使用 /*...*/ 这样的多行注释。有多行注释内容时，使用多个单行注释。

##### 3) 文档化注释：为了便于代码阅读和自文档化，内容必须包含以 /**...*/ 形式的块注释中。文档注释前必须空一行。

比如：

```js
/**
 * make() returns a new element
 * based on the passed in tag name
 *
 * @param {String} tag
 * @return {Element} element
 */
function make(tag) {

  // ...stuff...

  return element;
}
```

##### 4) 注释中定义类型：常用类型{string}, {number}, {boolean}, {Object}, {Function}, {RegExp}, {Array}, {Date}。

##### 5) TODO注释：原则上需要删除无用的注释代码，确实不能删除，需要加 TODO: 写明原因。或者其他想特别说明的（比如现在是临时解决办法）也可以用TODO写明。

比如：

```js
class Calculator {
  constructor() {
    // TODO: total should be configurable by an options param
    this.total = 0;
  }
}
```

**避免过度注释，定义一个好的变量，方法，类名，比注释更好**

注释原则

复杂的代码： 复杂业务/使用了难以理解的技术，取巧的实现方法
妥协的代码： 设计不好，但是为了实现业务又暂时没有其他更好选择
兼容性代码： 向下/平台兼容代码最好注释，避免误删

#### 1.5.12 条件

##### 1) 在 Equality Expression 中使用类型严格的 === 或者 !==。仅当判断 null 或 undefined 时，允许使用 == null。

正例：

```js
if (age === 30) {
    // ......
}
```

反例：

```js
if (age == 30) {
    // ......
}
```

##### 2) 尽可能使用简洁的表达式。

```js
if (!name) {
    // ......
}
if (collection.length) {
    // ......
}
```

反例：

```js
if (name === '') {
    // ......
}
if (collection.length > 0) {
    // ......
}
```

##### 3) 如果函数或全局中的 else 块后没有任何语句，可以删除 else。

#### 1.5.13 循环

##### 1) 对有序集合进行遍历时，缓存 length

正例：

```js
for (var i = 0, len = elements.length; i < len; i++) {
    var element = elements[i];
    // ......
}
```

反例：

```js
for (var i = 0; i < elements.length; i++) {
    var element = elements[i];
    // ......
}
```

#### 1.5.14 字符串模板

##### 1) 带有变量的字符串，使用字符串模版

正例：

```js
const name = 'lucy'
const greetings = `Hello ${name}`
```

反例：

```js
const name = 'lucy'
const greetings = 'Hello ' + name
```

##### 2) 换行的字符串

```js
const html = `
<article>
  <h1>Title here</h1>
  <p>This is a paragraph</p>
  <footer>Complete</footer>
</article>
`
```

#### 1.5.15 数组

##### 1) 简单数组（对象），使用扩展运算符（spread operator）... 复制数组（浅拷贝）

正例：

```js
const list = [1, 2, 3]
const result = [...list]
```

反例：

```js
const list = [1, 2, 3]
const result = list.concat()
```

##### 2) 充分使用数组方法，map, find, filter, foreach 等方法。

#### 1.5.16 对象

##### 1) 简写的属性放在前面

正例：

```js
const obj = {
  lukeSkywalker,
  anakinSkywalker,
  episodeOne: 1,
  twoJediWalkIntoACantina: 2,
  episodeThree: 3,
  mayTheFourth: 4
}
```

反例：

```js
const obj = {
  episodeOne: 1,
  twoJediWalkIntoACantina: 2,
  lukeSkywalker,
  episodeThree: 3,
  mayTheFourth: 4,
  anakinSkywalker
}
```

##### 2) 使用 . 来访问对象的属性。当通过变量访问属性时使用中括号 []。

正例：

```js
const obj = {
    name: 'lucy',
    age: 18
}

const name = obj.name

function getProp(prop) {
  return obj[prop];
}

const name = getProp('name');
```

反例：

```js
const obj = {
    name: 'lucy',
    age: 18
}

const name = obj['name']
```

##### 3) 对象的属性和方法，尽量采用简洁表达法，这样易于描述和书写。

正例：

```js
const atom = {
  value: 1,

  addValue(value) {
    return atom.value + value;
  },
};
```

反例：

```js
const atom = {
  value: 1,

  addValue: function (value) {
    return atom.value + value;
  },
};
```

#### 1.5.17 变量

##### 1) 避免使用全局变量

##### 2) 使用 let 代替 var

##### 3) 使用 const 声明常量

正例：

```js
// good
const a = 1;
const b = 2;
const c = 3;

// best
const [a, b, c] = [1, 2, 3];
```

反例：

```js
var a = 1, b = 2, c = 3;
```

##### 4) 删除未使用的变量（方法）

##### 5) 多次使用的命名空间，使用对象解构替换，简洁易读

正例：

```js
const { x, y } = obj
const [a, b] = arr

function getFullName(obj) {
  const { firstName, lastName } = obj;
  return `${firstName} ${lastName}`;
}
或者参数解构
function getFullName({ firstName, lastName }) {
  return `${firstName} ${lastName}`;
}
```

反例：

```js
const x = obj.x
const y = obj.y
const a = arr[0]
const b = arr[1]

function getFullName(user) {
  const firstName = user.firstName;
  const lastName = user.lastName;

  return `${firstName} ${lastName}`;
}
```

#### 1.5.18 模块

模块导入导出使用标准语法 import export

导入模块需要分类排列，比如第三方模块 自有模块等

每个模块不宜过大，最大行数控制在400行左右，过大可以重新考虑模块的划分

#### 1.5.19 定时器

定时器（setInterval或者setTimeout）的变量, 使用完后必须显式销毁, 从而可以及时的执行内存回收。
请执行 clearInterval 或者 clearTimeout。

#### 1.5.20 警告

eslint的警告需要处理，暂时不能处理的可以用 // eslint-disable-next-line 过滤

















 





















