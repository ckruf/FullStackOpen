import Header from "./Header"
import Content from "./Content"
import Footer from "./Footer"

const Course = ({course}) => (
    <div>
        <Header course={course} />
        <Content course={course} />
        <Footer parts={course.parts} />
    </div>
)

export default Course