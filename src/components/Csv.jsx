import { useState } from 'react';
import { useCSVReader } from 'react-papaparse';
import CsvTable from './CsvTable';

export default function Csv() {
  const [csvProperties, setCsvProperties] = useState([]);
  const [csvValues, setCsvValues] = useState([]);
  const { CSVReader } = useCSVReader();
  return (
    <CSVReader
      onUploadAccepted={(results) => {
        setCsvProperties(results.data[0]);
        setCsvValues(results.data[1]);
      }}
    >
      {({ getRootProps, acceptedFile, ProgressBar, getRemoveFileProps }) => (
        <>
          <div className='w-full'>
            <label
              className='cursor-pointer bg-teal-500 p-2 rounded-md text-white hover:bg-teal-700 w-full text-center'
              htmlFor='inputTag'
            >
              Upload a csv
              <input {...getRootProps()} className='hidden' id='inputTag' />
            </label>
            {acceptedFile && (
              <CsvTable
                properties={csvProperties}
                values={csvValues}
                removeFile={getRemoveFileProps}
              />
            )}
          </div>
          <div className='pt-2' />
          <ProgressBar />
        </>
      )}
    </CSVReader>
  );
}
