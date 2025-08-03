"use client";
import Notes from "@/components/Notes";
import Todo from "@/components/Todo";
import React, { useState } from "react";

const Page = () => {
  const [todo, setTodo] = useState<boolean>(true);
  return (
    <div className=" pt-10 pb-10 px-6 sm:px-12 md:px-28 mt-20">
      <div className="flex items-center justify-center">
        <div className="border-2 border-gray-400 w-full md:w-1/4 lg:w-1/4 rounded-l-full rounded-r-full text-center flex items-center justify-evenly">
          <button title="todo" className={`text-xl md:text-3xl lg:text-3xl text-gray-400 hover:text-black ${todo ? "text-black" : "text-gray-400"} cursor-pointer`} onClick={() => setTodo(true)}>Tasks</button>
          <div className="text-3xl -translate-y-1 text-gray-400">|</div>
          <button title="notes" className={`text-xl md:text-3xl lg:text-3xl text-gray-400 hover:text-black ${todo ? "text-gray-400" : "text-black"} cursor-pointer`} onClick={() => setTodo(false)}>Notes</button>
        </div>
      </div>
      <div>
        {todo && <Todo />}
        {!todo && <Notes />}
      </div>
    </div>


  );
};

export default Page;
