import { useCallback, useState } from "react";

// 递归解析 redux-persist 格式的数据
function parseReduxPersistData(data: unknown): unknown {
  if (typeof data === "string") {
    // 尝试解析字符串化的 JSON
    try {
      const parsed = JSON.parse(data);
      return parseReduxPersistData(parsed);
    } catch {
      // 不是 JSON 字符串，返回原值
      return data;
    }
  }

  if (Array.isArray(data)) {
    return data.map(parseReduxPersistData);
  }

  if (data !== null && typeof data === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      // 可以选择过滤掉 _persist 字段
      // if (key === '_persist') continue;
      result[key] = parseReduxPersistData(value);
    }
    return result;
  }

  return data;
}

export function ReduxPersistFileReader() {
  const [fileName, setFileName] = useState<string>("");

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setFileName(file.name);

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const rawData = JSON.parse(content);

          console.log("=== 原始数据 ===");
          console.log(rawData);

          const parsedData = parseReduxPersistData(rawData);

          console.log("=== 解析后的数据 ===");
          console.log(parsedData);
        } catch (error) {
          console.error("解析 JSON 文件失败:", error);
        }
      };

      reader.readAsText(file);

      // 清空 input 值，允许重新选择相同文件
      event.target.value = "";
    },
    []
  );

  return (
    <div style={{ padding: 20 }}>
      <label
        style={{
          display: "inline-block",
          padding: "10px 20px",
          backgroundColor: "#4a90d9",
          color: "white",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        选择 JSON 文件
        <input
          type="file"
          accept=".json,application/json"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </label>
      {fileName && (
        <span style={{ marginLeft: 12, color: "#666" }}>
          已选择: {fileName}
        </span>
      )}
    </div>
  );
}
