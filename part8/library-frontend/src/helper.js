export const bookToTableRow = (b) => (
  <tr key={b.title}>
    <td>{b.title}</td>
    <td>{b.author.name}</td>
    <td>{b.published}</td>
  </tr>
)