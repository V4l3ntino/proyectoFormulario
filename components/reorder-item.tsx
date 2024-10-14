"use client"
import * as React from "react";
import { useMotionValue, Reorder, useDragControls } from "framer-motion";
import { useRaisedShadow } from "./use-raised.shadow";
import {ReorderIcon} from "./reorder-icon";

interface Props {
  item: string;
}

export const Item = ({ item }: Props) => {
  const y = useMotionValue(0);
  const boxShadow = useRaisedShadow(y);
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={item}
      id={item}
      style={{ boxShadow, y , touchAction:"none"}}
      dragListener={false}
      dragControls={dragControls}
      className="p-5 rounded-lg bg-slate-200 flex justify-between items-center"
    >
      <span>{item}</span>
      <ReorderIcon dragControls={dragControls}/>
    </Reorder.Item>
  );
};
