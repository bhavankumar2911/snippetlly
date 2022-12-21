import { Button, Col, Input, message, Row, Select, Typography } from "antd";
import React, { Dispatch, useState } from "react";
import Editor from "@monaco-editor/react";
import API from "../../helpers/API";
import { useRouter } from "next/router";

interface Props {
  project: any;
  setProject: Dispatch<any>;
}

const CodeSnippet: React.FC<Props> = ({ project, setProject }) => {
  const [editorLanguage, setEditorLanguage] = useState("javascript");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState(`
  /*
    write code here
  */
  `);
  const router = useRouter();

  const supportedLanguages = [
    { value: "typescript", label: "TypeScript" },
    { value: "javascript", label: "JavaScript" },
    { value: "css", label: "CSS" },
    { value: "less", label: "LESS" },
    { value: "scss", label: "SCSS" },
    { value: "json", label: "JSON" },
    { value: "html", label: "HTML" },
    { value: "xml", label: "XML" },
    { value: "php", label: "PHP" },
    { value: "c#", label: "C#" },
    { value: "c++", label: "C++" },
    { value: "razor", label: "Razor" },
    { value: "markdown", label: "Markdown" },
    { value: "diff", label: "Diff" },
    { value: "java", label: "Java" },
    { value: "vb", label: "VB" },
    { value: "coffeescript", label: "CoffeeScript" },
    { value: "handlebars", label: "Handlebars" },
    { value: "batch", label: "Batch" },
    { value: "pug", label: "Pug" },
    { value: "f#", label: "F#" },
    { value: "lua", label: "Lua" },
    { value: "powershell", label: "Powershell" },
    { value: "python", label: "Python" },
    { value: "ruby", label: "Ruby" },
    { value: "sass", label: "SASS" },
    { value: "r", label: "R" },
    { value: "objective-c", label: "Objective-C" },
  ];

  const saveSnippet: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const {
      responseOK,
      noResponse,
      data,
      message: resMessage,
      notAuthorized,
    } = await API.sendRequest(
      "post",
      `/project/snippet/${project.project.id}`,
      true,
      { name, description, language: editorLanguage, code }
    );

    if (responseOK) {
      setName("");
      setDescription("");
      setCode(`
      /*
        write code here
      */
      `);
      message.success(resMessage);
    } else {
      if (noResponse) message.error(resMessage);
      else if (notAuthorized) router.push("/login");
      else message.error(resMessage);
    }
  };

  return (
    <section style={{ width: "80%", margin: "0 auto" }}>
      <center>
        <Typography.Title style={{ marginTop: "3rem" }}>
          {project.project.name}
        </Typography.Title>
      </center>

      {project.isMember && (
        <form
          onSubmit={saveSnippet}
          style={{
            margin: "3rem 0",
            backgroundColor: "#fff",
            padding: "24px",
            borderRadius: "5px",
          }}
        >
          <Typography.Title level={3} style={{ marginBottom: "2rem" }}>
            Add code snippet
          </Typography.Title>
          <Row gutter={7}>
            <Col span={12}>
              <Input
                size="large"
                placeholder="Snippet name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Col>
            <Col span={12}>
              <Select
                size="large"
                style={{ width: "100%" }}
                showSearch
                placeholder="Select a language"
                optionFilterProp="children"
                value={editorLanguage}
                onChange={(value) => setEditorLanguage(value)}
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
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
              onChange={(value) => setCode(value as string)}
              value={code}
            />
          </div>
          <br />
          <Button type="primary" htmlType="submit" size="large" block>
            Save code
          </Button>
        </form>
      )}
    </section>
  );
};

export default CodeSnippet;
