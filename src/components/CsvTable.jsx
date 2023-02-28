function CsvTable({ properties, values, removeFile }) {
  return (
    <div className='pt-1'>
      <div className='p-1' />
      <table className='border border-slate-500 border-separate table-fixed w-full text-center'>
        <tr className='bg-emerald-200'>
          {properties.map((x, index) => {
            return (
              <th className='border-slate-500' key={index}>
                {x}
              </th>
            );
          })}
        </tr>
        <tr>
          {values.map((x, index) => {
            return <td key={index}>{x}</td>;
          })}
        </tr>
      </table>
      <div className='p-1' />
    </div>
  );
}

export default CsvTable;
