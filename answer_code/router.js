const express = require('express');
const router = express.Router();
const todolistDao = require('./dao/todolistDao');

router.get("/", (req, res) => {
    console.log("### GET /");
    res.render("index", {
        title: "todolist 서비스 v1.0",
        subtitle: "(node.js + express + lokijs)",
    });
});

router.get("/todolist/:owner/create", async (req, res) => {
    const { owner } = req.params;
    const result = await todolistDao.createNewOwner({ owner });
    res.json(result);
});
  
router.get("/todolist/:owner", async (req, res) => {
    const owner = req.params.owner;
    const todolist = await todolistDao.getTodoList({ owner });
    res.json(todolist);
});
  
router.get("/todolist/:owner/:id", async (req, res) => {
    const { owner, id } = req.params;
    const todoitem = await todolistDao.getTodoItem({ owner, id });
    res.json(todoitem);
});
  
router.post("/todolist/:owner", async (req, res) => {
    const { owner } = req.params;
    let { todo, desc } = req.body;
    const result = await todolistDao.addTodo({ owner, todo, desc });
    res.json(result);
});
  
router.put("/todolist/:owner/:id", async (req, res) => {
    const { owner, id } = req.params;
    let { todo, completed, desc } = req.body;
    const result = await todolistDao.updateTodo({ owner, id, todo, desc, completed });
    res.json(result);
});
  
router.put("/todolist/:owner/:id/completed", async (req, res) => {
    const { owner, id } = req.params;
    const result = await todolistDao.toggleCompleted({ owner, id });
    res.json(result);
});
  
router.delete("/todolist/:owner/:id", async (req, res) => {
    const { owner, id } = req.params;
    const result = await todolistDao.deleteTodo({ owner, id });
    res.json(result);
});
  
//----에러 처리 시작
router.get("*", (req, res, next) => {
    const err = new Error();
    err.status = 404;
    next(err);
});

router.use((err, req, res, next) => {
    console.log("### ERROR!!");
    if (err.status === 404) {
        res.status(404).json({ status: 404, message: "잘못된 URI 요청" });
    } else if (err.status === 500) {
        res.status(500).json({ status: 500, message: "내부 서버 오류" });
    } else {
        res.status(err.status).jsonp({ status: "fail", message: err.message });
    }
});

module.exports = router;