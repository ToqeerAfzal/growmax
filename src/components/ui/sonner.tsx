import { useTheme } from "next-themes"
import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-black group-[.toaster]:border-gray-200 group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-gray-700",
          actionButton:
            "group-[.toast]:bg-gray-100 group-[.toast]:text-black group-[.toast]:hover:bg-gray-200",
          cancelButton:
            "group-[.toast]:bg-gray-100 group-[.toast]:text-black group-[.toast]:hover:bg-gray-200",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
