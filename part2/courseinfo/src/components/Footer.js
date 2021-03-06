const Footer = ({parts}) => (
    <p>
        Number of exercises{" "}
        {parts.reduce(
            (sum, part) => sum + part.exercises, 0
        )}
    </p>
)

export default Footer