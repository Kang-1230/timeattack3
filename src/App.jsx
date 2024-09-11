import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

export function App() {
  const queryClient = useQueryClient();

  const [writeTitle, setWriteTitle] = useState("");
  const [writeViews, setWriteViews] = useState(0);
  //이거어따쓰냐

  const { data, isPending, isError } = useQuery({
    queryKey: ["posts"],
    queryFn: () => axios.get("http://localhost:4000/posts"),
  });

  const { mutate } = useMutation({
    mutationFn: () =>
      axios.post("http://localhost:4000/posts", {
        title: writeTitle,
        views: writeViews,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries("posts");
    },
  });

  if (isPending) {
    return <div>로딩중입니다 ...</div>;
  }

  if (isError) {
    return <div>데이터 조회 중 오류가 발생했습니다.</div>;
  }

  return (
    <>
      <ul>
        {data.data.map((post) => {
          return (
            <div key={post.id}>
              <li>{post.title}</li>
              <li>{post.views}</li>
            </div>
          );
        })}
        <input
          type="text"
          value={writeTitle}
          placeholder="title"
          onChange={(e) => setWriteTitle(e.target.value)}
        />
        <input
          type="number"
          value={writeViews}
          placeholder="views"
          onChange={(e) => setWriteViews(e.target.value)}
        />
        <button onClick={() => mutate()}>추가</button>
      </ul>
    </>
  );
}
