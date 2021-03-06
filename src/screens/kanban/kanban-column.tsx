import React from "react";
import { Kanban } from "types/kanban";
import { useTasks } from "utils/task";
import { useTaskTypes } from "utils/task-type";
import { useKanbanQueryKey, useTasksModal, useTasksSearchParams } from "./util";
import taskIcon from "assets/task.svg";
import bugIcon from "assets/bug.svg";
import styled from "@emotion/styled";
import { Card, Dropdown, Menu, Modal } from "antd";
import { CreateTask } from "./createTask";
import { Task } from "types/task";
import { Row } from "components/lib";
import { Button } from "antd/lib/radio";
import { useDeleteKanban } from "utils/kanban";
import { Drag, DragChild, Drop, DropChild } from "components/drag-and-drop";
import Mark from "components/mark";

const { confirm } = Modal;

const TaskTypeIcon = ({ id }: { id: number }) => {
  const { data: taskTypes } = useTaskTypes();
  const name = taskTypes?.find((taskType) => taskType.id === id)?.name;
  if (!name) {
    return null;
  }
  return <img src={name === "task" ? taskIcon : bugIcon} alt="#" />;
};

const TaskCard = ({ task }: { task: Task }) => {
  const { startEdit } = useTasksModal();
  const { name: keyword } = useTasksSearchParams();
  return (
    <Card
      onClick={() => startEdit(task.id)}
      style={{ marginBottom: "0.5rem", cursor: "pointer" }}
    >
      <p>
        <Mark keyword={keyword} name={task.name} />
      </p>
      <TaskTypeIcon id={task.typeId} />
    </Card>
  );
};

export const KanbanColumn = ({ kanban }: { kanban: Kanban }) => {
  const { data: allTasks } = useTasks(useTasksSearchParams());
  const tasks = allTasks?.filter((task) => task.kanbanId === kanban.id);
  return (
    <KanbanContainer>
      <Row between={true}>
        <h3>{kanban.name}</h3>
        <More kanban={kanban} key={kanban.id} />
      </Row>

      <TaskContainer>
        <Drop type={"ROW"} direction={"vertical"} droppableId={"" + kanban.id}>
          <DropChild style={{ minHeight: "1rem" }}>
            {tasks?.map((task, index) => (
              <Drag
                key={task.id}
                draggableId={kanban.id + "_" + task.id}
                index={index}
              >
                <DragChild key={task.id} task={task}>
                  <TaskCard task={task} />
                </DragChild>
              </Drag>
            ))}
          </DropChild>
        </Drop>
        <CreateTask kanbanId={kanban.id} />
      </TaskContainer>
    </KanbanContainer>
  );
};

const More = ({ kanban }: { kanban: Kanban }) => {
  const { mutateAsync: deleteKanban } = useDeleteKanban(useKanbanQueryKey());

  const startDelete = () => {
    confirm({
      title: "Delete Kanban? It is not revertable",
      onOk: () => {
        deleteKanban({ id: Number(kanban.id) });
      },
    });
  };

  const overlay = (
    <Menu>
      <Menu.Item key={"delete"}>
        <Button onClick={startDelete}> Delete</Button>
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={overlay} trigger={["click"]}>
      <Button type={"link"}>...</Button>
    </Dropdown>
  );
};

export const KanbanContainer = styled.div`
  min-width: 27rem;
  border-radius: 6px;
  background-color: rgb(244, 245, 247);
  display: flex;
  flex-direction: column;
  padding: 0.7rem 0.7rem 1rem;
  margin-right: 1.5rem;
`;

const TaskContainer = styled.div`
  overflow: scroll;
  flex: 1;
  ::-webkit-scrollbar {
    display: none;
  }
`;
