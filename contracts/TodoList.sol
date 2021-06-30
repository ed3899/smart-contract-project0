//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.6;

contract TodoList {
    uint256 public taskCount = 0;
    struct Task {
        uint256 id;
        string content;
        bool completed;
    }
    mapping(uint256 => Task) public tasks;

    event TaskCreated(
        uint256 indexed id,
        string indexed content,
        string nI_content,
        bool indexed completed
    );

    event TaskUpdated(uint256 indexed id, bool completed);

    constructor() {
        createTask("First task");
    }

    function createTask(string memory _content) public {
        taskCount++;
        tasks[taskCount] = Task({
            id: taskCount,
            content: _content,
            completed: false
        });
        Task memory newTask = tasks[taskCount];
        emit TaskCreated(
            newTask.id,
            newTask.content,
            newTask.content,
            newTask.completed
        );
    }

    function toggleCompleted(uint256 _id) public {
        Task memory _task = tasks[_id];
        _task.completed = !_task.completed;
        tasks[_id] = _task;
        emit TaskUpdated(_id, tasks[_id].completed);
    }
}
