# 技术栈规范 (Tech Stack)

/**
 * 项目技术栈定义
 * Tech Stack Definitions
 */
export interface TechStack {
  /**
   * 编程语言
   */
  languages: {
    "JavaScript": "ES6+",
    "Python": "3.10+"
  };

  /**
   * 核心框架
   */
  frameworks: {
    "React": "19.2.4",
    "Konva": "10.2.0",
    "React Konva": "19.2.1"
  };

  /**
   * 关键依赖库
   */
  libraries: {
    "buffer": "6.0.3",
    "imagemin": "9.0.1",
    "imagemin-pngquant": "10.0.0",
    "jszip": "3.10.1",
    "tinypng-lib": "1.1.24"
  };

  /**
   * 构建与工具
   */
  tools: {
    "webpack": "5.75.0",
    "webpack-cli": "5.0.1",
    "webpack-dev-server": "4.11.1",
    "@babel/core": "7.20.5",
    "babel-loader": "9.1.0"
  };
}