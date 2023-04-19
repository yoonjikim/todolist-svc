const express = require('express');
const router = express.Router();
const todolistDao = require('./dao/todolistDao');

router.get("/", (req, res) => {
//   console.log("### GET /"); // 별도 미들웨어로 등록해도 됨
    res.render("index", {
    title: "todolist 서비스 v1.0",
    subtitle: "(node.js + express + lokijs)",
    });
});

router.get('/todolist/:owner', (req, res)=>{ // 조회
    const owner = req.params.owner
    let result = todolistDao.getTodoList({owner});
    res.json(result);
})

// router.post('/todolist/:owner', (req,res) => { // 추가. http body를 받아내야함
//     let { todo, desc } = req.body ; // request 객체
//     const owner = req.params.owner ; // 경로
//     const result = todol.addTodo({ owner, todo, desc });
//     res.json(result);
// }) // post는 postman 도구를 이용해야확인 가능

router.post('/todolist/:owner', (req,res)=>{
    let { todo, desc} = req.body;
    const owner = req.params.owner;
    const result = todolistDao.addTodo({ owner, todo, desc });
    res.json(result);
})

module.exports = router;