import { CloseOutlined } from "@ant-design/icons";
import Editor from "@monaco-editor/react";
import {
  Button,
  Col,
  Empty,
  Input,
  Layout,
  Menu,
  message,
  Row,
  Select,
  Space,
  Tag,
  Typography,
} from "antd";
import { useRouter } from "next/router";
import React, { useState } from "react";
import API from "../../helpers/API";
import { supportedLanguages } from "./AddSnippet";

interface Props {
  project: any;
  setProject: React.Dispatch<any>;
}

const Snippets: React.FC<Props> = ({ project, setProject }) => {
  const snippets = project.project.Snippets;
  const [snippet, setSnippet] = useState<any>(null);
  const [editSnippet, setEditSnippet] = useState(false);
  const [editorLanguage, setEditorLanguage] = useState("javascript");
  const router = useRouter();

  console.log("selected snippet", snippet);

  const handleDelete = async (id: string) => {
    const {
      responseOK,
      noResponse,
      notAuthorized,
      message: resMessage,
    } = await API.sendRequest("delete", `/snippet/${id}`, true);

    if (responseOK) {
      message.success(resMessage);
      const tempSnippets = snippets.filter(
        (snippet: { id: string }) => snippet.id != id
      );

      setProject({
        ...project,
        project: { ...project.project, Snippets: [...tempSnippets] },
      });

      setSnippet(null);
    } else if (noResponse) message.error(resMessage);
    else if (notAuthorized) router.push("/login");
    else message.error(resMessage);
  };

  const updateSnippet: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const {
      responseOK,
      noResponse,
      message: resMessage,
      notAuthorized,
    } = await API.sendRequest("put", `/snippet/${snippet.id}`, true, {
      name: snippet.name,
      description: snippet.description,
      code: snippet.code,
      language: snippet.language,
    });

    if (responseOK) {
      const tempSnippets = project.project.Snippets.map(
        (tempSnippet: { id: string }) => {
          if (tempSnippet.id == snippet.id) return { ...snippet };
          else return { ...tempSnippet };
        }
      );

      setProject({
        ...project,
        project: { ...project.project, Snippets: [...tempSnippets] },
      });

      setEditSnippet(false);
      message.success(resMessage);
    } else if (noResponse) message.warning(resMessage);
    else if (notAuthorized) router.push("/login");
    else message.error(resMessage);
  };

  return (
    <Layout>
      {snippets.length == 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
          }}
        >
          <Empty description="Oh! Oh! This project has no code snippets" />
        </div>
      )}

      {snippets.length > 0 && (
        <>
          <Layout.Sider theme="light" style={{ minHeight: "100vh" }}>
            <Menu
              style={{ border: "none" }}
              onClick={(e) => {
                const tempSnippet = snippets.filter(
                  (snippet: { id: string }) => snippet.id == e.key
                )[0];
                setEditSnippet(false);
                setEditorLanguage(tempSnippet.language);
                setSnippet({ ...tempSnippet });
              }}
              mode="inline"
              items={snippets.map(
                (snippet: { id: string; name: string }, index: string) => ({
                  key: snippet.id,
                  label: snippet.name,
                })
              )}
            />
          </Layout.Sider>
          <Layout.Content>
            {!snippet && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "100vh",
                }}
              >
                <Empty description="Select a snippet from the left menu" />
              </div>
            )}

            {snippet && !editSnippet && (
              <div
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "5px",
                  margin: "2rem auto 0 auto",
                  width: "80%",
                  padding: "1rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <Space>
                      <Typography.Title level={2}>
                        {snippet.name}
                      </Typography.Title>
                      <Tag color="blue">{snippet.language}</Tag>
                    </Space>
                    {snippet.description && (
                      <div>
                        <Typography.Title level={4}>
                          Description
                        </Typography.Title>
                        <Typography.Text>{snippet.description}</Typography.Text>
                      </div>
                    )}
                  </div>
                  {snippet &&
                    (project.userId == snippet.UserId || project.isAuthor) && (
                      <Space>
                        <Button onClick={() => setEditSnippet(true)}>
                          Edit
                        </Button>
                        <Button
                          type="primary"
                          onClick={() => handleDelete(snippet.id)}
                          danger
                        >
                          Delete
                        </Button>
                      </Space>
                    )}
                </div>
                <div
                  style={{
                    borderRadius: "5px",
                    overflow: "hidden",
                    marginTop: "10px",
                  }}
                >
                  <Editor
                    theme="vs-dark"
                    height="400px"
                    language={snippet.language}
                    value={snippet.code}
                    options={{ domReadOnly: true, readOnly: true }}
                  />
                </div>
              </div>
            )}

            {snippet && editSnippet && (
              <form
                onSubmit={updateSnippet}
                style={{
                  margin: "3rem auto 0 auto",
                  backgroundColor: "#fff",
                  padding: "24px",
                  borderRadius: "5px",
                  width: "80%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "2rem",
                  }}
                >
                  <Typography.Title level={3} style={{ margin: 0 }}>
                    Edit snippet
                  </Typography.Title>

                  <Button
                    icon={<CloseOutlined />}
                    type="text"
                    onClick={() => {
                      setSnippet({
                        ...project.project.Snippets.filter(
                          (item: { id: string }) => item.id == snippet.id
                        )[0],
                      });
                      setEditSnippet(false);
                    }}
                    danger
                  >
                    Cancel
                  </Button>
                </div>
                <Row gutter={7}>
                  <Col span={12}>
                    <Input
                      size="large"
                      placeholder="Snippet name"
                      value={snippet.name}
                      onChange={(e) =>
                        setSnippet({ ...snippet, name: e.target.value })
                      }
                    />
                  </Col>
                  <Col span={12}>
                    <Select
                      size="large"
                      style={{ width: "100%" }}
                      showSearch
                      placeholder="Select a language"
                      optionFilterProp="children"
                      value={snippet.language}
                      onChange={(value) => {
                        setSnippet({ ...snippet, language: value });
                        setEditorLanguage(value);
                      }}
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={supportedLanguages}
                    />
                  </Col>
                </Row>
                <Input.TextArea
                  size="large"
                  placeholder="Snippet description"
                  style={{ marginTop: "10px" }}
                  value={snippet.description}
                  onChange={(e) =>
                    setSnippet({ ...snippet, description: e.target.value })
                  }
                />
                <div
                  style={{
                    borderRadius: "5px",
                    overflow: "hidden",
                    marginTop: "10px",
                  }}
                >
                  <Editor
                    theme="vs-dark"
                    height="400px"
                    defaultValue="// write code here"
                    language={editorLanguage}
                    onChange={(value) =>
                      setSnippet({ ...snippet, code: value })
                    }
                    value={snippet.code}
                  />
                </div>
                <br />
                <Button type="primary" htmlType="submit" size="large" block>
                  Update Snippet
                </Button>
              </form>
            )}
          </Layout.Content>
        </>
      )}
    </Layout>
  );
};

export default Snippets;
