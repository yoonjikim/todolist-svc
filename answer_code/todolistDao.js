const { Todo } = require('./todolistDB');

exports.createNewOwner = async ({ owner }) => {
  try {
    let count = await Todo.countDocuments({ owner });
    console.log(count);
    if (count === 0) {
      let todo1 = new Todo({ owner, todo: "ES6 공부", desc: "ES6공부를 해야 합니다" })
      let todo2 = new Todo({ owner, todo: "Vue 학습", desc: "React 학습을 해야 합니다" })
      let todo3 = new Todo({ owner, todo: "야구장", desc: "프로야구 경기도 봐야합니다." })
      await todo1.save();
      await todo2.save();
      await todo3.save();      
      return { status: "success", message: "샘플 데이터 생성 성공!" };
    } else {
      return { status: "fail", message: "생성 실패 : 이미 존재하는 owner입니다." };
    }
  } catch (ex) {
    return { status: "fail", message: "생성 실패 : " + ex };
  }
};

exports.getTodoList = async ({ owner }) => {
  try {
    let todolist = await Todo.find({ owner }).sort({ _id: -1 });
    todolist = todolist.map((t)=> {
      let { _id, users_id, todo, desc, completed} = t;
      return { id:_id, users_id, todo, desc, completed };
    })
    return { status: "success", todolist };
  } catch (ex) {
    return { status: "fail", message: "조회 실패 : " + ex };
  }
};

exports.getTodoItem = async ({ owner, id }) => {
  try {
    let todoOne = await Todo.findOne({ owner, _id:id });
    if (todoOne) {
      let { _id, owner, todo, desc, completed } = todoOne;
      return { status : "success", todoitem: { id:_id, owner, todo, desc, completed } };
    } else {
      return { status : "fail", message: "할일(Todo)이 존재하지 않습니다." };
    }
  } catch (ex) {
    return { status: "fail", message: "조회 실패 : " + ex };
  }
};

exports.addTodo = async ({ owner, todo, desc }) => {
  try {
    if (todo === null || todo.trim() === "") {
      throw new Error("할일을 입력하셔야 합니다.");
    }
    let todoitem = new Todo({ owner, todo, desc });
    await todoitem.save();
    return { status: "success", message: "추가 성공", item: { id: todoitem._id, owner, todo, desc } };
  } catch (ex) {
    return { status: "fail", message: "추가 실패 : " + ex };
  }
};

exports.updateTodo = async ({ owner, id, todo, desc, completed }) => {
  try {
      let result = await Todo.updateOne({ _id:id, owner }, { todo, desc, completed })
      if (result.matchedCount === 1) {
          return { status:"success", message:"할일 업데이트 성공", todoitem : { id, todo, desc, completed } };
      } else {
          return { status:"fail", message:"할일 업데이트 실패", result };
      }
  } catch (ex) {
    return { status: "fail", message: "할일 변경 실패 : " + ex };
  }
};

exports.deleteTodo = async ({ owner, id }) => {
  try {
      await Todo.deleteOne({ owner, _id:id });
      return { status: "success", message: "삭제 성공", item: { id } };
  } catch (ex) {
    return { status: "fail", message: "삭제 실패 : " + ex };
  }
};

exports.toggleCompleted = async ({ owner, id }) => {
  try {
      let todoOne = await Todo.findOne({ owner, _id:id });
      let completed = !todoOne.completed;
      let result = await Todo.updateOne({ _id:id, owner }, { completed })
      if (result.matchedCount === 1) {
          return { status:"success", message:"할일 완료 처리 성공", todoitem: { id, completed }};
      } else {
          return { status:"fail", message:"할일 완료 처리 실패", result };
      }
  } catch (ex) {
      return { status: "fail", message: "완료 변경 실패 : " + ex };
  }
};
