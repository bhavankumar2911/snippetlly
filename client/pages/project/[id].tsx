import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import API from "../../helpers/API";
import Oops from "../../components/helpers/Oops";
import { Layout, Menu, MenuProps } from "antd";
import { CodeOutlined, UserOutlined } from "@ant-design/icons";
import CodeSnippets from "../../components/project/CodeSnippets";
import Members from "../../components/project/Members";

const Project: React.FC = () => {
  const [error, setError] = useState<null | string>(null);
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [navComponent, setNavComponent] = useState("snippets");
  const id = router.query.id;

  useEffect(() => {
    if (id) {
      (async () => {
        const { responseOK, message, data } = await API.sendRequest(
          "get",
          `/project/${id}`,
          true
        );

        if (responseOK) setProject(data);
        else setError(message);
      })();
    }
  }, [id]);

  const navSelect: MenuProps["onClick"] = (e) => {
    setNavComponent(e.key);
  };

  return (
    <main>
      {error && <Oops message={error} />}
      {!error && (
        <Layout>
          <Layout.Sider
            theme="light"
            style={{ minHeight: "100vh", border: "1px solid #eee" }}
          >
            <Menu
              style={{ border: "none" }}
              onClick={navSelect}
              mode="inline"
              defaultSelectedKeys={["snippets"]}
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
            {/* code snippets */}
            {navComponent == "snippets" && <CodeSnippets />}

            {/* members */}
            {navComponent == "members" && <Members />}
          </Layout.Content>
        </Layout>
      )}
    </main>
  );
};

export default Project;
