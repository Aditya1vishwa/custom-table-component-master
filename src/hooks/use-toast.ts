// Simplified version of use-toast for this task

export const useToast = () => {
    return {
        toast: (props: { title: string; description?: string; variant?: "default" | "destructive" }) => {
            alert(props.title + " " + props.description)
        },
    }
}
