import { Divider, Typography } from "antd";
import React from "react";
import IUserInfo from "../../interfaces/UserInfo";

interface Props {
  user: IUserInfo;
}

const UserInfo: React.FC<Props> = ({ user }) => {
  return (
    <section
      style={{
        backgroundColor: "#fff",
        padding: "2rem",
        borderRadius: "5px",
      }}
    >
      <Typography.Title level={2}>Personal</Typography.Title>
      <ul
        style={{
          listStyle: "none",
          padding: "0",
          marginTop: "2rem",
        }}
      >
        <li>
          <Typography.Text>
            <b>Name: </b>
          </Typography.Text>
          <Typography.Text>{user.name}</Typography.Text>
        </li>
        <Divider />
        <li>
          <Typography.Text>
            <b>Username: </b>
          </Typography.Text>
          <Typography.Text>{user.username}</Typography.Text>
        </li>
        <li>
          <Divider />
          <Typography.Text>
            <b>Email: </b>
          </Typography.Text>
          <Typography.Text>{user.email}</Typography.Text>
        </li>
      </ul>
    </section>
  );
};

export default UserInfo;
