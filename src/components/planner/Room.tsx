import React from "react";
import Walls from "./Walls";
import Floor from "./Floor";

export default function Room() {
  return (
    <group>
      <Floor />
      <Walls />
    </group>
  );
}
