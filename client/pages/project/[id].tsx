import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import API from "../../helpers/API";
import Oops from "../../components/helpers/Oops";
import { Layout, Menu, MenuProps, Typography } from "antd";
import { CodeOutlined, UserOutlined } from "@ant-design/icons";
import CodeSnippets from "../../components/project/CodeSnippets";
import Members from "../../components/project/Members";
import FullPageLoader from "../../components/helpers/FullPageLoader";

const Project: React.FC = () => {
  const [error, setError] = useState<null | string>(null);
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [navComponent, setNavComponent] = useState("members");
  const [loading, setLoading] = useState(true);
  const id = router.query.id;

  useEffect(() => {
    if (id) {
      (async () => {
        const { responseOK, message, data } = await API.sendRequest(
          "get",
          `/project/${id}`,
          true
        );

        setLoading(false);

        if (responseOK) {
          console.log("project", data);

          setProject(data);
        } else setError(message);
      })();
    }
  }, [id]);

  const navSelect: MenuProps["onClick"] = (e) => {
    setNavComponent(e.key);
  };

  return (
    <main>
      {/* loading */}
      {loading && <FullPageLoader loadingText="Loading project..." />}
      {!loading && error && <Oops message={error} />}
      {!loading && !error && project && id && (
        <Layout>
          <Layout.Sider
            theme="light"
            style={{ minHeight: "100vh", border: "1px solid #eee" }}
          >
            <Menu
              style={{ border: "none" }}
              onClick={navSelect}
              mode="inline"
              defaultSelectedKeys={["members"]}
              items={[
                {
                  key: "snippets",
                  icon: <CodeOutlined />,
                  label: "Code snippets",
                },
                {
                  key: "members",
                  icon: <UserOutlined />,
                  label: "Members",
                },
              ]}
            />
          </Layout.Sider>
          <Layout.Content>
            {/* project */}
            <center>
              <Typography.Title style={{ marginTop: "2rem" }}>
                {project.project.name}
              </Typography.Title>
            </center>

            {/* code snippets */}
            {navComponent == "snippets" && <CodeSnippets />}

            {/* members */}
            {navComponent == "members" && (
              <Members
                project={project}
                isAuthor={project.isAuthor}
                setProject={setProject}
                id={id as string}
              />
            )}
          </Layout.Content>
        </Layout>
      )}
    </main>
  );
};

export default Project;
