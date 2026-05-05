import "./SharedUI.css";

interface FormMessageProps {
  type: "error" | "success";
  message: string;
}

export function FormMessage({ type, message }: FormMessageProps) {
  return (
    <div
      className={
        type === "error"
          ? "form-message form-message--error"
          : "form-message form-message--success"
      }
      role={type === "error" ? "alert" : "status"}
    >
      {message}
    </div>
  );
}