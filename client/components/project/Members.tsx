import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Input, List, message, Space, Tag, Typography } from "antd";
import { useRouter } from "next/router";
import React, { Dispatch, useState } from "react";
import API from "../../helpers/API";
import Container from "../helpers/Container";

interface Props {
  project: any;
  isAuthor: boolean;
  setProject: Dispatch<any>;
  id: string;
}

const Members: React.FC<Props> = ({ project, isAuthor, setProject, id }) => {
  console.log("project from members section", project);

  const [addingUser, setAddingUser] = useState(false);
  const [username, setUsername] = useState("");
  const router = useRouter();

  console.log(isAuthor);

  // add user to project
  const addUser: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setAddingUser(true);
    const {
      responseOK,
      noResponse,
      data,
      message: resMessage,
      notAuthorized,
    } = await API.sendRequest("post", `/project/${id}`, true, { username });

    console.log("data------", data);
    console.log("inserted data", {
      ...project,
      project: {
        ...project.project,
        Users: [{ ...data }, ...project.project.Users],
      },
    });

    setAddingUser(false);

    if (responseOK) {
      message.success(resMessage);

      setProject({
        ...project,
        project: {
          ...project.project,
          Users: [{ ...data }, ...project.project.Users],
        },
      });
      setUsername("");
    } else if (noResponse) {
      message.error(resMessage);
    } else if (notAuthorized) router.push("/login");
    else message.error(resMessage);
  };

  const removeUser = async (username: string) => {
    const {
      responseOK,
      noResponse,
      notAuthorized,
      message: resMessage,
    } = await API.sendRequest("post", `/project/remove-member/${id}`, true, {
      username,
    });

    if (responseOK) {
      message.success(resMessage);

      setProject({
        ...project,
        project: {
          ...project.project,
          Users: [
            ...project.project.Users.filter(
              (user: { username: string }) => user.username != username
            ),
          ],
        },
      });
    } else if (noResponse) {
      message.error(resMessage);
    } else if (notAuthorized) router.push("/login");
    else message.error(resMessage);
  };

  return (
    <section>
      <center>
        <Typography.Title style={{ marginTop: "3rem" }}>
          {project.project.name}
        </Typography.Title>
      </center>
      <Container>
        <Typography.Title level={2}>Members</Typography.Title>

        {isAuthor && (
          <form
            onSubmit={addUser}
            style={{
              marginTop: "2rem",
              backgroundColor: "#fff",
              padding: "24px",
              borderRadius: "5px",
            }}
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              <label htmlFor="username">Add user to this project</label>
              <Input.Group
                style={{ width: "100%", marginTop: "0.5rem" }}
                compact
              >
                <Input
                  style={{ width: "80%" }}
                  placeholder="Enter username"
                  name="username"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Button
                  htmlType="submit"
                  type="primary"
                  style={{ width: "20%" }}
                  icon={<PlusOutlined />}
                  loading={addingUser}
                >
                  {addingUser ? "Adding" : "Add User"}
                </Button>
              </Input.Group>
            </Space>
          </form>
        )}

        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "5px",
            marginTop: "2rem",
          }}
        >
          <List
            dataSource={project.project.Users}
            renderItem={(member: any) => (
              <List.Item>
                <Space direction="vertical" size="small">
                  <Typography.Text>
                    {member.name}
                    {member.id == project.project.authorId ? (
                      <Tag color="green" style={{ marginLeft: "0.5rem" }}>
                        Owner
                      </Tag>
                    ) : (
                      ""
                    )}
                  </Typography.Text>
                  <Typography.Text type="secondary">
                    <small>@{member.username}</small>
                  </Typography.Text>
                </Space>
                {isAuthor && member.id !== project.project.authorId && (
                  <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    onClick={() => removeUser(member.username)}
                    danger
                  >
                    Remove
                  </Button>
                )}
              </List.Item>
            )}
          />
        </div>
      </Container>
    </section>
  );
};

export default Members;
