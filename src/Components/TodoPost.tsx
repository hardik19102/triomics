import React from "react";
import { IPost } from "../Interfaces";

interface Props {
  task: IPost;
  completePost(taskNameToDelete: string): void;
}

const TodoPost = ({ task, completePost }: Props) => {
  return (
    <div className="task">
      <div className="content">
        <span className="context-box">{task.name}</span>
        <span className="context-box">{task.description}</span>
      </div>
      <button
        onClick={() => {
        completePost(task.name);
        }}
      >
        X
      </button>
    </div>
  );
};

export default TodoPost;
