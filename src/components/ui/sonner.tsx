import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      position="bottom-left"
      theme="dark"
      className="toaster group"
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: "term-toast",
          success: "term-toast--success",
          error: "term-toast--error",
          warning: "term-toast--warning",
          info: "term-toast--info",
          loading: "term-toast--loading",
          title: "term-toast__title",
          description: "term-toast__desc",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
