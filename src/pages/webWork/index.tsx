import React, { useCallback, useEffect, useState } from "react";

// 校验是否能使用 Worker
const useWorker = typeof Worker !== "undefined";

const WebWork: React.FC = () => {
  const [resultStr, setResultStr] = useState<string>("");
  const [worker, setWorker] = useState<Worker | null>(null);
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(
    null
  );
  const [timeOutSecond, setTimeOutSecond] = useState<number>(60);

  useEffect(() => {
    if (!useWorker) {
      setResultStr("当前浏览器无法使用 web worker");
    }
  }, []);

  useEffect(() => {
    if (!worker) {
      if (useWorker) {
        setWorker(new Worker("./webWorkJs/main.js"));
      }
    } else {
      worker.onmessage = (e) => {
        console.timeEnd("web worker 解析");
        console.log(e.data);
        setResultStr(JSON.stringify(e.data, null, 4));
      };
    }

    return () => {
      timer && clearTimeout(timer);
    };
  }, [worker, timer]);

  const handleChange = useCallback(
    (e) => {
      if (worker) {
        const file = e.target.files[0];
        const render = new FileReader();
        render.onload = (e) => {
          let data = e.target?.result;
          data = new Uint8Array(data as ArrayBuffer);
          console.time("web worker 解析");
          worker.postMessage({ d: data, b: "array" });
        };
        render.onerror = (e) => {
          console.log(e);
        };
        const t = setTimeout(() => {
          worker.terminate();
          setResultStr("超时停止");
        }, timeOutSecond * 1000);
        setTimer(t);
        render.readAsArrayBuffer(file);
      }
    },
    [worker, timeOutSecond]
  );

  return (
    <div>
      <h2>WebWork 实验</h2>
      <br />
      <div
        style={{
          display: "flex",
          padding: "0 20px",
        }}
      >
        <div style={{ display: "inline-block" }}>
          <input type="file" accept=".xlsx, .csv" onChange={handleChange} />
          <br />
          <input
            value={timeOutSecond}
            onChange={(e) =>
              setTimeOutSecond(Number.parseFloat(e.target.value) || 0)
            }
          />
        </div>
        <div style={{ whiteSpace: "pre-wrap" }}>{resultStr}</div>
      </div>
    </div>
  );
};

export default WebWork;
