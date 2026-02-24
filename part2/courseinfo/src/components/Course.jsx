const Header = (props) => (<h2>{props.course}</h2>)

const Part = ({part}) => (<p>{part.name} {part.exercises}</p>)

const Content = ({parts}) => (
  <>
    {parts.map(part => <Part key={part.id} part={part} />)}
  </>
)

const Total = ({parts}) => (<h4>Total of {parts.reduce((total,part) => {return total+part.exercises},0)} exercises</h4>)

const Course = ({course}) => (
  <div>
    <Header course={course.name}/>
    <Content parts={course.parts} />
    <Total parts={course.parts} />
  </div>
)

export default Course