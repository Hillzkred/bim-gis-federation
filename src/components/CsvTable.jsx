function CsvTable({ properties, values, removeFile }) {
  return (
    <div className='pt-1'>
      <div className='p-1' />
      <table className='border border-solid table-fixed w-full'>
        <tr>
          {properties.map((x) => {
            return <th>{x}</th>;
          })}
        </tr>
        <tr>
          {values.map((x) => {
            return <td>{x}</td>;
          })}
        </tr>
      </table>
      <div className='p-1' />
      <button
        className='p-1 bg-red-500 text-white rounded-sm'
        {...removeFile()}
      >
        Remove
      </button>
    </div>
  );
}

export default CsvTable;
