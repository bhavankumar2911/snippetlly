import { DeleteFilled, EyeFilled, PlusOutlined } from "@ant-design/icons";
import {
  Alert,
  Button,
  Empty,
  Input,
  List,
  message,
  Modal,
  Popconfirm,
  Select,
  Space,
  Switch,
  Typography,
} from "antd";
import { useRouter } from "next/router";
import React, { SetStateAction, useState } from "react";
import API from "../../helpers/API";
import APIResponseMessage from "../../interfaces/APIResponseMessage";

interface Props {
  projects: any[];
  setProjects: React.Dispatch<SetStateAction<any[] | null>>;
}

const Projects: React.FC<Props> = ({ projects, setProjects }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creatingProject, setCreatingProject] = useState(false);
  const [responseMessage, setResponseMessage] = useState<APIResponseMessage>({
    show: false,
    type: null,
    message: null,
  });
  const [createdProject, setCreatedProject] = useState(null);
  const [project, setProject] = useState({
    name: "",
    description: "",
    isPublic: true,
  });
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [filteredProjects, setFilteredProjects] = useState([...projects]);
  const [filter, setFilter] = useState("all");
  const router = useRouter();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const createProject: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setCreatingProject(true);
    console.log(project);

    const apiResponse = await API.sendRequest("post", "/project", true, {
      ...project,
    });

    API.handleResponse(
      { ...apiResponse },
      setCreatingProject,
      setCreatedProject,
      setResponseMessage,
      router
    );

    if (apiResponse.responseOK) {
      setProject({
        name: "",
        description: "",
        isPublic: true,
      });
      setResponseMessage({
        show: false,
        type: null,
        message: null,
      });
      setIsModalOpen(false);
      setProjects([apiResponse.data, ...projects]);
      if (
        (apiResponse.data.isPublic && filter == "public") ||
        (!apiResponse.data.isPublic && filter == "private") ||
        filter == "all"
      )
        setFilteredProjects([apiResponse.data, ...filteredProjects]);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setResponseMessage({
      show: false,
      type: null,
      message: null,
    });
  };

  // delete project
  const deleteProject = async (id: string) => {
    setConfirmLoading(true);

    const {
      responseOK,
      noResponse,
      notAuthorized,
      message: resMessage,
    } = await API.sendRequest("delete", `/project/${id}`, true);

    if (noResponse) message.warning(resMessage);
    else if (notAuthorized) router.push("/login");
    else if (responseOK) {
      message.success(resMessage);
      setProjects([...projects.filter((project) => project.id != id)]);
      setFilteredProjects([
        ...filteredProjects.filter((project) => project.id != id),
      ]);
    } else message.warning(resMessage);

    setOpen(false);
    setConfirmLoading(false);
  };

  const filterProjects = (filter: string) => {
    setFilter(filter);
    if (filter == "public")
      setFilteredProjects([...projects.filter((project) => project.isPublic)]);
    else if (filter == "private")
      setFilteredProjects([...projects.filter((project) => !project.isPublic)]);
    else setFilteredProjects([...projects]);
  };

  console.log(filteredProjects.length);

  return (
    <section
      style={{
        backgroundColor: "#fff",
        padding: "2rem",
        borderRadius: "5px",
        marginTop: "3rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography.Title level={2}>Projects</Typography.Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
          Create new project
        </Button>

        {/* create project modal form */}
        <Modal
          title="Create project"
          open={isModalOpen}
          // onOk={createProject}
          onCancel={handleCancel}
          // okText="Create"
          // okButtonProps={{ disabled: creatingProject, htmlType: "submit" }}
          footer={null}
        >
          <form style={{ marginTop: "1rem" }} onSubmit={createProject}>
            <Space
              direction="vertical"
              size="middle"
              style={{ display: "flex" }}
            >
              {responseMessage.show && (
                <Alert
                  message={responseMessage.message}
                  type={responseMessage.type as "success" | "error"}
                  showIcon
                />
              )}
              <Input
                size="large"
                placeholder="Project name"
                type="text"
                name="name"
                value={project.name}
                onChange={(e) =>
                  setProject({ ...project, name: e.target.value })
                }
              />
              <Input.TextArea
                size="large"
                placeholder="Short description about the project"
                name="description"
                value={project.description}
                onChange={(e) =>
                  setProject({ ...project, description: e.target.value })
                }
              />
              <Space>
                <Typography.Text>Private</Typography.Text>
                <Switch
                  checked={!project.isPublic}
                  onChange={() =>
                    setProject({ ...project, isPublic: !project.isPublic })
                  }
                />
              </Space>
              <Button
                type="primary"
                htmlType="submit"
                disabled={creatingProject}
                size="large"
                block
              >
                {creatingProject ? "Creating..." : "Create"}
              </Button>
            </Space>
          </form>
        </Modal>
      </div>
      <div
        style={{
          marginTop: "2rem",
        }}
      >
        <div>
          <center>
            <Select
              defaultValue="all"
              style={{ width: "200px" }}
              onChange={filterProjects}
              options={[
                {
                  value: "all",
                  label: "All",
                },
                {
                  value: "private",
                  label: "Private",
                },
                {
                  value: "public",
                  label: "Public",
                },
              ]}
            />
          </center>
        </div>

        {filteredProjects.length == 0 && (
          <Empty
            description={`You don't have any ${
              filter == "all" ? "" : filter
            } projects`}
            style={{ marginTop: "2rem" }}
          />
        )}

        {filteredProjects.length > 0 && (
          <List
            itemLayout="horizontal"
            dataSource={filteredProjects}
            renderItem={(project) => (
              <List.Item>
                <Typography.Text>{project.name}</Typography.Text>
                <span>
                  <Button
                    type="link"
                    icon={<EyeFilled />}
                    href={`/project/${project.id}`}
                  >
                    View
                  </Button>
                  <Popconfirm
                    title="Are you sure to delete this project?"
                    onConfirm={() => deleteProject(project.id)}
                    onCancel={() => setOpen(false)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button type="text" icon={<DeleteFilled />} danger />
                  </Popconfirm>
                </span>
              </List.Item>
            )}
          />
        )}
      </div>
    </section>
  );
};

export default Projects;
