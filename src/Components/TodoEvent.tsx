import React from "react";
import { IEvent } from "../Interfaces";

interface Props {
  task: IEvent;
  completeEvent(taskNameToDelete: string): void;
}

const TodoEvent = ({ task, completeEvent }: Props) => {
  return (
    <div className="task">
      <div className="content">
        <span className="context-box">{task.name}</span>
        <span className="context-box">{task.description}</span>
      </div>
      <button
        onClick={() => {
          completeEvent(task.name);
        }}
      >
        X
      </button>
    </div>
  );
};

export default TodoEvent;
