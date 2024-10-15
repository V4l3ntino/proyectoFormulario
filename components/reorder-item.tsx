"use client"
import * as React from "react";
import { useMotionValue, Reorder, useDragControls } from "framer-motion";
import { useRaisedShadow } from "./use-raised.shadow";
import {ReorderIcon} from "./reorder-icon";
import { TrashIcon } from "@heroicons/react/24/outline";

interface Props {
  item: string;
  deletOption: (nombre: string) => void
}

export const Item = ({ item, deletOption }: Props) => {
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
      <div><TrashIcon  className="w-5 h-5 hover:cursor-pointer" onClick={() => deletOption(item)}/></div>
      <span>{item}</span>
      <ReorderIcon dragControls={dragControls}/>
    </Reorder.Item>
  );
};
