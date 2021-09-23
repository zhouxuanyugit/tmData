# 一、项目版本规约

### (一) 完整的流程

如图：

![Image text](http://dev.360tianma.com/public/ossUploadJs/git1.png)

一般来说开发者只有feature/version代码权限，迭代完成，测试通过后再merge。

### (二) 简化的流程

#### 2.1.1 现有开发模式(客户端除外)

如图：

![Image text](http://dev.360tianma.com/public/ossUploadJs/git2.png)

android/ios 是独立的开发，打包，上架

前端的工程则需要独立开发后，打包放到服务器端

#### 2.1.2 基于现有的开发模式和版本管理的需求可以使用下面的流程

如图：

![Image text](http://dev.360tianma.com/public/ossUploadJs/git3.png)



#### 2.1.3 分支管理

##### 项目每次迭代必须新建分支开发，以便版本追踪。

分支命名规范：

迭代版本用v开头，比如V1.0.0, V1.7.1等
紧急bug或者临时需求feature，命名用 [featureName]
非必要情况不能随意删除分支

打分支步骤参考：

```js
git checkout -b newBranch origin/master
git push origin newBranch
git branch --set-upstream-to=origin/master
```

合并步骤参考：

比如开发分支（dev）上的代码达到上线的标准后，要合并到 master 分支

```js
git checkout dev
git pull
git checkout master
git merge dev
git push -u origin master
```

当master代码改动了，需要更新开发分支（dev）上的代码

```js
git checkout master 
git pull 
git checkout dev
git merge master 
git push -u origin dev
```

#### 2.1.4 git 其他常用命令

##### 1) 日志

```js
git log                     //能查看commit id
```

##### 2) 回滚

```js
git reset —hard head^         //回退到上一个版本
git reset —hard head^^        //回退到上上个版本
git reset —hard commit_id    //回到某个版本号的版本
```

##### 3) 暂存区

```js
git stash save "save message" //执行存储时，添加备注，方便查找
git stash list                //查看stash了哪些存储
git stash apply               //应用某个存储,但不会把存储从存储列表中删除，默认使用第一个存储, 即stash@{0}
git stash apply stash@{$num}  //应用其他的，比如第二个：git stash apply stash@{1}
git stash clear               //删除所有缓存的stash
```