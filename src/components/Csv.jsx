import { useState } from 'react';
import { useCSVReader } from 'react-papaparse';
import CsvTable from './CsvTable';

export default function Csv() {
  const [csvProperties, setCsvProperties] = useState([]);
  const [csvValues, setCsvValues] = useState([]);
  const [hideButton, setHideButton] = useState(false);
  const { CSVReader } = useCSVReader();
  return (
    <CSVReader
      onUploadAccepted={(results) => {
        setCsvProperties(results.data[0]);
        setCsvValues(results.data[1]);
        setHideButton(true);
      }}
    >
      {({ getRootProps, acceptedFile, ProgressBar, getRemoveFileProps }) => (
        <>
          <div className='w-full'>
            {!hideButton && (
              <label
                className='cursor-pointer bg-teal-500 p-2 rounded-md text-white hover:bg-teal-700 w-full text-center'
                htmlFor='inputTag'
              >
                Upload a csv
                <input {...getRootProps()} className='hidden' id='inputTag' />
              </label>
            )}
          </div>
          <div>
            {acceptedFile && (
              <>
                <CsvTable properties={csvProperties} values={csvValues} />
                {/* <button
                  className='p-1 bg-red-500 text-white rounded-sm'
                  {...getRemoveFileProps(() => {
                    setHideButton(false);
                  })}
                >
                  Remove
                </button> */}
              </>
            )}
          </div>
          <div className='pt-2' />
          <ProgressBar />
        </>
      )}
    </CSVReader>
  );
}
