import { useQuery } from "@apollo/client";
import { USER_RECOMMENDED } from "../queries";
import { bookToTableRow } from "../helper";

const Recommendations = (props) => {
  
  const recommendationsResult = useQuery(USER_RECOMMENDED, {
    skip: !props.show
  })

  if (!props.show) {
    return null;
  }

  const userRecommended = (recommendationsResult.data && recommendationsResult.data.userRecommended)
  ? recommendationsResult.data.userRecommended
  : { favouriteGenre: null, books: [] };

  return (
    <div>
      <h2>recommendations</h2>
      <p>books in your favourite genre {userRecommended.favouriteGenre}</p>
      <table>
        <thead>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
        </thead>
        <tbody>
          {userRecommended.books.map(bookToTableRow)}
        </tbody>
      </table>
    </div>
  )
}

export default Recommendations;