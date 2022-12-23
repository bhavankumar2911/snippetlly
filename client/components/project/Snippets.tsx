import Editor from "@monaco-editor/react";
import {
  Button,
  Empty,
  Layout,
  Menu,
  message,
  Space,
  Tag,
  Typography,
} from "antd";
import { useRouter } from "next/router";
import React, { useState } from "react";
import API from "../../helpers/API";

interface Props {
  project: any;
  setProject: React.Dispatch<any>;
}

const Snippets: React.FC<Props> = ({ project, setProject }) => {
  const snippets = project.project.Snippets;
  const [snippet, setSnippet] = useState<any>(null);
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
              onClick={(e) =>
                setSnippet(
                  snippets.filter(
                    (snippet: { id: string }) => snippet.id == e.key
                  )[0]
                )
              }
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

            {snippet && (
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
                    <Typography.Title level={4}>Description</Typography.Title>
                    <Typography.Text>{snippet.description}</Typography.Text>
                  </div>
                  {snippet &&
                    (project.userId == snippet.UserId || project.isAuthor) && (
                      <Button
                        type="primary"
                        onClick={() => handleDelete(snippet.id)}
                        danger
                      >
                        Delete
                      </Button>
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
          </Layout.Content>
        </>
      )}
    </Layout>
  );
};

export default Snippets;
