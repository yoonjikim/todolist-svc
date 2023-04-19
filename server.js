const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const rfs = require('rotating-file-stream');

const dotenv = require('dotenv');

process.env.NODE_ENV = process.env.NODE_ENV && process.env.NODE_ENV === "production" ? "production" : "development";
if (process.env.NODE_ENV !== "production") {
  dotenv.config();      //.env 파일 로딩
}

const router = require('./router');

const startServer = async () => {
  const BASEDIR = process.env.BASEDIR || path.resolve('.');
  const LOGDIR = process.env.LOGDIR|| path.join(BASEDIR, '/log')
  const PORT = process.env.PORT || 8080;

  const logger = (req, res, next) => {
    console.log(`### ${req.method} ${req.url}`);
    next();
  };

  const app = express();

  //cors 설정
  app.use(cors());

  //로깅
  fs.existsSync(LOGDIR) || fs.mkdirSync(LOGDIR)
  const accessLogStream = rfs.createStream('access.log', {
    interval: '1d', // 매일 매일 로그 파일 생성
    path: LOGDIR
  })
  app.use(morgan('combined', {stream: accessLogStream}))



  app.use(logger);
  app.use(express.static(BASEDIR + '/public'));
  app.set('views', BASEDIR + '/views');
  app.set('view engine', 'ejs');
  app.engine('html', require('ejs').renderFile);
  app.use(express.json());
  app.use(express.urlencoded({
    extended: true
  }));

  app.use(function (req, res, next) {
    res.header('Cache-Control', 
         'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next()
});

  app.use(router);

  app.listen(PORT, () => {
    console.log(`#### ${PORT} 에서 서버가 시작되었습니다`);
  });
};

startServer();