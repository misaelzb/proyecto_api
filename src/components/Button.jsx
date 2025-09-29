

export default function Button({ children, color = "orange", className, ...props }) {
    return <a className={`bg-${color}${color == "black" ? "" : "-200"} p-3 rounded-2xl cursor-pointer hover:shadow-lg transition-shadow ${className ?? ""}`} {...props}>
        {children}
    </a>
}