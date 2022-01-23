import React, { FC, ChangeEvent, useState, useEffect } from "react";
import "./App.css";
import TodoTask from "./Components/TodoEvent";
import TodoPost from "./Components/TodoPost";
import DraggableArea from "./Components/DraggableArea";
import { IEvent, IPost } from "./Interfaces";
import axios from "axios";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const App: FC = () => {

  const defaultPosts:IPost[] = [];
  const defaultEvents: IEvent[] = [];

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [todoEvent, setTodoEvent] = useState<IEvent[]>(defaultEvents);
  const [posts, setPosts] = useState<IPost[]>(defaultPosts);
  const [content, setContent] = useState<string>("Drop something here");
  const [query, setQuery] = useState<string>("")
  const [activityQuery, setActivityQuery] = useState<string>("")
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  
  const eventCall = async () =>{
    await axios.get<IPost[]>("https://39480cf6-d2ac-44de-b113-ce52a5b8e509.mock.pstmn.io/api/events", {
        headers: {
          "Content-Type": "application/json"
        },
      }
    ).then(response => {
      setPosts(response.data);
    }).catch(ex => {
      const error =
      ex.response.status === 404
        ? "Resource Not found"
        : "An unexpected error has occurred";
    })}

    const activityCall = () =>{
      axios
      .get<IEvent[]>("https://39480cf6-d2ac-44de-b113-ce52a5b8e509.mock.pstmn.io/api/activities", {
          headers: {
            "Content-Type": "application/json"
          },
        }
      ).then(response => {
        console.log(response.data);
        setTodoEvent(response.data);
      }).catch(ex => {
        const error =
        ex.response.status === 404
          ? "Resource Not found"
          : "An unexpected error has occurred";
      })}

  useEffect(() => {
        eventCall();
        activityCall()
      }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if(event.target.name === "description"){
      setDescription(event.target.value);
    }else{
      setName(event.target.value);
    }
  }
  
  const addTask = (): void => {
    const newTask = {id: Math.floor(Math.random() * 1000) , name: name , description: description};
    console.log(newTask);
    setTodoEvent([...todoEvent, newTask])
    handleClose();
    console.log(todoEvent);
  }
  
  const completeEvent = (taskNameToDelete: String): void => {
    setTodoEvent(todoEvent.filter((task) => {
      return task.name != taskNameToDelete
    }));
  }

  const completePost = (taskNameToDelete: String): void => {
      setPosts(posts.filter((task) => {
        return task.name != taskNameToDelete
      }
    )
      );
  }

  // This function will be triggered when you start dragging
  const dragStartHandler = (
    event: React.DragEvent<HTMLDivElement>,
    data: string
  ) => {
    event.dataTransfer.setData("text", data);
  };

  // This function will be triggered when dropping
  const dropHandler = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    setContent(data);
  };

  // This makes the third box become droppable
  const allowDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const downloadFile = ({ data, fileName, fileType }) => {
    // Create a blob with the data we want to download as a file
    const blob = new Blob([data], { type: fileType })
    // Create an anchor element and dispatch a click event on it
    // to trigger a download
    const a = document.createElement('a')
    a.download = fileName
    a.href = window.URL.createObjectURL(blob)
    const clickEvt = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    })
    a.dispatchEvent(clickEvt)
    // a.remove()
  }

  const exportToJson = e => {
    e.preventDefault()
    downloadFile({
      data: JSON.stringify(todoEvent),
      fileName: 'users.json',
      fileType: 'text/json',
    })
  }

  return (
    <div className="App">
      <div className="header">
        <Button variant="contained" onClick={handleClickOpen}  style={{marginRight: "10vh"}}>Add Task</Button>
          <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Enter Details</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              type="text"
              placeholder="Name"
              name="name "
              value={name}
              onChange={handleChange}
              fullWidth
              variant="standard"
            />
            <TextField
              autoFocus
              margin="dense"
              type="text"
              placeholder="description"
              name="description"
              value={description}
              onChange={handleChange}
              fullWidth
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={addTask}>Add Task</Button>
          </DialogActions>
        </Dialog>
        <Button variant="contained" onClick={exportToJson} style={{marginRight: "10vh"}}>Export</Button>
        {/* <button onClick={exportToJson}>Export</button> */}
      </div>
      <div className="todoList">
        <div className="events">
          {/* <input placeholder="Event Search" onChange={(event) => setActivityQuery(event.target.value)}/> */}
          <TextField id="outlined-basic" variant="outlined" placeholder="Event Search" onChange={(event) => setActivityQuery(event.target.value)} style={{width: "100%", backgroundColor: "white", borderRadius: "10px", marginTop: "10px"}} />
          {posts
          .filter((post) => {
            if(activityQuery==""){
              return post
            }else if(post.name.toLowerCase().includes(activityQuery.toLowerCase())){
              return post;
            }
          })
          .map((task: IPost, key: number) => {
              return <TodoPost key={key} task={task} completePost={completePost} />;
          })
          }
        </div>
        <div className="draggable-area" onDragOver={allowDrop} onDrop={dropHandler}>
          <DraggableArea task={content}/>
        </div>
        <div className="activites">
          {/* <input placeholder="Activity Search" onChange={(event) => setQuery(event.target.value)}/> */}
          <TextField id="outlined-basic" variant="outlined" placeholder="Activity Search" onChange={(event) => setQuery(event.target.value)} style={{width: "100%", backgroundColor: "white", borderRadius: "10px", marginTop: "10px"}}/>
          {todoEvent
            .filter((event) => {
              if(query==""){
                return event
              }else if(event.name.toLowerCase().includes(query.toLowerCase())){
                return event;
              }
            })
            .map((task: IEvent, key: number) => {
              return <div onDragStart={(event) => dragStartHandler(event, task.name + " : " + task.description)} draggable={true}><TodoTask key={key} task={task} completeEvent={completeEvent} /></div>;
            })
          }
        </div>
        </div>
      </div>
  );
};

export default App;