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
    }
}
