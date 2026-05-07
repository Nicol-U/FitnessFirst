import React from "react";
import DropDown, { DropdownItem } from "../Components/CustomButton";

export function Login() {
  const items = [1, 2];

  return (
    <div
      style={{
        padding: "1rem",
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100%",
        backgroundColor: "black",
        color: "white",
      }}
    >
      <h1>Login</h1>

      <DropDown
        buttonText="Drop Down"
        content={
          <>
            {items.map((item) => (
              <DropdownItem key={item}>
                Item {item}
              </DropdownItem>
            ))}
          </>
        }
      />
    </div>
  );
}

export default Login;